import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('POST /api/auth/login', () => {
  it('should reject missing email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'somepass' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.local', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('AUTHENTICATION_ERROR');
  });

  it('should reject invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'somepass' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /api/auth/me', () => {
  it('should reject unauthenticated requests', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTHENTICATION_ERROR');
  });
});

describe('GET /api/admin/permissions', () => {
  it('should reject unauthenticated requests', async () => {
    const res = await request(app).get('/api/admin/permissions');

    expect(res.status).toBe(401);
  });
});
