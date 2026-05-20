'use client';

import { usePathname } from 'next/navigation';
import { useLogout } from '@/features/auth/hooks/useLogout';
import type { AuthUser } from '@/types/auth';

interface TopbarProps {
  user: AuthUser;
}

function getPageTitle(pathname: string | null) {
  if (!pathname) return 'SmartOps WMS AI';
  if (pathname.startsWith('/inventory/create')) return 'Create Inventory Item';
  if (pathname.startsWith('/inventory/')) return 'Inventory Detail';
  if (pathname.startsWith('/inventory')) return 'Inventory';
  if (pathname.startsWith('/warehouse/locations')) return 'Warehouse Locations';
  if (pathname.startsWith('/warehouse/tasks/')) return 'Task Detail';
  if (pathname.startsWith('/warehouse/tasks')) return 'Warehouse Tasks';
  if (pathname.startsWith('/warehouse')) return 'Warehouse';
  if (pathname.startsWith('/orders/quotations')) return 'Quotations';
  if (pathname.startsWith('/orders/purchase-orders/create')) return 'Create Purchase Order';
  if (pathname.startsWith('/orders/purchase-orders/')) return 'Purchase Order Detail';
  if (pathname.startsWith('/orders/purchase-orders')) return 'Purchase Orders';
  if (pathname.startsWith('/orders/goods-received-notes/create')) return 'Create GRN';
  if (pathname.startsWith('/orders/goods-received-notes/')) return 'GRN Detail';
  if (pathname.startsWith('/orders/goods-received-notes')) return 'Goods Received Notes';
  if (pathname.startsWith('/orders/supplier-invoices')) return 'Supplier Invoices';
  if (pathname.startsWith('/orders/supplier-credit-notes')) return 'Supplier Credit Notes';
  if (pathname.startsWith('/orders/returns')) return 'Returns';
  if (pathname.startsWith('/orders')) return 'Orders';
  if (pathname.startsWith('/reports')) return 'Reports';
  if (pathname.startsWith('/ai-assistant')) return 'AI Assistant';
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  return 'SmartOps WMS AI';
}

export function Topbar({ user }: TopbarProps) {
  const pathname = usePathname();
  const { logout } = useLogout();

  return (
    <header
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '18px 20px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}
    >
      <div>
        <div style={{ fontSize: '26px', fontWeight: 800, marginBottom: '4px' }}>
          {getPageTitle(pathname)}
        </div>
        <div style={{ color: '#64748b' }}>
          Signed in as <strong>{user.name}</strong> · {user.email}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
    </header>
  );
}