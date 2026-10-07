# Internal Audit Management System (IAMS)

## Project Overview

The Internal Audit Management System (IAMS) is a standalone full-stack application designed to manage the complete internal audit lifecycle for an organization — from annual audit planning through engagement fieldwork, working papers, findings, corrective actions, follow-up verification, and reporting.

This repository contains the **Phase 1 Foundation**: a clean, maintainable, extensible architecture with authentication, role-based access control (RBAC), and an enterprise application shell. The business modules (audit planning, engagements, working papers, findings, etc.) will be added in subsequent development phases.

The system is designed for self-hosted deployment on an organization's own Ubuntu Linux server.

## Technology Stack

| Layer        | Technologies                                                      |
| ------------ | ----------------------------------------------------------------- |
| Frontend     | React, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS |
| Backend      | Node.js, TypeScript, Express, Zod, Prisma ORM                     |
| Database     | PostgreSQL 16                                                     |
| Infrastructure | Docker, Docker Compose                                          |
| Testing      | Vitest, Supertest, Testing Library                               |

## Local Development

### Prerequisites

- Node.js >= 18
- Docker and Docker Compose (for PostgreSQL)
- npm 9+

### Steps

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start PostgreSQL**

   ```bash
   docker compose up postgres -d
   ```

3. **Configure environment variables**

   Copy the example file and adjust as needed:

   ```bash
   cp .env.example .env
   ```

   Key variables:
   - `DATABASE_URL` — PostgreSQL connection string
   - `SESSION_SECRET` — JWT signing secret (use a long random string)
   - `CORS_ORIGIN` — Frontend origin for CORS
   - `VITE_API_URL` — Backend API URL for the frontend

4. **Run database migrations**

   ```bash
   npm run db:migrate
   ```

5. **Seed development data**

   ```bash
   npm run db:seed
   ```

6. **Start the backend**

   ```bash
   npm run dev:api
   ```

   The API runs at `http://localhost:4000`.

7. **Start the frontend**

   ```bash
   npm run dev:web
   ```

   The web app runs at `http://localhost:5173`.

8. **Run tests**

   ```bash
   # Backend tests
   npm run test

   # All type checking
   npm run typecheck
   ```

## Project Structure

```
iams/
├── apps/
│   ├── api/                    # Backend — Node.js + Express + Prisma
│   │   ├── prisma/             # Prisma schema and seed script
│   │   ├── src/
│   │   │   ├── config/         # Environment and database configuration
│   │   │   ├── controllers/    # Request handlers
│   │   │   ├── middleware/      # Auth, validation, error handling
│   │   │   ├── repositories/   # Database access layer
│   │   │   ├── routes/         # Express route definitions
│   │   │   ├── schemas/        # Zod validation schemas
│   │   │   ├── services/       # Business logic
│   │   │   ├── utils/          # Logger, error classes, response helpers
│   │   │   └── app.ts          # Express application setup
│   │   └── tests/              # Backend tests
│   │
│   └── web/                    # Frontend — React + Vite + Tailwind
│       └── src/
│           ├── components/     # Layout and reusable UI components
│           ├── context/        # Auth and Toast contexts
│           ├── lib/            # API client, navigation config, query client
│           ├── pages/          # Route page components
│           └── App.tsx         # Root component with routing
│
├── packages/
│   └── shared/                 # Shared TypeScript types (API contracts)
│       └── src/index.ts
│
├── docker/                     # Dockerfiles and nginx config
├── docs/                       # Architecture and development documentation
├── .env.example
├── docker-compose.yml
└── package.json
```

## Development Credentials

A development administrator account is seeded for local testing:

| Field    | Value                  |
| -------- | ---------------------- |
| Email    | `admin@example.local`  |
| Password | `AdminPass123!`        |

**This account is for development only.** These credentials must be changed before any production deployment. The seed script uses obviously fictional credentials and should never be used with real organizational accounts.

## Available Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev:api`    | Start backend in development mode        |
| `npm run dev:web`    | Start frontend dev server                |
| `npm run build`      | Build all packages (shared, api, web)    |
| `npm run typecheck`  | Type-check all packages                  |
| `npm run test`       | Run backend tests                        |
| `npm run db:generate`| Generate Prisma client                   |
| `npm run db:migrate` | Run database migrations                  |
| `npm run db:seed`    | Seed development data                    |
| `npm run db:reset`   | Reset database (development only)        |

## Documentation

- [Architecture](docs/architecture.md)
- [Database](docs/database.md)
- [Security](docs/security.md)
- [Development](docs/development.md)
