import { Suspense } from 'react';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';

function LoginPageFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        background: '#f8fafc',
        color: '#64748b',
        fontFamily: 'Arial, Helvetica, sans-serif'
      }}
    >
      Loading login...
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginScreen />
    </Suspense>
  );
}