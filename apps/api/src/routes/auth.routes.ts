import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, me } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema } from '../schemas/auth.schema.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many login attempts, try again later' } },
});

router.post('/login', authLimiter, validateBody(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authenticate, me);

export default router;
