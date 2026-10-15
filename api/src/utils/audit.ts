import { AuditLog } from '../models/AuditLog';
import { logger } from '../config/logger';

export interface AuditParams {
  action: string;
  performedBy: {
    userId?: any;
    name: string;
    email: string;
    role: string;
  };
  targetType: 'user' | 'application' | 'session' | 'topic' | 'publication' | 'system';
  targetId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAuditEvent(params: AuditParams): Promise<void> {
  try {
    await AuditLog.create(params);
  } catch (err: any) {
    logger.error(`Failed to record audit log: ${err.message}`);
  }
}
