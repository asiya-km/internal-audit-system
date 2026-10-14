import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

// ---- Unauthenticated access to protected routes ----

describe('Security: Unauthenticated access denied', () => {
  it('should reject /api/auth/me without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('AUTHENTICATION_ERROR');
  });

  it('should reject /api/admin/permissions without token', async () => {
    const res = await request(app).get('/api/admin/permissions');
    expect(res.status).toBe(401);
  });

  it('should reject with malformed Bearer token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer not-a-jwt');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTHENTICATION_ERROR');
  });

  it('should reject with tampered JWT', async () => {
    // A real-looking JWT with invalid signature
    const fakeToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWtlLXVzZXItaWQifQ.invalid-signature';
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${fakeToken}`);
    expect(res.status).toBe(401);
  });
});

// ---- Invalid / malformed input ----

describe('Security: Input validation', () => {
  it('should reject login with empty body', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should reject login with empty password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: '' });
    expect(res.status).toBe(400);
  });

  it('should reject login with non-string email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 12345, password: 'test' });
    expect(res.status).toBe(400);
  });

  it('should reject login with excessively long email', async () => {
    const longEmail = 'a'.repeat(5000) + '@example.com';
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: longEmail, password: 'test' });
    expect(res.status).toBe(400);
  });

  it('should reject login with extra unexpected fields safely', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'test',
        isAdmin: true,
        role: 'superadmin',
      });
    // Zod strips unknown keys by default; should still process as a normal
    // invalid-credentials 401, not crash or 500
    expect([400, 401]).toContain(res.status);
  });
});

// ---- Error format and information leakage ----

describe('Security: Error response safety', () => {
  it('should not expose stack traces in 404 errors', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error.message).not.toMatch(/at\s+\w+/);
    expect(JSON.stringify(res.body)).not.toMatch(/node_modules/);
  });

  it('should not expose stack traces in validation errors', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'test' });
    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body)).not.toMatch(/node_modules/);
    expect(JSON.stringify(res.body)).not.toMatch(/\/.*\.ts/);
  });

  it('should not expose password hashes in any response', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.local', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(JSON.stringify(res.body)).not.toMatch(/\$2[aby]\$/);
    expect(JSON.stringify(res.body)).not.toMatch(/passwordHash/i);
  });

  it('should return consistent error envelope structure', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code');
    expect(res.body.error).toHaveProperty('message');
    expect(typeof res.body.error.code).toBe('string');
    expect(typeof res.body.error.message).toBe('string');
  });
});

// ---- Health endpoint safety ----

describe('Security: Health endpoint', () => {
  it('should not expose internal connection strings', async () => {
    const res = await request(app).get('/api/health');
    expect(JSON.stringify(res.body)).not.toMatch(/postgresql:\/\//);
    expect(JSON.stringify(res.body)).not.toMatch(/DATABASE_URL/i);
  });
});

// ---- Logout works without authentication ----

describe('Security: Logout', () => {
  it('should clear cookie and return success even without prior auth', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // Cookie should be cleared (Set-Cookie with empty or expired value)
    const setCookie = res.headers['set-cookie'];
    if (setCookie) {
      const cookieStr = Array.isArray(setCookie) ? setCookie.join(';') : setCookie;
      expect(cookieStr).toMatch(/iams_token=;|Max-Age=0|expires=/i);
    }
  });
});