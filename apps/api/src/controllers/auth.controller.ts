import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticationError } from '../utils/errors.js';
import { config } from '../config/env.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { LoginRequest, LoginResponse, UserDto } from '@iams/shared';

const authService = new AuthService();

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

    const body: LoginResponse = { user };
    sendSuccess(res, body);
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
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
