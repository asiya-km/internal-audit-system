# Database

## Overview

IAMS uses PostgreSQL 16 with Prisma ORM for schema management, migrations, and query building.

## Schema (Phase 1 — Auth & RBAC Foundation)

### users

| Column         | Type        | Notes                              |
| -------------- | ----------- | ---------------------------------- |
| id             | UUID (PK)   | Auto-generated                     |
| firstName      | String      |                                    |
| lastName       | String      |                                    |
| email          | String      | Unique, indexed                    |
| passwordHash   | String      | bcrypt hash (never exposed)        |
| isActive       | Boolean     | Default true, indexed              |
| lastLoginAt    | DateTime?   | Updated on successful login        |
| createdAt      | DateTime    | Auto                               |
| updatedAt      | DateTime    | Auto                               |

### roles

| Column      | Type        | Notes          |
| ----------- | ----------- | -------------- |
| id          | UUID (PK)   | Auto-generated |
| name        | String      | Unique, indexed|
| description | String?     |                |
| createdAt   | DateTime    | Auto           |
| updatedAt   | DateTime    | Auto           |

### permissions

| Column      | Type        | Notes          |
| ----------- | ----------- | -------------- |
| id          | UUID (PK)   | Auto-generated |
| name        | String      | Unique, indexed|
| description | String?     |                |
| createdAt   | DateTime    | Auto           |
| updatedAt   | DateTime    | Auto           |

### user_roles (join table)

| Column     | Type    | Notes                          |
| ---------- | ------- | ------------------------------ |
| userId     | UUID    | FK → users.id, cascade delete  |
| roleId     | UUID    | FK → roles.id, cascade delete  |
| assignedAt | DateTime| Auto                           |

Composite primary key: `(userId, roleId)`. Index on `roleId`.

### role_permissions (join table)

| Column       | Type    | Notes                              |
| ------------ | ------- | ---------------------------------- |
| roleId       | UUID    | FK → roles.id, cascade delete      |
| permissionId | UUID    | FK → permissions.id, cascade delete|
| assignedAt   | DateTime| Auto                               |

Composite primary key: `(roleId, permissionId)`. Index on `permissionId`.

## Seed Data

The seed script (`apps/api/prisma/seed.ts`) creates:

- **29 permissions** covering users, roles, audit plan, engagements, working papers, findings, actions, reports, and administration
- **7 roles** with distinct permission sets:
  - System Administrator (all permissions)
  - Chief Audit Executive
  - Audit Manager
  - Senior Auditor
  - Auditor
  - Management
  - Executive Viewer
- **1 development admin user** — `admin@example.local` / `AdminPass123!`

## Migrations

Prisma migrations are used for all schema changes:

```bash
npm run db:migrate     # Create and apply migration
npm run db:reset       # Reset database and re-run all migrations + seed
npm run db:seed        # Run seed script
```

Never manually edit database tables. All schema changes go through Prisma migrations.

## Future Schema Growth

The RBAC foundation supports adding business tables (audit_plans, engagements, working_papers, findings, corrective_actions, etc.) in later phases without modifying existing auth tables. New tables will reference `users` for ownership and assignment relationships.
