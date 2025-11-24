# OHB Real Estate Marketplace - Technical Assessment

A high-performance, full-stack real estate platform featuring dynamic search, polymorphic listings (Properties, Projects, Lands), and secure lead generation.

## Tech Stack

- **Backend:** NestJS (Node.js), Prisma ORM, Passport JWT
- **Frontend:** React (Vite), TypeScript, Zustand (State Management), Tailwind CSS
- **Database:** PostgreSQL 16 (with `pgcrypto` and `tsvector` Full-Text Search)
- **Infrastructure:** Docker & Dev Containers

---

## AI Tools Declaration

* **GitHub Copilot / Gemini:** Used to generate synthetic seed data (Faker.js logic), scaffold unit test boilerplate, and debug Docker/Webpack configuration issues for the ARM64 architecture.
* **Usage Context:** AI was strictly used as an accelerator for repetitive tasks; all architectural decisions (Polymorphic DB design, SQL Views, State Management) were manually engineered.

---

## Setup & Installation

### Option A: Dev Container (Recommended for Bonus Points)
This project includes a fully configured `.devcontainer` specification.
1.  Open the project in **VS Code**.
2.  When prompted, click **"Reopen in Container"** (or press `F1` -> `Dev Containers: Reopen in Container`).
3.  The environment will automatically install Node.js v20, PostgreSQL 16, and all extensions as recieved and forked.

### Option B: Manual Setup
**Prerequisites:** Node.js v18+, Docker Desktop.

1.  **Start the Database:**
    ```bash
    docker-compose up -d db
    ```

2.  **Backend Setup:**
    **environment file (.env) was pushed to github for the assessment only, in real life it should be ignored and sent internally** 
    ```bash
    cd Projects/backend
    npm install
    
    # 1. Generate Prisma Client
    npx prisma generate
    
    # 2. Initialize Database Schema & Indexes
    # Note: Ensure the DB container is running first
    npx prisma db push
    # Or: in terminal navigate to database folder and run: psql -h db -U postgres -d postgres -f script.sql 
    
    # 3. Seed the Database (1000+ Records for Performance Test)
    Navigate to backend folder and run: npm run seed.js
    
    # 4. Start Server
    npm run start:dev
    ```
    *Server will run on: `http://localhost:3000`*

3.  **Frontend Setup:**
    ```bash
    cd Projects/frontend
    npm install
    pm run dev -- --host
    ```
    *Client will run on: `http://localhost:5173`*

---

## Test Coverage
The backend architecture supports high testability.
To run the unit tests and generate the coverage report:

```bash
cd Projects/backend
npm run test:cov

## Implemented Extra Features
1- Dark Theme