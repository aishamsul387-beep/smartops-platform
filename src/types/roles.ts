export const ROLES = ['admin', 'manager', 'operator', 'viewer'] as const;

export type Role = (typeof ROLES)[number];
