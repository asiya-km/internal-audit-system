import { Router } from 'express';
import { authenticate, requirePermission } from '../middleware/auth.js';
import { sendSuccess } from '../utils/response.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Example protected endpoint demonstrating authorization middleware.
// Returns the current user's permissions — gated behind the users.view permission.
router.get(
  '/permissions',
  authenticate,
  requirePermission('users.view'),
  (req: AuthenticatedRequest, res) => {
    sendSuccess(res, {
      permissions: req.user?.permissions ?? [],
      roles: req.user?.roles ?? [],
    });
  },
);

export default router;
