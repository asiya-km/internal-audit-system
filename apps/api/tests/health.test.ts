import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('GET /api/health', () => {
  it('should return health status with valid structure', async () => {
    const res = await request(app).get('/api/health');

    expect([200, 503]).toContain(res.status);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('status');
    expect(res.body.data).toHaveProperty('timestamp');
    expect(res.body.data.services).toHaveProperty('database');
  });

  it('should report database connectivity status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.body.data.services.database).toMatch(/connected|disconnected/);
  });
});
