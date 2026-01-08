# LIAO React Frontend

Frontend application for LIAO (Liga de Informática Aplicada à Otimização) built with React, TypeScript, Vite, and Tailwind CSS.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Icon library

## Features

- 🎨 Modern, responsive design with Tailwind CSS
- 🔐 JWT-based authentication for admin panel
- 📱 Mobile-friendly navigation
- ⚡ Fast development with Vite HMR
- 🎯 Type-safe with TypeScript
- 🔄 API integration with backend

## Setup

### Prerequisites

- Node.js (v18 or higher)
- Backend API running (see `liao-backend/README.md`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001/api
```

3. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── views/
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Landing page
│   │   ├── Members.tsx     # Members list
│   │   ├── Tutors.tsx      # Tutors list
│   │   ├── ProSel.tsx      # Selection process
│   │   ├── Notices.tsx     # Notices/announcements
│   │   ├── FAQ.tsx         # FAQ page
│   │   ├── Video.tsx       # Videos page
│   │   ├── Login.tsx       # Admin login
│   │   └── Admin.tsx       # Admin dashboard
│   ├── components/         # Reusable components
│   │   ├── Card.tsx
│   │   ├── MemberCard.tsx
│   │   ├── TutorCard.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Modal.tsx
│   └── layouts/
│       └── MainLayout.tsx  # Main layout wrapper
├── models/                 # TypeScript interfaces
│   ├── Member.ts
│   ├── Tutor.ts
│   └── Content.ts
├── services/               # API services
│   └── api.ts              # Axios configuration
├── controllers/            # Custom hooks
│   └── useLiaoData.ts      # Data fetching hook
├── App.tsx                 # Main app with routing
├── main.tsx                # Entry point
└── index.css               # Global styles

public/
├── img/                    # General images
└── Liao_membros/           # Member photos
```

## Pages

### Public Pages
- **Dashboard (/)** - Landing page with hero, stats, and latest notices
- **Members (/members)** - Grid display of all members grouped by role
- **Tutors (/tutors)** - List of available tutors with subjects
- **ProSel (/prosel)** - Selection process application form
- **Notices (/notices)** - List of announcements
- **FAQ (/faq)** - Accordion-style FAQ
- **Videos (/videos)** - Embedded video gallery

### Admin Pages
- **Login (/login)** - Admin authentication
- **Admin (/admin)** - Admin dashboard (protected)

## API Integration

The frontend communicates with the backend API using Axios. All API calls are centralized in `src/services/api.ts`.

### Authentication
JWT tokens are stored in `localStorage` and automatically included in API requests via Axios interceptors.

### Available API Methods
- `apiService.login(email, password)`
- `apiService.getMembers()`
- `apiService.getTutors()`
- `apiService.getContentByType(type)`
- `apiService.submitApplication(data)`
- And more...

## Styling

The application uses Tailwind CSS with custom utilities defined in `index.css`:

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card component with shadow
- `.input-field` - Form input styling
- `.section-title` - Section heading style
- `.gradient-bg` - Primary gradient background
- `.glass` - Glassmorphism effect

## Development

### Adding a New Page

1. Create component in `src/views/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/views/components/Navbar.tsx`

### Adding Member Photos

Place photos in `public/Liao_membros/` and reference them in the database with just the filename.

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: `http://localhost:3001/api`)

## License

MIT
 
