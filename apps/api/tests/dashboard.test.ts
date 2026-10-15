import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('Dashboard: GET /api/dashboard/metrics', () => {
  it('should reject unauthenticated access', async () => {
    const res = await request(app).get('/api/dashboard/metrics');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('AUTHENTICATION_ERROR');
  });

  it('should reject with malformed token', async () => {
    const res = await request(app)
      .get('/api/dashboard/metrics')
      .set('Authorization', 'Bearer invalid-token');
    expect(res.status).toBe(401);
  });

  it('should return 404 for unknown dashboard sub-route', async () => {
    const res = await request(app).get('/api/dashboard/unknown');
    expect(res.status).toBe(404);
  });
});
