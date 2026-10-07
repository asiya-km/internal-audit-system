import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';

export function createApp(): express.Express {
  const app = express();

  // ---- Security middleware ----
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false, limit: '1mb' }));
  app.use(cookieParser());

  // ---- Logging ----
  app.use(
    morgan(config.isProduction ? 'combined' : 'dev', {
      stream: { write: (msg) => logger.http(msg.trim()) },
    }),
  );

  // ---- Global rate limiter ----
  app.use(
    rateLimit({
      windowMs: config.rateLimitWindowMs,
      max: config.rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // ---- Routes ----
  app.use('/api', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);

  // ---- 404 + error handling (must be last) ----
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
