'use client';

import { useState } from 'react';
import type { LoginRequest } from '@/types/auth';
import { setAuthSession } from '@/store/auth-store';
import { authApi } from '../api';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(payload: LoginRequest) {
    try {
      setIsLoading(true);
      setError(null);

      const session = await authApi.login(payload);
      setAuthSession(session);

      return session;
    } catch (err: any) {
      setError(err?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    login,
    isLoading,
    error
  };
}
