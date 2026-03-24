# LIAO Backend

Backend API and Database Engine for the LIAO (Liga de Inteligência Artificial e Otimização) web application.

## 🛠️ Tech Stack

- **Node.js + Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Prisma** - ORM
- **OpenAPI 3.0** - Spec generation
- **JWT** - Authentication

---

## 🚀 Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL database

### Installation
1. Install dependencies: `npm install`
2. Configure environment: `cp .env.example .env`
3. Edit `.env` with your DB credentials and `JWT_SECRET`.
4. Initialize the DB: `npx prisma migrate dev --name init`
5. Seed the DB: `npx prisma db seed`
6. Start dev server: `npm run dev`

---

## 🗄️ Database Workflow (Prisma)

When working with the database, follow these workflows to keep your schema and data in sync.

### 1. Applying Schema Changes
If you modify `prisma/schema.prisma`, you **must** sync the database:
```bash
# This creates a migration, updates the DB, and regenerates types
npx prisma migrate dev --name describe_your_change
```

### 2. Starting Fresh (Resetting)
If your database is out of sync or you want to wipe all data:
```bash
# Drops DB, reapplies all migrations, and runs the seed automatically
npx prisma migrate reset
```

### 3. Seeding Data
To populate the database with example data (members, tutors, events, etc.):
```bash
# Only runs the seed script (prisma/seed.ts)
npx prisma db seed
```

---

## 📜 API Documentation

The full API specification is available via Swagger UI at `/api/docs` when the server is running.

### Key Endpoints
- **Auth:** `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`
- **Members:** `GET /api/members`, `POST /api/members`, `PUT /api/members/:id`, `DELETE /api/members/:id`
- **Tutors:** `GET /api/tutors`, `POST /api/tutors`, `PUT /api/tutors/:id`, `DELETE /api/tutors/:id`
- **Events:** `GET /api/events`, `POST /api/events`, `PUT /api/events/:id`, `DELETE /api/events/:id`
- **Content:** `GET /api/content/:type` (notice/faq/video)
- **ProSel:** `POST /api/prosel/apply`, `GET /api/prosel/applications`

---

## 🤖 Type Generation
This project uses an automated OpenAPI workflow to provide types for the frontend.

- `npm run generate:openapi`: Extracts models from Prisma and generates `openapi.json`.
- `npm run generate:types`: Generates TypeScript interfaces from the `openapi.json` into `src/types/api.ts`.

---

## 📁 Project Structure
```
src/
├── config/        # Database & Auth config
├── controllers/   # Route handlers
├── routes/        # API route definitions
├── middleware/    # Auth & Error handling
├── types/         # Generated API types
└── server.ts      # Express entry point
```

## License
MIT
