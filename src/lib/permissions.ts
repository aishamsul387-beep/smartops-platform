import type { AuthUser } from '@/types/auth';
import { PERMISSIONS, type Permission } from '@/types/permissions';
import type { Role } from '@/types/roles';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_MANAGE,
    PERMISSIONS.WAREHOUSE_VIEW,
    PERMISSIONS.WAREHOUSE_MANAGE,
    PERMISSIONS.TASKS_VIEW,
    PERMISSIONS.TASKS_MANAGE,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_MANAGE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.AI_USE,
    PERMISSIONS.USERS_MANAGE
  ],
  manager: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_MANAGE,
    PERMISSIONS.WAREHOUSE_VIEW,
    PERMISSIONS.TASKS_VIEW,
    PERMISSIONS.TASKS_MANAGE,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_MANAGE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.AI_USE
  ],
  operator: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.WAREHOUSE_VIEW,
    PERMISSIONS.TASKS_VIEW,
    PERMISSIONS.TASKS_MANAGE,
    PERMISSIONS.ORDERS_VIEW
  ],
  viewer: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.WAREHOUSE_VIEW,
    PERMISSIONS.TASKS_VIEW,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.REPORTS_VIEW
  ]
};

function getEffectivePermissions(user?: AuthUser | null): Permission[] {
  if (!user) return [];

  const rolePermissions = ROLE_PERMISSIONS[user.role] ?? [];
  const directPermissions = user.permissions ?? [];

  return Array.from(new Set([...rolePermissions, ...directPermissions]));
}

export function hasPermission(
  user: AuthUser | null | undefined,
  permission: Permission
): boolean {
  return getEffectivePermissions(user).includes(permission);
}

export function hasAnyPermission(
  user: AuthUser | null | undefined,
  permissions: Permission[]
): boolean {
  const effective = getEffectivePermissions(user);
  return permissions.some((permission) => effective.includes(permission));
}

export function hasAllPermissions(
  user: AuthUser | null | undefined,
  permissions: Permission[]
): boolean {
  const effective = getEffectivePermissions(user);
  return permissions.every((permission) => effective.includes(permission));
}
