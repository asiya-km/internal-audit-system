import { Router } from 'express';
import { authenticate, requirePermission } from '../middleware/auth.js';
import { getDashboardMetrics } from '../controllers/dashboard.controller.js';

const router = Router();

// Dashboard metrics require authentication. Any authenticated user can view
// the dashboard — the data returned is scoped to what the user's permissions
// allow. As business modules are added, individual metrics will check
// specific permissions before returning data.
router.get(
  '/metrics',
  authenticate,
  getDashboardMetrics,
);

export default router;
