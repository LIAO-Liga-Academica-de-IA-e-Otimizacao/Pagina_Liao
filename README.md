# LIAO - Full Stack Application

Complete full-stack web application for **LIAO (Liga Acadêmica de Inteligência Artificial e Otimização)**. This repository houses both the Node.js backend and the React frontend.

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **PostgreSQL** database
- **npm**

### 1. Initial Setup (Manual)
First, create your database:
```sql
CREATE DATABASE liao_db;
```

### 2. Run the Full Stack
For a fresh setup, follow these steps in order:

#### Backend
```bash
cd liao-backend
npm install
cp .env.example .env # Update with your DB credentials
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

#### Frontend
```bash
cd liao-react
npm install
# Ensure VITE_API_URL=http://localhost:3001/api in your .env
npm run dev
```

---

## 📁 Repository Structure

- [**`liao-backend/`**](./liao-backend/README.md): Node.js + Express + Prisma. The "Engine" of the application.
- [**`liao-react/`**](./liao-react/README.md): React + Vite + Tailwind. The "Face" of the application.

---

## 🛠️ Key Workflows

### 🔄 The "Type Sync" Workflow
This project uses an automated OpenAPI workflow to keep the frontend and backend in sync without manual type definitions.

Whenever you change the **database schema** in `liao-backend/prisma/schema.prisma`:
1. **Migrate the DB:** `npx prisma migrate dev`
2. **Sync Types:** 
   ```bash
   cd liao-backend && npm run generate:types
   ```
This command regenerates the OpenAPI spec and updates the TypeScript interfaces used by the frontend.

### 🗄️ Database Management
Refer to the [**Backend README**](./liao-backend/README.md#️-database-workflow-prisma) for detailed instructions on:
- Applying schema changes.
- Resetting the database.
- Seeding example data.

---

## 🔧 Tech Stack Overview

- **Backend:** Node.js, Express, PostgreSQL, Prisma ORM, JWT.
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS.
- **Spec:** OpenAPI 3.0 (Automated).

## 🚢 Deployment
- **Backend:** Build with `npm run build` and run with `npm start`.
- **Frontend:** Build with `npm run build` and deploy the `dist/` folder.

## 🤝 Contributing
Please refer to the specific READMEs in `liao-backend/` and `liao-react/` for detailed development guidelines.

---
**Built with ❤️ by LIAO Team**
