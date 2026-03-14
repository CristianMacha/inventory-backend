# Backend DDD - Project Report & Developer Guide

This repository contains a scalable backend application built with **NestJS**, structured according to **Domain-Driven Design (DDD)** and **Hexagonal Architecture** principles.

## 🏗️ Architecture

The project is organized into modular **Bounded Contexts** to ensure separation of concerns and scalability. Each context follows the Hexagonal Architecture pattern.

### Layered Structure

Each Context (e.g., `src/contexts/users`) is divided into three main layers:

1.  **Domain (`domain/`)**:
    - **Purpose**: The core business logic. Independent of frameworks, databases, or external APIs.
    - **Contains**: Entities, Value Objects, Domain Services, Repository Interfaces, Custom Errors (`DomainException`).
    - **Rule**: _Dependencies point inward. The Domain depends on nothing._

2.  **Application (`application/`)**:
    - **Purpose**: Orchestrates the business use cases.
    - **Contains**: Services (`AuthService`), Command Handlers, Query Handlers, Uses Cases.
    - **Rule**: _Depends only on the Domain._

3.  **Infrastructure (`infrastructure/`)**:
    - **Purpose**: Implements interfaces defined in the Domain and handles external communication.
    - **Contains**: Framework Controllers (HTTP), Repository Implementations (TypeORM), Strategies (Passport), DTOs (with Validation).
    - **Rule**: _Depends on Domain and Application layers._

### Directory Layout

```
src/
├── config/             # Global configuration (Database, Env Validation)
├── contexts/           # Bounded Contexts (Modules)
│   ├── auth/           # Auth Context (Login, JWT, Guards)
│   └── users/          # Users Context (CRUD, Registration)
│       ├── application/
│       ├── domain/
│       └── infrastructure/
├── shared/             # Shared Kernel (Common code across contexts)
│   ├── domain/         # Shared interfaces, base exceptions
│   └── infrastructure/ # Shared filters, pipes
└── main.ts             # Entry point
```

---

## 🛠️ Key Patterns & Practices

### 1. CQRS (Command Query Responsibility Segregation)

- We separate **Read** (Query) and **Write** (Command) operations.
- **Commands**: Modify state. Handled by `CommandHandlers`.
- **Queries**: Retrieve state. Handled by `QueryHandlers`.
- **Benfit**: Allows optimizing reads and writes independently and keeps logic clean.

### 2. Repository Pattern

- All data access is abstracted behind an interface (e.g., `IUserRepository`).
- **Domain** defines the interface.
- **Infrastructure** implements it (using TypeORM).
- **Benefit**: We can swap databases easily (e.g., for testing) without touching business logic.

### 3. DTOs (Data Transfer Objects)

- Used for incoming HTTP requests (Infrastructure layer).
- Validated using `class-validator` decorators.
- **Benefit**: Ensures data integrity at the entry point.

### 4. Global Error Handling

- Exceptions extend `DomainException` (in `@shared/domain`).
- Caught by `DomainExceptionFilter` which formats the response uniformly.

### 5. Path Aliases

- Use `@contexts/*`, `@shared/*`, `@config/*` for imports.
- **Benefit**: Eliminates `../../../../` hell.

### 6. Configuration & Validation

- Environment variables are validated on startup using `joi` (`src/config/env.validation.ts`).
- App fails fast if configuration is invalid.

### 7. Structured Logging

- Uses `nestjs-pino` for high-performance JSON logs in production.
- Auto-logs HTTP requests (method, URL, latency).

---

## 🚀 Getting Started

### Prerequisites

- Node.js v20+
- Docker & Docker Compose
- pnpm

### Running Locally (Hybrid Mode)

For the best development experience (Hot Reload + Docker DB):

1.  **Start Database**:
    ```bash
    docker-compose up db -d
    ```
2.  **Configure Env**:
    Ensure your `.env` has:
    ```bash
    DATABASE_HOST=localhost
    PORT=3000
    NODE_ENV=development
    ```
3.  **Run App**:
    ```bash
    pnpm start:dev
    ```

### Running with Docker (Production Simulation)

To verify how it runs in production:

```bash
docker-compose up --build
```

---

## 👨‍💻 How to Develop (Workflow)

**To add a new feature (e.g., "Create Product"):**

1.  **Domain**:
    - Create `Product` Entity.
    - Define `IProductRepository` interface.
2.  **Application**:
    - Create `CreateProductCommand`.
    - Create `CreateProductHandler` (implements business logic).
3.  **Infrastructure**:
    - Implement `TypeOrmProductRepository`.
    - Create `CreateProductDto` (with validation).
    - Create `ProductController` (HTTP endpoint).
4.  **Wiring**:
    - Register everything in `ProductModule`.

---

## ✅ Commands

| Command | Description |
|Args|Desc|
| `pnpm start:dev` | Runs app in watch mode (Local) |
| `pnpm run build` | Builds app for production (uses `tsc-alias`) |
| `pnpm test` | Runs unit tests |
| `docker-compose up` | Runs app + db in containers |

---

_Built with ❤️ by Project X Team_
