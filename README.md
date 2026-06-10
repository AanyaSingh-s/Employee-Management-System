# Employee Management System

Full-stack employee management app with React frontend and Spring Boot backend.

## Stack

- **Frontend:** React, React Router, Bootstrap (`ems-frontend/ems-frontend`)
- **Backend:** Spring Boot 3, JPA, MySQL (`ems-backend/ems-backend`)
- **Database:** MySQL (`javabackend`)

## Prerequisites

- Java 17+
- Node.js 18+
- MySQL running locally

## Setup

### Database

Create the database (or let Spring Boot create tables on first run):

```sql
CREATE DATABASE IF NOT EXISTS javabackend;
```

Set your MySQL password when starting the backend:

```bash
# Windows PowerShell
$env:DB_PASSWORD="your_mysql_password"
```

### Backend

```bash
cd ems-backend/ems-backend
mvn spring-boot:run
```

API runs at **http://localhost:8080**

### Frontend

```bash
cd ems-frontend/ems-frontend
npm install
npm start
```

App runs at **http://localhost:3000**

## Auth

- `POST /api/auth/signup` — register with username + password (stored hashed in MySQL)
- `POST /api/auth/login` — sign in with username + password

## API

- `GET/POST/PUT/DELETE /api/employees` — employee CRUD
- `GET /api/employees/search?keyword=` — search employees
