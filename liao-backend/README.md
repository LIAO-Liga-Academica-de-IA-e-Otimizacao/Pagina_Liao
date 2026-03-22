# LIAO Backend

Backend API for the LIAO (Liga de Informática Aplicada à Otimização) web application.

## Tech Stack

- **Node.js** + **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the following:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `PORT`: Server port (default: 3001)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:5173)

3. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

4. Generate Prisma Client:
```bash
npx prisma generate
```

5. (Optional) Create an admin user:
```bash
# You'll need to do this via API after starting the server
# Or use Prisma Studio: npx prisma studio
```

### Development

Start the development server with auto-reload:
```bash
npm run dev
```

### Production

Build and start:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new admin (protected)
- `GET /api/auth/me` - Get current user (protected)

### Members
- `GET /api/members` - List all members
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Create member (🔒 admin)
- `PUT /api/members/:id` - Update member (🔒 admin)
- `DELETE /api/members/:id` - Delete member (🔒 admin)

### Tutors
- `GET /api/tutors` - List all tutors
- `GET /api/tutors/:id` - Get tutor by ID
- `POST /api/tutors` - Create tutor (🔒 admin)
- `PUT /api/tutors/:id` - Update tutor (🔒 admin)
- `DELETE /api/tutors/:id` - Delete tutor (🔒 admin)

### Content
- `GET /api/content/:type` - Get content by type (notice/faq/video)
- `GET /api/content/item/:id` - Get content by ID
- `POST /api/content` - Create content (🔒 admin)
- `PUT /api/content/:id` - Update content (🔒 admin)
- `DELETE /api/content/:id` - Delete content (🔒 admin)

### ProSel
- `GET /api/prosel` - Get selection process info
- `POST /api/prosel/apply` - Submit application
- `GET /api/prosel/applications` - List applications (🔒 admin)
- `PUT /api/prosel/applications/:id` - Update application status (🔒 admin)

### Seeding
Populate the database with example data (admin, members, tutors, events):
```bash
npx prisma db seed
```

### Prisma Studio
Open Prisma Studio to manage database visually:
```bash
npx prisma studio
```

### Migrations
Create a new migration:
```bash
npx prisma migrate dev --name migration_name
```

### Reset Database
```bash
npx prisma migrate reset
```

## 📜 OpenAPI & Type Generation

This project uses an automated OpenAPI workflow. You **no longer need** to manually update `swagger.ts` when changing database models.

### Automated Workflow
1. **Update Schema:** Modify `prisma/schema.prisma`.
2. **Generate Types:** Run `npm run generate:types`.

### Scripts
- `npm run generate:openapi`: Extracts models from Prisma and generates a static `openapi.json`.
- `npm run generate:types`: Generates TypeScript interfaces from the `openapi.json` into `src/types/api.ts`.

### Documentation
- **Swagger UI:** Accessible at `/api/docs` (Development only).
- **Raw Spec:** Accessible at `/api/openapi.json`.

## Project Structure

```
src/
├── config/
│   └── database.ts          # Prisma client
├── controllers/
│   ├── authController.ts    # Authentication logic
│   ├── memberController.ts  # Member CRUD
│   ├── tutorController.ts   # Tutor CRUD
│   ├── contentController.ts # Content CRUD
│   └── proselController.ts  # ProSel logic
├── routes/
│   ├── auth.ts              # Auth routes
│   ├── members.ts           # Member routes
│   ├── tutors.ts            # Tutor routes
│   ├── content.ts           # Content routes
│   └── prosel.ts            # ProSel routes
├── middleware/
│   ├── auth.ts              # JWT middleware
│   └── errorHandler.ts      # Error handling
├── types/
│   └── index.ts             # TypeScript types
└── server.ts                # Express app
```

## License

MIT
