import { db } from '../../../infrastructure/db';
import { env } from '../../../config/env';

export interface AuditLogInput {
  action: string;
  entityType: string;
  entityId: string;
  businessId: string;
  staffId: string;
  metadata?: Record<string, unknown>;
}

export class AuditService {
  async log(input: AuditLogInput): Promise<void> {
    if (!env.AUDIT_ENABLED) return;

    try {
      await db.none(
        `
        INSERT INTO audit_logs (
          action,
          entity_type,
          entity_id,
          business_id,
          staff_id,
          metadata,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        `,
        [
          input.action,
          input.entityType,
          input.entityId,
          input.businessId,
          input.staffId,
          JSON.stringify(input.metadata ?? {}),
        ]
      );
    } catch (error) {
      console.warn('Audit log write skipped:', error);
    }
  }
}
