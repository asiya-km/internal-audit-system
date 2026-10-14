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

const env = process.env.NODE_ENV ?? 'development';
const isProduction = env === 'production';

const sessionSecret = required('SESSION_SECRET', 'dev-session-secret-change-in-production-32chars');

const WEAK_SECRETS = [
  'dev-session-secret-change-in-production-32chars',
  'change-this-to-a-long-random-string-min-32-chars',
  '',
];

if (isProduction && (sessionSecret.length < 32 || WEAK_SECRETS.includes(sessionSecret))) {
  throw new Error(
    'SESSION_SECRET must be set to a strong secret (min 32 chars) in production. ' +
      'Do not use the development fallback.',
  );
}

const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

if (isProduction && corsOrigin === '*') {
  throw new Error('CORS_ORIGIN must not be "*" in production. Specify explicit allowed origins.');
}

export const config = {
  env,
  isProduction,
  isDevelopment: !isProduction,
  port: parseInt(process.env.PORT ?? '4000', 10),
  databaseUrl: required('DATABASE_URL', 'postgresql://iams:iams@localhost:5432/iams?schema=public'),
  sessionSecret,
  corsOrigin,
  logLevel: process.env.LOG_LEVEL ?? 'info',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  cookieName: 'iams_token',
  cookieMaxAgeMs: 8 * 60 * 60 * 1000,
  rateLimitWindowMs: 15 * 60 * 1000,
  rateLimitMax: 100,
  authRateLimitWindowMs: 15 * 60 * 1000,
  authRateLimitMax: 10,
} as const;