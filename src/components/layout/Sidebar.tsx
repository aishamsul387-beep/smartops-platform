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
    label: 'Batches',
    href: ROUTES.batches,
    permissions: [PERMISSIONS.INVENTORY_VIEW]
  },
  {
    label: 'Stock Control',
    href: ROUTES.stockControl,
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

const COLORS = {
  sidebarBg: '#0F172A',
  sidebarAlt: '#111C32',
  sidebarBorder: 'rgba(255,255,255,0.08)',
  brandText: '#FFFFFF',
  mutedText: '#94A3B8',
  badgeBg: 'rgba(20,184,166,0.14)',
  badgeText: '#99F6E4',
  itemText: '#E5E7EB',
  itemMuted: '#CBD5E1',
  itemActiveBg: 'linear-gradient(135deg, rgba(29,78,216,0.18) 0%, rgba(15,118,110,0.18) 100%)',
  itemActiveBorder: '#2DD4BF',
  itemActiveText: '#FFFFFF',
  itemShadow: '0 6px 16px rgba(15, 23, 42, 0.18)'
} as const;

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
        background: 'linear-gradient(180deg, ' + COLORS.sidebarBg + ' 0%, ' + COLORS.sidebarAlt + ' 100%)',
        color: COLORS.brandText,
        padding: '22px 18px',
        borderRight: '1px solid ' + COLORS.sidebarBorder,
        position: 'sticky',
        top: 0,
        alignSelf: 'start',
        boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.03)'
      }}
    >
      <div
        style={{
          marginBottom: '26px',
          padding: '8px 6px 14px 6px',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <div
          style={{
            fontSize: '20px',
            fontWeight: 800,
            marginBottom: '8px',
            letterSpacing: '-0.02em',
            color: COLORS.brandText
          }}
        >
          SmartOps WMS AI
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 10px',
            borderRadius: '999px',
            background: COLORS.badgeBg,
            color: COLORS.badgeText,
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'capitalize'
          }}
        >
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
                borderRadius: '12px',
                background: isActive ? COLORS.itemActiveBg : 'transparent',
                color: isActive ? COLORS.itemActiveText : COLORS.itemText,
                fontWeight: isActive ? 700 : 500,
                border: isActive
                  ? '1px solid ' + COLORS.itemActiveBorder
                  : '1px solid transparent',
                boxShadow: isActive ? COLORS.itemShadow : 'none',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: '24px',
          padding: '12px 10px 0 10px',
          color: COLORS.mutedText,
          fontSize: '12px',
          lineHeight: 1.6
        }}
      >
        Calm operations, clearer control, and friendlier daily warehouse workflows.
      </div>
    </aside>
  );
}
