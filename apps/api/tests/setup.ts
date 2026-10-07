import dotenv from 'dotenv';

dotenv.config();

// Ensure test environment uses test-safe defaults
process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
process.env.SESSION_SECRET = process.env.SESSION_SECRET ?? 'test-session-secret-32chars-min';
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgresql://iams:iams@localhost:5432/iams?schema=public';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
