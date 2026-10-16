import type { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/response.js';
import { recordAudit } from '../services/audit.service.js';
import { ValidationError, NotFoundError, ConflictError } from '../utils/errors.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import * as repo from '../repositories/audit-entity.repository.js';
import type { AuditEntityWithRelations } from '../repositories/audit-entity.repository.js';
import type {
  AuditEntityDto,
  AuditEntityDetailDto,
  AuditEntityListResponse,
  AuditEntityType,
  AuditEntityStatus,
} from '@iams/shared';

function clientIp(req: Request): string | undefined {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.ip;
}

function toDto(entity: AuditEntityWithRelations): AuditEntityDto {
  return {
    id: entity.id,
    code: entity.code,
    name: entity.name,
    description: entity.description,
    entityType: entity.entityType as AuditEntityType,
    status: entity.status as AuditEntityStatus,
    parentId: entity.parentId,
    parentName: entity.parent?.name ?? null,
    ownerName: entity.ownerName,
    responsibleName: entity.responsibleName,
    classification: entity.classification,
    childCount: entity._count?.children ?? 0,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

function toDetailDto(
  entity: AuditEntityWithRelations,
  children: AuditEntityWithRelations[],
  createdBy: string | null,
  updatedBy: string | null,
): AuditEntityDetailDto {
  return {
    ...toDto(entity),
    children: children.map(toDto),
    createdBy,
    updatedBy,
  };
}

export async function list(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = req.query as unknown as Parameters<typeof repo.findMany>[0];
    const { items, total } = await repo.findMany(input);
    const filterOptions = await repo.getFilterOptions();

    const response: AuditEntityListResponse = {
      items: items.map(toDto),
      total,
      page: input.page,
      pageSize: input.pageSize,
      filters: {
        entityTypes: filterOptions.entityTypes as AuditEntityType[],
        statuses: filterOptions.statuses as AuditEntityStatus[],
      },
    };

    sendSuccess(res, response);
  } catch (err) {
    next(err);
  }
}

export async function getById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const entity = await repo.findById(id);

    if (!entity) {
      throw new NotFoundError('Audit entity not found');
    }

    const children = await repo.findChildren(id);

    const detail = toDetailDto(
      entity,
      children,
      null,
      null,
    );

    sendSuccess(res, detail);
  } catch (err) {
    next(err);
  }
}

export async function create(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;
    const data = req.body;

    // Check for duplicate code
    const existing = await repo.findByCode(data.code);
    if (existing) {
      throw new ConflictError(`An entity with code "${data.code}" already exists`);
    }

    // Validate parent exists if specified
    if (data.parentId) {
      const parent = await repo.findById(data.parentId);
      if (!parent) {
        throw new ValidationError('The specified parent entity does not exist', {
          issues: [{ path: 'parentId', message: 'Parent entity not found' }],
        });
      }
    }

    const entity = await repo.create(data, userId);

    recordAudit({
      action: 'audit_entity_created',
      category: 'data_access',
      userId,
      ip: clientIp(req),
      userAgent: req.headers['user-agent'],
      metadata: {
        entityId: entity.id,
        code: entity.code,
        name: entity.name,
        entityType: entity.entityType,
      },
    });

    sendSuccess(res, toDto(entity), 201);
  } catch (err) {
    next(err);
  }
}

export async function update(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const data = req.body;

    const existing = await repo.findById(id);
    if (!existing) {
      throw new NotFoundError('Audit entity not found');
    }

    // Validate parent exists and prevent circular reference
    if (data.parentId !== undefined && data.parentId !== null) {
      const parent = await repo.findById(data.parentId);
      if (!parent) {
        throw new ValidationError('The specified parent entity does not exist', {
          issues: [{ path: 'parentId', message: 'Parent entity not found' }],
        });
      }

      const isCircular = await repo.checkCircularReference(id, data.parentId);
      if (isCircular) {
        throw new ValidationError(
          'Cannot set parent: this would create a circular hierarchy',
          { issues: [{ path: 'parentId', message: 'Circular reference detected' }] },
        );
      }
    }

    const entity = await repo.update(id, data, userId);

    recordAudit({
      action: 'audit_entity_updated',
      category: 'data_access',
      userId,
      ip: clientIp(req),
      userAgent: req.headers['user-agent'],
      metadata: {
        entityId: entity.id,
        code: entity.code,
        changes: Object.keys(data),
      },
    });

    sendSuccess(res, toDto(entity));
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { status } = req.body;

    const existing = await repo.findById(id);
    if (!existing) {
      throw new NotFoundError('Audit entity not found');
    }

    // Prevent archiving an entity with active children
    if (status === 'ARCHIVED') {
      const children = await repo.findChildren(id);
      const hasActiveChildren = children.some((c) => c.status === 'ACTIVE');
      if (hasActiveChildren) {
        throw new ValidationError(
          'Cannot archive an entity that has active child entities. Archive or deactivate children first.',
          { issues: [{ path: 'status', message: 'Active children exist' }] },
        );
      }
    }

    const entity = await repo.updateStatus(id, status, userId);

    recordAudit({
      action: 'audit_entity_status_changed',
      category: 'data_access',
      userId,
      ip: clientIp(req),
      userAgent: req.headers['user-agent'],
      metadata: {
        entityId: entity.id,
        code: entity.code,
        oldStatus: existing.status,
        newStatus: status,
      },
    });

    sendSuccess(res, toDto(entity));
  } catch (err) {
    next(err);
  }
}
