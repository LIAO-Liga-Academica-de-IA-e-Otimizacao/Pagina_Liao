# LIAO - Full Stack Application

Complete full-stack web application for LIAO (Liga de Informática Aplicada à Otimização) with React frontend and Node.js backend.

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** database
- **npm** or **yarn**

### Setup Instructions

#### 1. Database Setup

First, create a PostgreSQL database:

```sql
CREATE DATABASE liao_db;
```

#### 2. Backend Setup

```bash
cd liao-backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your database credentials
cp .env.example .env

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3001`

#### 3. Create Initial Admin User

You can create an admin user using Prisma Studio:

```bash
cd liao-backend
npx prisma studio
```

Or use the API directly after the server is running (you'll need to temporarily disable authentication on the register endpoint, or use a database client).

**Example admin user:**
- Email: `admin@liao.com`
- Password: `admin123` (will be hashed)
- Name: `Admin LIAO`

#### 4. Frontend Setup

```bash
cd liao-react

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
Pagina-liao/
├── liao-backend/          # Node.js + Express + Prisma backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth & error handling
│   │   ├── types/         # TypeScript types
│   │   └── server.ts      # Express app
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── README.md
│
└── liao-react/            # React + TypeScript + Vite frontend
    ├── src/
    │   ├── views/
    │   │   ├── pages/     # Page components
    │   │   ├── components/# Reusable components
    │   │   └── layouts/   # Layout wrappers
    │   ├── models/        # TypeScript interfaces
    │   ├── services/      # API client
    │   └── controllers/   # Custom hooks
    ├── public/
    │   ├── img/           # General images
    │   └── Liao_membros/  # Member photos
    └── README.md
```

## 🔧 Technology Stack

### Backend
- **Node.js** + **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register admin (🔒 protected)
- `GET /api/auth/me` - Get current user (🔒 protected)

### Members
- `GET /api/members` - List all members
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Create member (🔒 admin only)
- `PUT /api/members/:id` - Update member (🔒 admin only)
- `DELETE /api/members/:id` - Delete member (🔒 admin only)

### Tutors
- `GET /api/tutors` - List all tutors
- `GET /api/tutors/:id` - Get tutor by ID
- `POST /api/tutors` - Create tutor (🔒 admin only)
- `PUT /api/tutors/:id` - Update tutor (🔒 admin only)
- `DELETE /api/tutors/:id` - Delete tutor (🔒 admin only)

### Content
- `GET /api/content/:type` - Get content by type (notice/faq/video)
- `POST /api/content` - Create content (🔒 admin only)
- `PUT /api/content/:id` - Update content (🔒 admin only)
- `DELETE /api/content/:id` - Delete content (🔒 admin only)

### ProSel
- `GET /api/prosel` - Get selection process info
- `POST /api/prosel/apply` - Submit application
- `GET /api/prosel/applications` - List applications (🔒 admin only)
- `PUT /api/prosel/applications/:id` - Update status (🔒 admin only)

## 🎨 Features

### Public Features
- ✅ Responsive landing page with hero section
- ✅ Members directory with role-based grouping
- ✅ Tutors listing with subjects and availability
- ✅ Selection process application form
- ✅ Notices/announcements feed
- ✅ FAQ with accordion interface
- ✅ Video gallery

### Admin Features
- ✅ JWT-based authentication
- ✅ Protected admin dashboard
- ✅ CRUD operations for all content types
- ✅ Application management

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/liao_db"
JWT_SECRET="your-secret-key"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 🧪 Testing

### Test Backend API
```bash
# Health check
curl http://localhost:3001/health

# Get members
curl http://localhost:3001/api/members

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@liao.com","password":"admin123"}'
```

### Test Frontend
1. Open `http://localhost:5173`
2. Navigate through all pages
3. Test application form submission
4. Login to admin panel
5. Verify responsive design on mobile

## 📝 Development Workflow

1. **Start Backend:**
   ```bash
   cd liao-backend && npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd liao-react && npm run dev
   ```

3. **Database Management:**
   ```bash
   cd liao-backend
   npx prisma studio  # Visual database editor
   npx prisma migrate dev  # Create new migration
   ```

## 🚢 Production Deployment

### Backend
```bash
cd liao-backend
npm run build
npm start
```

### Frontend
```bash
cd liao-react
npm run build
# Deploy dist/ folder to hosting service
```

## 📖 Additional Resources

- [Backend README](./liao-backend/README.md)
- [Frontend README](./liao-react/README.md)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 🤝 Contributing

This is a project for LIAO. To contribute:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit for review

## 📄 License

MIT

---

**Built with ❤️ by LIAO Team**
