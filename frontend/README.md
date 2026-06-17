# Employee Management System — Frontend

React frontend for the Spring Boot backend API.

## Prerequisites

- Node.js 18+
- Spring Boot backend running on `http://localhost:2027`
- MySQL database `javabackend` configured and running

## Run

```bash
# Terminal 1 — start backend
cd EmployeeManagmentSystem
./gradlew bootRun

# Terminal 2 — start frontend
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

## Features

- **Dashboard** — API status and record counts
- **Employees** — CRUD, search, filter by department
- **Managers** — CRUD, filter by department
- **Admins** — CRUD
- **Leaves** — CRUD, approve/reject, filter by status
- **Duties** — CRUD, assign tasks to employees

## Styling

This project uses **Tailwind CSS v3** with PostCSS. Config: `tailwind.config.js`. Shared UI class strings live in `src/lib/ui.js`.

## API connection

The frontend calls `http://localhost:2027` by default. Override with:

```bash
VITE_API_URL=http://localhost:2027 npm run dev
```

CORS is already enabled on the backend for `http://localhost:3000`.
