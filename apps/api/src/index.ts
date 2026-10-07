import { createApp } from './app.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

const app = createApp();

const server = app.listen(config.port, () => {
  logger.info(`IAMS API server running`, {
    port: config.port,
    env: config.env,
    corsOrigin: config.corsOrigin,
  });
});

function shutdown(signal: string): void {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export { app, server };
