# Security

## Overview

IAMS implements a defense-in-depth security architecture suitable for future production hardening. The backend is always the security boundary — frontend authorization is for usability only.

## Authentication

- **Password hashing** — bcrypt with cost factor 12
- **Token management** — JWT signed with `SESSION_SECRET`, stored in HTTP-only cookies
- **Cookie security** — `httpOnly: true`, `secure: true` in production, `sameSite: strict` in production
- **No password exposure** — Password hashes are never sent to the client; the `UserDto` type excludes `passwordHash`
- **Session expiry** — JWT expires after 8 hours (configurable via `JWT_EXPIRES_IN`)

## Authorization (RBAC)

- **Role-based** — Users are assigned roles; roles have permission sets
- **Permission checks** — `requirePermission("permission.name")` middleware enforces access on every protected route
- **Backend enforcement** — Every sensitive API endpoint checks permissions server-side
- **Frontend hiding** — The frontend may hide UI elements based on `hasPermission()` for usability, but this is never the sole security boundary

## Security Middleware

| Middleware         | Purpose                                      |
| ------------------ | -------------------------------------------- |
| Helmet             | Secure HTTP headers (CSP, HSTS, X-Frame-Options) |
| CORS               | Restricted to `CORS_ORIGIN` env var          |
| Rate limiting      | Global 100 req/15min; auth endpoints 10 req/15min |
| Express JSON limit | 1MB request body limit                       |
| Cookie parser      | HTTP-only cookie extraction                  |

## Input Validation

All API inputs are validated with Zod schemas before reaching controllers. Invalid input returns a `VALIDATION_ERROR` response with field-level details.

## Error Handling

- Stack traces only exposed in development
- No database credentials, SQL queries, or secrets in error responses
- Consistent error envelope prevents information leakage
- Generic error messages in production for unexpected failures

## Logging

- Structured JSON logging via Winston
- Configurable log level via `LOG_LEVEL` env var
- Never logs: passwords, session secrets, authentication tokens, document contents, confidential audit data
- Logs authentication events (user ID + email, not credentials)

## Secrets Management

- No secrets in source code
- `.env` is git-ignored; `.env.example` contains only placeholders
- Backend secrets (`SESSION_SECRET`, `DATABASE_URL`) are never exposed to the frontend
- Frontend only receives `VITE_API_URL` (non-sensitive)

## Production Hardening Checklist (Phase 14)

- [ ] Generate strong `SESSION_SECRET` (32+ random characters)
- [ ] Enable HTTPS/TLS termination
- [ ] Configure production CORS origin
- [ ] Set `NODE_ENV=production`
- [ ] Remove or restrict development credentials
- [ ] Configure log rotation and retention
- [ ] Set up database backups
- [ ] Review and tighten rate limits
- [ ] Add CSRF protection if needed
- [ ] Conduct penetration testing
