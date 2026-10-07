import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('404 handler', () => {
  it('should return NOT_FOUND for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-endpoint');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

describe('Error format', () => {
  it('should return consistent error structure', async () => {
    const res = await request(app).get('/api/nonexistent');

    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code');
    expect(res.body.error).toHaveProperty('message');
  });
});
