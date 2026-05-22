'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { hasAnyPermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/types/permissions';
import type { AuthUser } from '@/types/auth';

interface SidebarProps {
  user: AuthUser;
}

interface NavItem {
  label: string;
  href: string;
  permissions: string[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.dashboard,
    permissions: [PERMISSIONS.DASHBOARD_VIEW]
  },
  {
    label: 'Inventory',
    href: ROUTES.inventory,
    permissions: [PERMISSIONS.INVENTORY_VIEW]
  },
  {
    label: 'UOM',
    href: ROUTES.uom,
    permissions: [PERMISSIONS.INVENTORY_VIEW]
  },
  {
    label: 'Warehouse',
    href: ROUTES.warehouse,
    permissions: [PERMISSIONS.WAREHOUSE_VIEW]
  },
  {
    label: 'Tasks',
    href: ROUTES.warehouseTasks,
    permissions: [PERMISSIONS.TASKS_VIEW]
  },
  {
    label: 'Orders',
    href: ROUTES.orders,
    permissions: [PERMISSIONS.ORDERS_VIEW]
  },
  {
    label: 'Reports',
    href: ROUTES.reports,
    permissions: [PERMISSIONS.REPORTS_VIEW]
  },
  {
    label: 'AI Assistant',
    href: ROUTES.aiAssistant,
    permissions: [PERMISSIONS.AI_USE]
  }
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter((item) =>
    hasAnyPermission(user, item.permissions as any)
  );

  return (
    <aside
      style={{
        width: '260px',
        minHeight: '100vh',
        background: '#0f172a',
        color: '#ffffff',
        padding: '20px',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky',
        top: 0,
        alignSelf: 'start'
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
          SmartOps WMS AI
        </div>
        <div style={{ fontSize: '13px', color: '#94a3b8' }}>
          Role: {user.role}
        </div>
      </div>

      <nav style={{ display: 'grid', gap: '10px' }}>
        {visibleItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== ROUTES.dashboard && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'block',
                padding: '12px 14px',
                borderRadius: '10px',
                background: isActive ? '#1e293b' : 'transparent',
                color: '#ffffff',
                fontWeight: isActive ? 700 : 500,
                border: isActive ? '1px solid #334155' : '1px solid transparent'
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}