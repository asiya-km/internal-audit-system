import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);

dotenv.config({
  path: path.resolve(currentDir, '../../../../.env'),
});

function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
  port: parseInt(process.env.PORT ?? '4000', 10),
  databaseUrl: required('DATABASE_URL', 'postgresql://iams:iams@localhost:5432/iams?schema=public'),
  sessionSecret: required('SESSION_SECRET', 'dev-session-secret-change-in-production-32chars'),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  logLevel: process.env.LOG_LEVEL ?? 'info',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  cookieName: 'iams_token',
  cookieMaxAgeMs: 8 * 60 * 60 * 1000,
  rateLimitWindowMs: 15 * 60 * 1000,
  rateLimitMax: 100,
  authRateLimitWindowMs: 15 * 60 * 1000,
  authRateLimitMax: 10,
} as const;
