import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';
import { prisma } from '../config/db.js';
import type { UserDto } from '@iams/shared';

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
}

async function loadUserPermissions(userId: string): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: true },
              },
            },
          },
        },
      },
    },
  });

  if (!user || !user.isActive) return null;

  const roles = user.userRoles.map((ur) => ur.role.name);
  const permissions = [
    ...new Set(
      user.userRoles.flatMap((ur) =>
        ur.role.rolePermissions.map((rp) => rp.permission.name),
      ),
    ),
  ];

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles,
    permissions,
  };
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token =
      req.cookies?.[config.cookieName] ??
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : undefined);

    if (!token) {
      throw new AuthenticationError('No authentication token provided');
    }

    const decoded = jwt.verify(token, config.sessionSecret) as { sub: string };
    const user = await loadUserPermissions(decoded.sub);

    if (!user) {
      throw new AuthenticationError('User not found or inactive');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof AuthenticationError) {
      next(err);
    } else {
      next(new AuthenticationError('Invalid or expired token'));
    }
  }
}

export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AuthenticationError());
      return;
    }
    if (!req.user.permissions.includes(permission)) {
      next(new AuthorizationError());
      return;
    }
    next();
  };
}

export function toUserDto(user: AuthUser): UserDto {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isActive: true,
    lastLoginAt: null,
    roles: [],
    permissions: user.permissions,
  };
}
