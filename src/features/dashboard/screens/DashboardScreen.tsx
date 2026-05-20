'use client';

import { useSession } from '@/features/auth/hooks/useSession';
import { useLogout } from '@/features/auth/hooks/useLogout';

export function DashboardScreen() {
  const { session } = useSession();
  const { logout } = useLogout();

  return (
    <div className="container">
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '24px',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>
              Dashboard
            </div>
            <div style={{ color: '#475569', lineHeight: 1.6 }}>
              Sprint 1 foundation is in place. This is your first protected route.
            </div>
          </div>

          <button
            type="button"
            onClick={() => void logout()}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px'
          }}
        >
          <div style={{ color: '#64748b', marginBottom: '8px' }}>User</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>
            {session?.user?.name || 'Unknown'}
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px'
          }}
        >
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Role</div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>
            {session?.user?.role || 'n/a'}
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px'
          }}
        >
          <div style={{ color: '#64748b', marginBottom: '8px' }}>Email</div>
          <div style={{ fontSize: '18px', fontWeight: 700, wordBreak: 'break-word' }}>
            {session?.user?.email || 'n/a'}
          </div>
        </div>
      </div>
    </div>
  );
}
