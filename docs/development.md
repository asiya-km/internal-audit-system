# Development Guide

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **Docker** and **Docker Compose** (for PostgreSQL)
- **npm** >= 9

### Initial Setup

```bash
# 1. Install all workspace dependencies
npm install

# 2. Start PostgreSQL in Docker
docker compose up postgres -d

# 3. Copy environment configuration
cp .env.example .env
# Edit .env with your values

# 4. Generate Prisma client
npm run db:generate

# 5. Run database migrations
npm run db:migrate

# 6. Seed development data
npm run db:seed

# 7. Start backend (terminal 1)
npm run dev:api

# 8. Start frontend (terminal 2)
npm run dev:web
```

### Development Credentials

| Field    | Value                  |
| -------- | ---------------------- |
| Email    | `admin@example.local`  |
| Password | `AdminPass123!`        |

These are fictional development credentials. Change them before production deployment.

## Common Commands

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev:api`    | Start backend with hot reload (tsx watch)|
| `npm run dev:web`    | Start frontend Vite dev server           |
| `npm run build`      | Build shared, api, and web packages      |
| `npm run typecheck`  | Type-check all packages                  |
| `npm run test`       | Run backend tests (Vitest)               |
| `npm run db:generate`| Regenerate Prisma client                 |
| `npm run db:migrate` | Create/apply Prisma migration            |
| `npm run db:seed`    | Seed roles, permissions, dev admin       |
| `npm run db:reset`   | Drop and recreate database + seed        |

## Database Management

### Resetting the Database

```bash
npm run db:reset
```

This drops all data, re-runs all migrations, and seeds development data. Only use in development.

### Adding a Schema Change

1. Edit `apps/api/prisma/schema.prisma`
2. Run `npm run db:migrate -- --name descriptive_name`
3. The migration file is created under `apps/api/prisma/migrations/`
4. Commit both `schema.prisma` and the new migration file

## Testing

### Backend Tests

```bash
npm run test                # Run all backend tests
npm run test:watch          # Watch mode
```

Tests use Vitest + Supertest and cover:
- Health endpoint (database connectivity)
- Authentication (invalid login, missing fields, unauthorized access)
- Authorization (protected routes without auth)
- Error handling (404, error format consistency)

### Frontend Tests

```bash
npm run test -w @iams/web
```

Tests use Vitest + Testing Library and cover:
- Login page rendering
- Application rendering

## Docker

### Development (PostgreSQL only)

```bash
docker compose up postgres -d
```

The frontend and API run locally against the Dockerized PostgreSQL.

### Full Stack in Docker

```bash
docker compose up -d
```

This starts PostgreSQL, the API, and the web app (nginx-served).

## Project Conventions

- **TypeScript strict mode** in all packages
- **No secrets in source code** — use `.env` (git-ignored)
- **No hardcoded database records** — use the seed script
- **No fake API calls** — all frontend data comes through the real backend
- **Backend logic in services** — controllers stay thin
- **Shared types in `@iams/shared`** — avoid contract duplication
- **Components are small and reusable** — follow Single Responsibility Principle
