import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { UserRepository } from '../repositories/user.repository.js';
import { mapUserToDto } from './auth.mapper.js';
import { AuthenticationError } from '../utils/errors.js';
import type { UserDto } from '@iams/shared';
import { logger } from '../utils/logger.js';

export class AuthService {
  constructor(private readonly users: UserRepository = new UserRepository()) {}

  async login(email: string, password: string): Promise<{ user: UserDto; token: string }> {
    let user;
    try {
      user = await this.users.findByEmail(email.toLowerCase().trim());
    } catch {
      throw new AuthenticationError('Invalid email or password');
    }

    if (!user || !user.isActive) {
      throw new AuthenticationError('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AuthenticationError('Invalid email or password');
    }

    await this.users.updateLastLogin(user.id);

    const token = jwt.sign({ sub: user.id }, config.sessionSecret, {
      expiresIn: Math.floor(config.cookieMaxAgeMs / 1000),
    });

    logger.info('User logged in', { userId: user.id, email: user.email });

    return { user: mapUserToDto(user), token };
  }

  async getCurrentUser(userId: string): Promise<UserDto> {
    let user;
    try {
      user = await this.users.findById(userId);
    } catch {
      throw new AuthenticationError('User not found or inactive');
    }
    if (!user || !user.isActive) {
      throw new AuthenticationError('User not found or inactive');
    }
    return mapUserToDto(user);
  }
}