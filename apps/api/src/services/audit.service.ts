import { prisma } from '../config/db.js';
import { logger } from '../utils/logger.js';
import type { Prisma } from '../generated/client/index.js';

export type AuditCategory = 'auth' | 'authorization' | 'admin' | 'data_access' | 'audit_universe';

export interface AuditEntry {
  action: string;
  category: AuditCategory;
  userId?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  success?: boolean;
}

export async function recordAudit(entry: AuditEntry): Promise<void> {
  try {
    const data: Prisma.AuditLogCreateInput = {
      action: entry.action,
      category: entry.category,
      userId: entry.userId ?? null,
      ip: entry.ip ?? null,
      userAgent: entry.userAgent ?? null,
      metadata: entry.metadata
        ? (entry.metadata as Prisma.InputJsonValue)
        : undefined,
      success: entry.success ?? true,
    };
    await prisma.auditLog.create({ data });
  } catch (err) {
    logger.error('Failed to write audit log', {
      action: entry.action,
      error: err instanceof Error ? err.message : 'unknown',
    });
  }
}