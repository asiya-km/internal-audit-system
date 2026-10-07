import { PrismaClient } from '../generated/client/index.js';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export { prisma };
