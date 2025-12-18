# TaskM

<p align="center">
  <img src="https://img.shields.io/badge/Angular-19.0-red?style=for-the-badge&logo=angular" alt="Angular 19" />
  <img src="https://img.shields.io/badge/NestJS-10.0-red?style=for-the-badge&logo=nestjs" alt="NestJS 10" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Nx-20.2-blue?style=for-the-badge&logo=nx" alt="Nx Monorepo" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

<p align="center">
  <strong>A modern, full-stack task and project management system built for translation and localization service providers.</strong>
</p>

---

## 📋 Overview

**TaskM** is a comprehensive task management application designed to streamline project workflows, manage clients, track tasks, and coordinate with service providers (linguists). Built as an Nx monorepo, it features a modern Angular frontend and a robust NestJS backend, connected to a PostgreSQL database.

### Key Use Cases

- 📂 **Project Management** — Create and manage translation/localization projects with status tracking
- ✅ **Task Assignment** — Assign tasks to service providers with language-specific competencies
- 👥 **Client Management** — Maintain client records and project ownership
- 👨‍💼 **Service Provider Management** — Manage linguists and their competencies/rates
- 📊 **Reporting & Dashboards** — Visual insights into project and task progress
- 🌐 **Multi-language Support** — Track source and target languages for translation tasks

---

## 🏗️ Architecture

TaskM is built as an **Nx Monorepo** with a clear separation between frontend and backend applications, and shared libraries for maximum code reuse.

```
TaskM/
├── apps/
│   ├── taskm-api/          # NestJS Backend API
│   └── taskm-web/          # Angular 19 Frontend
├── libs/
│   ├── clients/            # Client management feature
│   ├── competences/        # Competencies/rates management
│   ├── core/               # Shared core utilities
│   │   ├── constants/      # Application constants & enums
│   │   ├── db/             # Database entities & module
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── helpers/        # Utility functions
│   │   ├── http/           # HTTP utilities
│   │   ├── interceptors/   # HTTP/API interceptors
│   │   └── types/          # Shared TypeScript types
│   ├── dashboards/         # Dashboard feature
│   ├── projects/           # Project management feature
│   ├── reports/            # Reporting feature
│   ├── service-providers/  # Service provider (linguist) management
│   ├── shared/             # Shared UI components & layouts
│   │   ├── api/            # Shared API services
│   │   ├── layout/         # Application layouts
│   │   ├── misc/           # Miscellaneous utilities
│   │   └── ui/             # Reusable UI components
│   └── tasks/              # Task management feature
└── dist/                   # Compiled output
```

---

## 🚀 Tech Stack

### Frontend

| Technology         | Purpose                                         |
| ------------------ | ----------------------------------------------- |
| **Angular 19**     | Modern web framework with standalone components |
| **PrimeNG 17**     | Rich UI component library                       |
| **Tailwind CSS 3** | Utility-first CSS framework                     |
| **ng-icons**       | Icon library (Heroicons, Feather, Radix)        |
| **RxJS 7**         | Reactive programming                            |
| **Day.js**         | Date manipulation                               |

### Backend

| Technology          | Purpose                           |
| ------------------- | --------------------------------- |
| **NestJS 10**       | Scalable Node.js server framework |
| **TypeORM**         | Object-Relational Mapping         |
| **PostgreSQL**      | Relational database               |
| **Passport + JWT**  | Authentication                    |
| **CASL**            | Authorization & access control    |
| **class-validator** | Input validation                  |
| **Nodemailer**      | Email functionality               |

### Development & Build

| Technology            | Purpose                            |
| --------------------- | ---------------------------------- |
| **Nx 20**             | Monorepo management & build system |
| **TypeScript 5.6**    | Type-safe JavaScript               |
| **Jest**              | Unit testing                       |
| **Cypress**           | E2E testing                        |
| **ESLint + Prettier** | Code quality & formatting          |

---

