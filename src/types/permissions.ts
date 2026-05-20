export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard.view',
  INVENTORY_VIEW: 'inventory.view',
  INVENTORY_MANAGE: 'inventory.manage',
  WAREHOUSE_VIEW: 'warehouse.view',
  WAREHOUSE_MANAGE: 'warehouse.manage',
  TASKS_VIEW: 'tasks.view',
  TASKS_MANAGE: 'tasks.manage',
  ORDERS_VIEW: 'orders.view',
  ORDERS_MANAGE: 'orders.manage',
  REPORTS_VIEW: 'reports.view',
  AI_USE: 'ai.use',
  USERS_MANAGE: 'users.manage'
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
