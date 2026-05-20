'use client';

import type { ReactNode } from 'react';
import type { AuthUser } from '@/types/auth';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface AppShellProps {
  user: AuthUser;
  children: ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'grid',
        gridTemplateColumns: '260px 1fr'
      }}
    >
      <Sidebar user={user} />

      <main style={{ minWidth: 0 }}>
        <div style={{ padding: '24px' }}>
          <Topbar user={user} />
          {children}
        </div>
      </main>
    </div>
  );
}