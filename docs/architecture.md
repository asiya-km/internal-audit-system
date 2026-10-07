# Architecture

## Overview

IAMS follows a clean monorepo architecture with clear separation between frontend, backend, database, and shared code. The design prioritizes maintainability, extensibility, and security.

## Monorepo Structure

The project uses npm workspaces with three packages:

- **`@iams/web`** (`apps/web`) — React frontend (Vite, Tailwind, React Router, TanStack Query)
- **`@iams/api`** (`apps/api`) — Node.js backend (Express, Prisma, Zod)
- **`@iams/shared`** (`packages/shared`) — Shared TypeScript types and API contracts

The shared package contains no server-only code. It defines API request/response shapes, DTOs, and domain types used by both frontend and backend, preventing contract drift.

## Backend Architecture

The backend follows a layered architecture:

```
routes/       → Route definitions (URL mapping)
  ↓
controllers/  → Request/response handling, HTTP concerns
  ↓
services/     → Business logic
  ↓
repositories/ → Database access (Prisma)
```

### Key Design Decisions

- **Controllers** are thin — they extract input, call services, and format HTTP responses
- **Services** contain business logic and are independent of Express
- **Repositories** encapsulate all Prisma queries, making database access swappable and testable
- **Middleware** handles cross-cutting concerns: authentication, authorization, validation, error handling, rate limiting
- **Schemas** (Zod) define input validation at the API boundary

### Configuration

Environment variables are loaded via `dotenv` and validated in `config/env.ts`. Missing required variables cause startup failure rather than runtime errors.

### Error Handling

All errors flow through centralized error-handling middleware. Custom `AppError` subclasses (`ValidationError`, `AuthenticationError`, `AuthorizationError`, `NotFoundError`, `ConflictError`) provide consistent HTTP status codes and error codes. The error response format is:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

Stack traces and internal details are only exposed in development mode.

## Frontend Architecture

### Routing

React Router with a protected route structure:
- `/login` — Public login page
- All other routes require authentication via `ProtectedRoute`
- Unauthenticated users are redirected to `/login`
- Authenticated users visiting `/login` are redirected to `/dashboard`

### State Management

- **Server state** — TanStack Query for API data, caching, and loading/error states
- **Auth state** — React Context (`AuthContext`) for current user, login/logout, permission checks
- **UI state** — React Context (`ToastContext`) for notifications

### Component System

Reusable UI components in `components/ui/`:
- Button, Input, Modal, ConfirmDialog, Table, Spinner, EmptyState, ErrorState
- Layout components: Sidebar, Header, Breadcrumbs, AppLayout

### Future Module Extensibility

Each future module (Audit Planning, Engagements, Working Papers, etc.) follows the pattern:
1. Add navigation item in `lib/navigation.tsx`
2. Add route in `App.tsx`
3. Create page component in `pages/`
4. Add backend routes/controllers/services/repositories
5. Add Prisma models in schema

The architecture requires no restructuring to add any Phase 2-14 module.

## Cross-Cutting Concerns

| Concern           | Implementation                                    |
| ----------------- | ------------------------------------------------- |
| Logging           | Winston structured logging, env-configurable level |
| Validation        | Zod schemas at API boundary, shared types         |
| Security          | Helmet, CORS, rate limiting, bcrypt, JWT cookies  |
| Error handling    | Centralized middleware, consistent response shape |
| Database access   | Prisma ORM with parameterized queries             |
