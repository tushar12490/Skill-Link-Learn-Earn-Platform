# SkillLink Platform

SkillLink is a full-stack freelancing and learning platform that connects clients with freelancers and mentors. It delivers a secure Spring Boot backend, a polished React/Vite frontend, and a data model capable of tracking jobs, applications, courses, and enrollments.

## Features

- **Authentication & Authorization**: JWT-based login/register with role-aware access (clients, freelancers, mentors).
- **Job Marketplace**:
  - Clients can post projects, review proposals, and assign freelancers.
  - Freelancers can browse jobs, submit proposals, and track assignments.
  - Rich job detail analytics summarizing proposal statuses.
- **Applications Workflow**: Proposal submission, client approval/rejection, status audit trail, and sanitized validation errors.
- **Courses & Learning**: Course catalog with mentor associations and enrollment tracking.
- **Dashboard Experience**: Material UI design system, responsive layout, and real-time feedback via toasts and loading states.

## Architecture

| Layer    | Stack & Highlights |
|----------|--------------------|
| Backend  | Spring Boot 3.2, Spring Security, Spring Data JPA, Jakarta Validation, JWT (jjwt), MySQL. Centralized exception handling via `GlobalExceptionHandler`, DTO mappers, and repository entity graphs for optimized fetches. |
| Frontend | React 18, Vite, Material UI, Axios client with JWT interceptor, React Router, Context-based auth state. |

The backend exposes REST APIs under `/api/**`, while the frontend consumes them through typed service modules in `src/services`.

## Prerequisites

- **Backend**
  - Java 17+
  - Maven 3.9+
  - MySQL 8 instance (or compatible) with a schema named `skilllink`
- **Frontend**
  - Node.js 18+
  - npm 9+

## Configuration

The backend now reads sensitive settings from environment variables. Override them via your shell session, a `.env` file, or profile-specific properties before launching the app.

| Property key                             | Environment variable         | Default (dev)                                                         |
|------------------------------------------|------------------------------|-----------------------------------------------------------------------|
| `spring.datasource.url`                  | `SPRING_DATASOURCE_URL`      | `jdbc:mysql://localhost:3306/skilllink?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC` |
| `spring.datasource.username`             | `SPRING_DATASOURCE_USERNAME` | `root`                                                                |
| `spring.datasource.password`             | `SPRING_DATASOURCE_PASSWORD` | _(empty – must be provided)_                                          |
| `skilllink.jwt.secret`                   | `SKILLLINK_JWT_SECRET`       | `please-set-a-secret` (replace outside local dev)                     |
| `skilllink.jwt.expiration` (milliseconds) | `SKILLLINK_JWT_EXPIRATION`  | `3600000` (1 hour)                                                    |

Example PowerShell session before starting the backend:

```powershell
$env:SPRING_DATASOURCE_PASSWORD = "yourStrongPassword"
$env:SKILLLINK_JWT_SECRET = "base64-encoded-secret"
./mvnw.cmd -f backend/pom.xml spring-boot:run
```

> On macOS/Linux, run `export SPRING_DATASOURCE_PASSWORD=...` in your shell. For persistent values, create an `.env` file and load it with `direnv` or pass `--spring.config.import=optional:file:.env[.properties]` to the Maven command.

The schema is auto-updated on startup (`spring.jpa.hibernate.ddl-auto=update`) and `data.sql` seeds starter records.

## Running the backend

```bash
# Windows (PowerShell)
./mvnw.cmd -f backend/pom.xml spring-boot:run

# macOS/Linux
./mvnw -f backend/pom.xml spring-boot:run
```

> The repository bundles a local Apache Maven 3.9.6 distribution plus helper scripts (`mvnw` / `mvnw.cmd`). They work without any global Maven install as long as Java 17+ is available. Feel free to add `apache-maven-3.9.6/` to your `.gitignore` if you don’t plan to commit the downloaded binaries.

Once the application boots, the API is available at `http://localhost:8080/api`. Default seed users (see `data.sql`) provide ready-made client and freelancer accounts for local testing.

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server defaults to `http://localhost:5173`. Update `src/services/api.js` if your backend origin differs.

## Production build

```bash
cd frontend
npm run build
```

Bundles the React app with optimized assets under `frontend/dist/`.

## Testing & Quality

### Backend

```bash
# Windows
./mvnw.cmd -f backend/pom.xml test

# macOS/Linux
./mvnw -f backend/pom.xml test
```

Unit tests cover critical services (e.g., job detail access) and validation sanitization (`GlobalExceptionHandlerTest`).

### Frontend

```bash
cd frontend
npm run lint
```

ESLint checks React hooks usage, JSX best practices, and code quality.

```bash
cd frontend
npm run test
```

Vitest runs component tests (configured with React Testing Library and jsdom). Use `npm run test:watch` for an interactive workflow.

## Project Structure

```
backend/
  src/
    main/java/com/skilllink/...  # domain, services, controllers, security
    main/resources/              # config + seed data
    test/java/com/skilllink/...  # service & exception tests
frontend/
  src/                           # React app (pages, components, context, services)
  vite.config.js
  package.json
```

## Useful Accounts (seed data)

| Role       | Email                | Password |
|------------|----------------------|----------|
| Client     | client@skilllink.dev | password |
| Freelancer | dev@skilllink.dev    | password |
| Mentor     | mentor@skilllink.dev | password |

Use these to explore role-specific dashboards in development.

## Next Steps

- Install Maven in the local environment to execute backend test suites.
- Extend frontend testing (Vitest/React Testing Library) for key flows.
- Configure CI pipelines (GitHub Actions or similar) for automated builds & checks.
