import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { sendSuccess } from '../utils/response.js';
import { logger } from '../utils/logger.js';
import type { HealthResponse } from '@iams/shared';

export async function health(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const body: HealthResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: { database: 'connected' },
    };
    sendSuccess(res, body);
  } catch (err) {
    logger.error('Health check failed — database unreachable', {
      error: err instanceof Error ? err.message : 'unknown',
    });
    const body: HealthResponse = {
      status: 'degraded',
      timestamp: new Date().toISOString(),
      services: { database: 'disconnected' },
    };
    sendSuccess(res, body, 503);
  }
}
