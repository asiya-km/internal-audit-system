import { Router } from 'express';
import { authenticate, requirePermission } from '../middleware/auth.js';
import { validateBody, validateQuery, validateParams } from '../middleware/validate.js';
import { uuidSchema } from '../schemas/auth.schema.js';
import {
  listAuditEntitiesSchema,
  createAuditEntitySchema,
  updateAuditEntitySchema,
  updateEntityStatusSchema,
} from '../schemas/audit-entity.schema.js';
import * as controller from '../controllers/audit-entity.controller.js';

const router = Router();

router.get(
  '/',
  authenticate,
  requirePermission('audit_universe.view'),
  validateQuery(listAuditEntitiesSchema),
  controller.list,
);

router.get(
  '/:id',
  authenticate,
  requirePermission('audit_universe.view'),
  validateParams(uuidSchema),
  controller.getById,
);

router.post(
  '/',
  authenticate,
  requirePermission('audit_universe.create'),
  validateBody(createAuditEntitySchema),
  controller.create,
);

router.put(
  '/:id',
  authenticate,
  requirePermission('audit_universe.update'),
  validateParams(uuidSchema),
  validateBody(updateAuditEntitySchema),
  controller.update,
);

router.patch(
  '/:id/status',
  authenticate,
  requirePermission('audit_universe.update'),
  validateParams(uuidSchema),
  validateBody(updateEntityStatusSchema),
  controller.updateStatus,
);

export default router;