## 📦 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **Yarn** (package manager)
- **PostgreSQL** >= 14.x
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ramzy-iam/TaskM.git
   cd TaskM
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Database Configuration
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=your_username
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=taskm
   DATABASE_SCHEMA=public
   TYPEORM_LOGGING=false

   # JWT Configuration
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   ```

4. **Set up the database**

   Create a PostgreSQL database named `taskm` and run the migrations (if available) or let TypeORM sync the schema in development.

---

## 🛠️ Development

### Running the Applications

**Start the backend API:**

```bash
npx nx serve taskm-api
```

**Start the frontend web app:**

```bash
npx nx serve taskm-web
```

**Run both applications in parallel:**

```bash
npx nx run-many -t serve -p taskm-api taskm-web
```

The frontend will be available at `http://localhost:4200` and the API at `http://localhost:3000`.

### Building for Production

```bash
# Build the API
npx nx build taskm-api

# Build the Web App
npx nx build taskm-web

# Build all projects
npx nx run-many -t build
```

Build artifacts are stored in the `dist/` directory.

### Running Tests

```bash
# Run all tests
npx nx run-many -t test

# Run tests for a specific project
npx nx test taskm-api
npx nx test taskm-web

# Run E2E tests
npx nx e2e taskm-e2e
```

### Linting

```bash
# Lint all projects
npx nx run-many -t lint

# Lint a specific project
npx nx lint taskm-api
```

---

## 📁 Feature Libraries

| Library                      | Description                                         |
| ---------------------------- | --------------------------------------------------- |
| `@TaskM/clients/*`           | Client management (CRUD, data access, forms, lists) |
| `@TaskM/projects/*`          | Project management with status workflows            |
| `@TaskM/tasks/*`             | Task creation, assignment, and tracking             |
| `@TaskM/service-providers/*` | Linguist/service provider management                |
| `@TaskM/competences/*`       | Competencies and rate management                    |
| `@TaskM/dashboards/*`        | Dashboard and analytics views                       |
| `@TaskM/reports/*`           | Report generation and views                         |
| `@TaskM/shared/*`            | Shared UI components, layouts, and utilities        |
| `@TaskM/core/*`              | Core constants, types, DTOs, and database entities  |

---

## 🗃️ Data Model

### Core Entities

- **Client** — Companies or individuals who request projects
- **Project** — Translation/localization projects with status, language pairs, and deadlines
- **Task** — Individual work items assigned to service providers
- **Service Provider** — Linguists or freelancers who complete tasks
- **Competence** — Skills and rates for service providers

### Status Workflows

**Project Status:** `NOT_STARTED` → `IN_PROGRESS` → `COMPLETED`

**Task Status:** `NOT_STARTED` → `IN_PROGRESS` → `COMPLETED`

---

## 🔧 Nx Console

Enhance your development experience with [Nx Console](https://nx.dev/nx-console) — available for VS Code and IntelliJ. It provides an interactive UI to:

- View project dependency graph
- Run tasks visually
- Generate new components, services, and libraries

---

## 📜 Scripts

| Command                       | Description                        |
| ----------------------------- | ---------------------------------- |
| `npx nx serve <project>`      | Start dev server for a project     |
| `npx nx build <project>`      | Build a project for production     |
| `npx nx test <project>`       | Run unit tests                     |
| `npx nx lint <project>`       | Run linter                         |
| `npx nx graph`                | Visualize project dependency graph |
| `npx nx affected -t <target>` | Run target on affected projects    |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Ramzy** — [GitHub](https://github.com/ramzy-iam)

---

<p align="center">
  Made with ❤️ using <a href="https://nx.dev">Nx</a>, <a href="https://angular.io">Angular</a>, and <a href="https://nestjs.com">NestJS</a>
</p>

## Explore the project graph

Run `npx nx graph` to show the graph of the workspace.
It will show tasks that you can run with Nx.

- [Learn more about Exploring the Project Graph](https://nx.dev/core-features/explore-graph)

## Connect with us!

- [Join the community](https://nx.dev/community)
- [Subscribe to the Nx Youtube Channel](https://www.youtube.com/@nxdevtools)
- [Follow us on Twitter](https://twitter.com/nxdevtools)
