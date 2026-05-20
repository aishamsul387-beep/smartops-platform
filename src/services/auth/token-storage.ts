import type { AuthSession } from '@/types/auth';

const STORAGE_KEY =
  process.env.NEXT_PUBLIC_AUTH_STORAGE_KEY || 'smartops.session';

const SESSION_COOKIE_NAME = 'smartops.has_session';

function isBrowser() {
  return typeof window !== 'undefined';
}

function clearSessionCookie() {
  if (!isBrowser()) return;
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}

function writeSessionCookie(session: AuthSession) {
  if (!isBrowser()) return;

  let maxAgeSeconds = 60 * 60 * 8;

  if (session.expiresAt) {
    const expiresAt = new Date(session.expiresAt).getTime();
    const diffSeconds = Math.floor((expiresAt - Date.now()) / 1000);

    if (!Number.isNaN(diffSeconds) && diffSeconds > 0) {
      maxAgeSeconds = diffSeconds;
    }
  }

  document.cookie =
    `${SESSION_COOKIE_NAME}=1; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

function isSessionExpired(session: AuthSession) {
  if (!session.expiresAt) {
    return false;
  }

  const expiresAt = new Date(session.expiresAt).getTime();

  if (Number.isNaN(expiresAt)) {
    return false;
  }

  return expiresAt <= Date.now();
}

export function getStoredSession(): AuthSession | null {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AuthSession;

    if (isSessionExpired(parsed)) {
      window.localStorage.removeItem(STORAGE_KEY);
      clearSessionCookie();
      return null;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    clearSessionCookie();
    return null;
  }
}

export function saveStoredSession(session: AuthSession) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  writeSessionCookie(session);
}

export function clearStoredSession() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  clearSessionCookie();
}

export function getAccessToken(): string | null {
  return getStoredSession()?.accessToken ?? null;
}