import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { recordAudit } from '../services/audit.service.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticationError } from '../utils/errors.js';
import { config } from '../config/env.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { LoginRequest, LoginResponse, UserDto } from '@iams/shared';

const authService = new AuthService();

function clientIp(req: Request): string | undefined {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.ip;
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = req.body as LoginRequest;
    const { user, token } = await authService.login(email, password);

    res.cookie(config.cookieName, token, {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: config.isProduction ? 'strict' : 'lax',
      maxAge: config.cookieMaxAgeMs,
      path: '/',
    });

    recordAudit({
      action: 'login',
      category: 'auth',
      userId: user.id,
      ip: clientIp(req),
      userAgent: req.headers['user-agent'],
      metadata: { email: user.email },
      success: true,
    });

    const body: LoginResponse = { user };
    sendSuccess(res, body);
  } catch (err) {
    if (err instanceof AuthenticationError) {
      recordAudit({
        action: 'login_failed',
        category: 'auth',
        ip: clientIp(req),
        userAgent: req.headers['user-agent'],
        metadata: { email: (req.body as LoginRequest)?.email },
        success: false,
      });
    }
    next(err);
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthenticatedRequest;
  recordAudit({
    action: 'logout',
    category: 'auth',
    userId: authReq.user?.id,
    ip: clientIp(req),
    userAgent: req.headers['user-agent'],
  });
  res.clearCookie(config.cookieName, { path: '/' });
  sendSuccess(res, { message: 'Logged out successfully' });
}

export async function me(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError();
    }
    const user = await authService.getCurrentUser(req.user.id);
    sendSuccess<UserDto>(res, user);
  } catch (err) {
    next(err);
  }
}