'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { clearAuthState } from '@/store/auth-store';
import { authApi } from '../api';

export function useLogout() {
  const router = useRouter();

  async function logout() {
    await authApi.logout();
    clearAuthState();
    router.replace(ROUTES.login);
    router.refresh();
  }

  return { logout };
}
