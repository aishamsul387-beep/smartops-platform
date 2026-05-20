'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { hasAnyPermission } from '@/lib/permissions';
import type { Permission } from '@/types/permissions';
import { hydrateAuthFromStorage, useAuthStore } from '@/store/auth-store';
import { AppShell } from './AppShell';

interface ProtectedLayoutProps {
  children: ReactNode;
  permissions?: Permission[];
}

export function ProtectedLayout({
  children,
  permissions = []
}: ProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, session } = useAuthStore();

  useEffect(() => {
    if (status === 'unknown') {
      void hydrateAuthFromStorage();
    }
  }, [status]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      const next = encodeURIComponent(pathname || ROUTES.dashboard);
      router.replace(`${ROUTES.login}?next=${next}`);
      return;
    }

    if (
      status === 'authenticated' &&
      permissions.length > 0 &&
      !hasAnyPermission(session?.user, permissions)
    ) {
      router.replace(ROUTES.unauthorized);
    }
  }, [status, pathname, permissions, router, session]);

  if (status === 'unknown') {
    return (
      <div style={{ padding: '24px', color: '#64748b' }}>
        Loading session...
      </div>
    );
  }

  if (status !== 'authenticated' || !session?.user) {
    return null;
  }

  if (
    permissions.length > 0 &&
    !hasAnyPermission(session.user, permissions)
  ) {
    return null;
  }

  return <AppShell user={session.user}>{children}</AppShell>;
}