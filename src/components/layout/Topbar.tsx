'use client';

import { usePathname } from 'next/navigation';
import { useLogout } from '@/features/auth/hooks/useLogout';
import type { AuthUser } from '@/types/auth';

interface TopbarProps {
  user: AuthUser;
}

const COLORS = {
  cardBg: '#FFFFFF',
  tintBlue: '#EFF6FF',
  tintTeal: '#F0FDFA',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  text: '#111827',
  textSoft: '#475569',
  textMuted: '#64748B',
  navy: '#0F172A',
  blue: '#1D4ED8',
  teal: '#0F766E'
} as const;

function getPageTitle(pathname: string | null) {
  if (!pathname) return 'SmartOps WMS AI';
  if (pathname.startsWith('/stock-control')) return 'Stock Control / Forecasting';
  if (pathname.startsWith('/batches')) return 'Batch / Expiry Control';
  if (pathname.startsWith('/uom')) return 'UOM / Multi-UOM Conversion';
  if (pathname.startsWith('/inventory/create')) return 'Create Inventory Item';
  if (pathname.startsWith('/inventory/') && pathname.endsWith('/edit')) return 'Edit Inventory Item';
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
        background: 'linear-gradient(135deg, ' + COLORS.tintBlue + ' 0%, ' + COLORS.tintTeal + ' 100%)',
        border: '1px solid ' + COLORS.border,
        borderRadius: '20px',
        padding: '18px 20px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)'
      }}
    >
      <div>
        <div
          style={{
            fontSize: '28px',
            fontWeight: 800,
            marginBottom: '4px',
            color: COLORS.navy,
            letterSpacing: '-0.02em'
          }}
        >
          {getPageTitle(pathname)}
        </div>
        <div style={{ color: COLORS.textSoft, lineHeight: 1.6 }}>
          Signed in as <strong style={{ color: COLORS.navy }}>{user.name}</strong> â€¢ {user.email}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => void logout()}
          style={{
            padding: '10px 16px',
            borderRadius: '12px',
            border: '1px solid ' + COLORS.borderStrong,
            background: '#ffffff',
            cursor: 'pointer',
            fontWeight: 700,
            color: COLORS.navy
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
