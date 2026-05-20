'use client';

import { useSyncExternalStore } from 'react';
import type { AuthSession } from '@/types/auth';
import {
  clearStoredSession,
  getStoredSession,
  saveStoredSession
} from '@/services/auth/token-storage';

export type AuthStatus = 'unknown' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  session: AuthSession | null;
}

let state: AuthState = {
  status: 'unknown',
  session: null
};

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setState(partial: Partial<AuthState>) {
  state = { ...state, ...partial };
  emitChange();
}

export function setAuthSession(session: AuthSession) {
  saveStoredSession(session);
  setState({
    status: 'authenticated',
    session
  });
}

export function clearAuthState() {
  clearStoredSession();
  setState({
    status: 'unauthenticated',
    session: null
  });
}

export async function hydrateAuthFromStorage() {
  const session = getStoredSession();

  if (!session) {
    clearAuthState();
    return null;
  }

  setState({
    status: 'authenticated',
    session
  });

  return session;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useAuthStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
