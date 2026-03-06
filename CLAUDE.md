# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm run start:dev          # Hot-reload dev server
pnpm run build              # nest build && tsc-alias (alias resolution required)

# Testing
pnpm test                   # Run all unit tests
pnpm run test:watch         # Watch mode
pnpm run test:cov           # Coverage report
jest path/to/file.spec.ts  # Run a single test file

# Database
pnpm run migration:generate -- src/migrations/<name>  # Auto-generate from entity changes
pnpm run migration:run      # Apply pending migrations
pnpm run migration:revert   # Rollback last migration
pnpm run seed:permissions   # Seed permissions and admin role

# Code quality
pnpm run lint               # ESLint with auto-fix
pnpm run format             # Prettier
```

## Architecture

This is a **NestJS DDD + Hexagonal Architecture** application organized into bounded contexts. Dependencies flow strictly inward: Infrastructure → Application → Domain.

### Bounded Contexts

Located in `src/contexts/`:

- **inventory** — Products, Brands, Categories, Bundles, Slabs, Levels, Finishes, Suppliers
- **users** — User management, RBAC (roles + permissions), Firebase identity provider support
- **auth** — JWT authentication, refresh tokens, Passport strategies
- **purchasing** — Purchase invoices (in progress)
- **projects** — Jobs (in progress)

### Layers within each context

```
domain/
  entities/       # Aggregates — private constructors, static create()/reconstitute() factory methods
  repositories/   # Interfaces only (no implementations)
  errors/         # DomainException subclasses
  value-objects/  # Immutable types with no ID
  enums/

application/
  commands/       # Write operations — one Command + one Handler per use case
  queries/        # Read operations — one Query + one Handler per use case
  dtos/           # Output shapes
  mappers/        # Domain ↔ DTO
  event-handlers/ # Cross-context integration via CQRS events

infrastructure/
  http/
    controllers/  # One controller per use case, delegates to CommandBus/QueryBus
    dtos/         # Input validation (class-validator decorators)
  persistence/typeorm/
    entities/     # TypeORM models
    repositories/ # IRepository implementations
    mappers/      # TypeORM entity ↔ Domain entity
```

### Dependency Injection Pattern

Each context uses a `*.tokens.ts` file with Symbol-based injection tokens:

```typescript
// inventory.tokens.ts
export const INVENTORY_TOKENS = {
  BRAND_REPOSITORY: Symbol('BrandRepository'),
  ...
} as const;

// In handler:
@Inject(INVENTORY_TOKENS.BRAND_REPOSITORY)
private readonly brandRepository: IBrandRepository,

// In module PersistenceProviders:
{ provide: INVENTORY_TOKENS.BRAND_REPOSITORY, useClass: TypeOrmBrandRepository }
```

### CQRS

All use cases go through `CommandBus` or `QueryBus`. Controllers never contain business logic. Handlers are registered in the context module under `CommandHandlers` / `QueryHandlers` arrays.

### Domain Entity Pattern

```typescript
class Supplier {
  private constructor(private readonly _id: string, ...) {}
  static create(name: string, ...): Supplier { /* validation here */ }
  static reconstitute(id: string, ...): Supplier { /* from persistence */ }
  get id(): string { return this._id; }
}
```

### Authentication & Authorization

- `JwtAuthGuard` is the global `APP_GUARD` (all routes protected by default)
- `@Public()` decorator opts a route out of JWT auth
- `PermissionsGuard` + `@RequirePermissions(Permissions.X.Y)` for fine-grained access
- Permissions are defined in `src/shared/authorization/permissions.ts`
- Firebase Admin is used for verifying OAuth provider tokens

### Path Aliases

```
@contexts/*  → src/contexts/*
@shared/*    → src/shared/*
@config/*    → src/config/*
```

### Shared Module

`src/shared/` contains cross-cutting concerns:

- `domain/` — `DomainException`, `IHasher`, `IUuidGenerator`, pagination types
- `infrastructure/` — `SharedInfrastructureModule` (bcrypt, uuid adapters, health check, global filters)
- `authorization/permissions.ts` — All permission constants
- `menu/menu-items.ts` — UI menu structure (permission-driven)

### Database

MySQL via TypeORM. `ormconfig.ts` at root configures connection. Migrations are in `src/migrations/`. `synchronize: false` always — use migrations for schema changes.

### Environment Variables

Required: `APP_PORT`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_NAME`, `JWT_SECRET`, `JWT_EXPIRATION_TIME`, `JWT_REFRESH_SECRET`, `FIREBASE_PROJECT_ID`, `FIREBASE_SERVICE_ACCOUNT_JSON`, `ALLOWED_ORIGINS`

Validated at startup via Joi in `src/config/env.validation.ts`.
