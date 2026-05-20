'use client';

import { useEffect } from 'react';
import { hydrateAuthFromStorage, useAuthStore } from '@/store/auth-store';

export function useSession() {
  const auth = useAuthStore();

  useEffect(() => {
    if (auth.status === 'unknown') {
      void hydrateAuthFromStorage();
    }
  }, [auth.status]);

  return auth;
}
