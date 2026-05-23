'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { useLogin } from '../hooks/useLogin';
import { useSession } from '../hooks/useSession';
import {
  type LoginFormErrors,
  type LoginFormValues,
  validateLoginForm
} from '../schema';

const initialValues: LoginFormValues = {
  email: '',
  password: ''
};

function getSafeNextPath(value: string | null) {
  if (!value) {
    return ROUTES.dashboard;
  }

  if (!value.startsWith('/') || value.startsWith('//')) {
    return ROUTES.dashboard;
  }

  return value;
}

export function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error } = useLogin();
  const { status } = useSession();

  const [values, setValues] = useState<LoginFormValues>(initialValues);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

  const nextPath = useMemo(() => {
    return getSafeNextPath(searchParams.get('next'));
  }, [searchParams]);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(ROUTES.dashboard);
      router.refresh();
    }
  }, [router, status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateLoginForm(values);
    setErrors(result.errors);

    if (!result.isValid) {
      return;
    }

    try {
      await login(values);
      router.replace(nextPath);
      router.refresh();
    } catch {
      // handled by hook state
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)'
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
            SmartOps WMS AI
          </div>
          <div style={{ color: '#475569', lineHeight: 1.5 }}>
            Sign in to continue to your warehouse operations workspace.
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="email"
              style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  email: event.target.value
                }))
              }
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                outline: 'none'
              }}
            />
            {errors.email ? (
              <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>
                {errors.email}
              </div>
            ) : null}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="password"
              style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={values.password}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  password: event.target.value
                }))
              }
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                outline: 'none'
              }}
            />
            {errors.password ? (
              <div style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>
                {errors.password}
              </div>
            ) : null}
          </div>

          {error ? (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px',
                borderRadius: '10px',
                background: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca'
              }}
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              background: isLoading ? '#94a3b8' : '#0f172a',
              color: '#ffffff',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 600
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: '16px', color: '#64748b', fontSize: '14px' }}>
          Redirect after login: <strong>{nextPath}</strong>
        </div>

        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '10px',
            background: '#f8fafc',
            color: '#475569',
            border: '1px solid #e2e8f0',
            fontSize: '13px'
          }}
        >
          Active API base:
          <div style={{ marginTop: '6px', fontWeight: 700, wordBreak: 'break-all' }}>
            {apiBaseUrl}
          </div>
        </div>
      </div>
    </div>
  );
}