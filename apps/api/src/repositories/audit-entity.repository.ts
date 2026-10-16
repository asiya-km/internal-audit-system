import { prisma } from '../config/db.js';
import type { Prisma, AuditEntity } from '../generated/client/index.js';
import type { ListAuditEntitiesInput, CreateAuditEntityInput, UpdateAuditEntityInput } from '../schemas/audit-entity.schema.js';

const SORT_COLUMNS: Record<string, string> = {
  code: 'code',
  name: 'name',
  entityType: 'entityType',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

export interface AuditEntityWithRelations extends AuditEntity {
  parent: { id: string; name: string } | null;
  _count: { children: number };
}

function buildWhere(input: ListAuditEntitiesInput): Prisma.AuditEntityWhereInput {
  const where: Prisma.AuditEntityWhereInput = {};

  if (input.search) {
    where.OR = [
      { code: { contains: input.search, mode: 'insensitive' } },
      { name: { contains: input.search, mode: 'insensitive' } },
      { description: { contains: input.search, mode: 'insensitive' } },
    ];
  }

  if (input.entityType) {
    where.entityType = input.entityType;
  }

  if (input.status) {
    where.status = input.status;
  }

  if (input.parentId) {
    where.parentId = input.parentId;
  }

  return where;
}

function buildOrderBy(input: ListAuditEntitiesInput): Prisma.AuditEntityOrderByWithRelationInput {
  const column = input.sortBy ? SORT_COLUMNS[input.sortBy] ?? 'createdAt' : 'createdAt';
  const order = input.sortOrder ?? 'desc';
  return { [column]: order };
}

export async function findMany(
  input: ListAuditEntitiesInput,
): Promise<{ items: AuditEntityWithRelations[]; total: number }> {
  const where = buildWhere(input);
  const orderBy = buildOrderBy(input);

  const [items, total] = await Promise.all([
    prisma.auditEntity.findMany({
      where,
      orderBy,
      skip: (input.page - 1) * input.pageSize,
      take: input.pageSize,
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { children: true } },
      },
    }),
    prisma.auditEntity.count({ where }),
  ]);

  return { items, total };
}

export async function findById(id: string): Promise<AuditEntityWithRelations | null> {
  return prisma.auditEntity.findUnique({
    where: { id },
    include: {
      parent: { select: { id: true, name: true } },
      _count: { select: { children: true } },
    },
  });
}

export async function findChildren(parentId: string): Promise<AuditEntityWithRelations[]> {
  return prisma.auditEntity.findMany({
    where: { parentId },
    orderBy: { name: 'asc' },
    include: {
      parent: { select: { id: true, name: true } },
      _count: { select: { children: true } },
    },
  });
}

export async function findByCode(code: string): Promise<AuditEntity | null> {
  return prisma.auditEntity.findUnique({ where: { code } });
}

export async function create(
  data: CreateAuditEntityInput,
  userId: string,
): Promise<AuditEntityWithRelations> {
  return prisma.auditEntity.create({
    data: {
      code: data.code,
      name: data.name,
      description: data.description,
      entityType: data.entityType,
      parentId: data.parentId,
      ownerName: data.ownerName,
      responsibleName: data.responsibleName,
      classification: data.classification,
      createdById: userId,
      updatedById: userId,
    },
    include: {
      parent: { select: { id: true, name: true } },
      _count: { select: { children: true } },
    },
  });
}

export async function update(
  id: string,
  data: UpdateAuditEntityInput,
  userId: string,
): Promise<AuditEntityWithRelations> {
  const updateData: Prisma.AuditEntityUpdateInput = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.entityType !== undefined) updateData.entityType = data.entityType;
  if (data.ownerName !== undefined) updateData.ownerName = data.ownerName;
  if (data.responsibleName !== undefined) updateData.responsibleName = data.responsibleName;
  if (data.classification !== undefined) updateData.classification = data.classification;
  if (data.parentId !== undefined) {
    updateData.parent = data.parentId
      ? { connect: { id: data.parentId } }
      : { disconnect: true };
  }
  updateData.updatedBy = { connect: { id: userId } };

  return prisma.auditEntity.update({
    where: { id },
    data: updateData,
    include: {
      parent: { select: { id: true, name: true } },
      _count: { select: { children: true } },
    },
  });
}

export async function updateStatus(
  id: string,
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED',
  userId: string,
): Promise<AuditEntityWithRelations> {
  return prisma.auditEntity.update({
    where: { id },
    data: {
      status,
      updatedBy: { connect: { id: userId } },
    },
    include: {
      parent: { select: { id: true, name: true } },
      _count: { select: { children: true } },
    },
  });
}

export async function countChildren(parentId: string): Promise<number> {
  return prisma.auditEntity.count({ where: { parentId } });
}

export async function checkCircularReference(
  entityId: string,
  proposedParentId: string,
): Promise<boolean> {
  let currentParentId: string | null = proposedParentId;
  const visited = new Set<string>([entityId]);

  while (currentParentId) {
    if (visited.has(currentParentId)) return true;
    visited.add(currentParentId);

    const parent = await prisma.auditEntity.findUnique({
      where: { id: currentParentId },
      select: { parentId: true },
    });
    currentParentId = parent?.parentId ?? null;
  }

  return false;
}

export async function getFilterOptions(): Promise<{
  entityTypes: string[];
  statuses: string[];
}> {
  const types = await prisma.auditEntity.findMany({
    where: { status: 'ACTIVE' },
    select: { entityType: true },
    distinct: ['entityType'],
    orderBy: { entityType: 'asc' },
  });
  return {
    entityTypes: types.map((t) => t.entityType),
    statuses: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
  };
}
