'use client';

import { useEffect } from 'react';
import { hydrateAuthFromStorage } from '@/store/auth-store';

const REFRESH_INTERVAL_MS = Number(
  process.env.NEXT_PUBLIC_SESSION_REFRESH_INTERVAL_MS || '300000'
);

export function AuthSessionBootstrap() {
  useEffect(() => {
    void hydrateAuthFromStorage();

    const interval = window.setInterval(() => {
      void hydrateAuthFromStorage();
    }, Number.isNaN(REFRESH_INTERVAL_MS) ? 300000 : REFRESH_INTERVAL_MS);

    const onStorage = (event: StorageEvent) => {
      if (event.key?.includes('smartops') || event.key === null) {
        void hydrateAuthFromStorage();
      }
    };

    const onFocus = () => {
      void hydrateAuthFromStorage();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  return null;
}