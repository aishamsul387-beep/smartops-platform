import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function UnauthorizedPage() {
  return (
    <div className="container">
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '40px'
        }}
      >
        <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
          Unauthorized
        </div>
        <div style={{ color: '#475569', marginBottom: '16px' }}>
          You do not have permission to access this page.
        </div>
        <Link href={ROUTES.login} style={{ color: '#2563eb', fontWeight: 600 }}>
          Go to login
        </Link>
      </div>
    </div>
  );
}
