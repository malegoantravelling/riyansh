# 📁 Project Structure

```
riyansh-ecommerce/
│
├── apps/                           # Application workspace
│   ├── web/                        # Next.js customer-facing website
│   │   ├── src/
│   │   │   ├── app/                # Next.js 14 App Router
│   │   │   │   ├── about/          # About page
│   │   │   │   ├── auth/           # Authentication pages
│   │   │   │   │   ├── login/
│   │   │   │   │   └── signup/
│   │   │   │   ├── cart/           # Shopping cart page
│   │   │   │   ├── contact/        # Contact page
│   │   │   │   ├── store/          # Product listing page
│   │   │   │   ├── layout.tsx      # Root layout
│   │   │   │   ├── page.tsx        # Home page
│   │   │   │   └── globals.css     # Global styles
│   │   │   ├── components/         # React components
│   │   │   │   ├── ui/             # Shadcn UI components
│   │   │   │   ├── Navbar.tsx      # Navigation bar
│   │   │   │   ├── Footer.tsx      # Footer
│   │   │   │   └── ProductCard.tsx # Product card component
│   │   │   └── lib/                # Utility functions
│   │   │       ├── utils.ts        # Helper functions
│   │   │       ├── supabase.ts     # Supabase client
│   │   │       └── api.ts          # API helper
│   │   ├── public/                 # Static assets
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.ts
│   │   └── next.config.js
│   │
│   ├── admin/                      # React admin panel
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/             # Shadcn UI components
│   │   │   │   └── Layout.tsx      # Admin layout with sidebar
│   │   │   ├── pages/              # Admin pages
│   │   │   │   ├── Dashboard.tsx   # Dashboard with stats
│   │   │   │   ├── Products.tsx    # Product management
│   │   │   │   ├── Categories.tsx  # Category management
│   │   │   │   ├── Orders.tsx      # Order management
│   │   │   │   ├── Users.tsx       # User management
│   │   │   │   └── Login.tsx       # Admin login
│   │   │   ├── lib/
│   │   │   │   ├── utils.ts
│   │   │   │   └── api.ts
│   │   │   ├── App.tsx             # Main app component
│   │   │   ├── main.tsx            # Entry point
│   │   │   └── index.css           # Global styles
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.js
│   │   └── vite.config.ts
│   │
│   └── api/                        # Express.js API backend
│       ├── src/
│       │   ├── config/
│       │   │   └── supabase.ts     # Supabase configuration
│       │   ├── middleware/
│       │   │   └── auth.ts         # Authentication middleware
│       │   ├── routes/             # API route handlers
│       │   │   ├── auth.ts         # Authentication endpoints
│       │   │   ├── products.ts     # Product endpoints
│       │   │   ├── categories.ts   # Category endpoints
│       │   │   ├── cart.ts         # Cart endpoints
│       │   │   ├── orders.ts       # Order endpoints
│       │   │   └── users.ts        # User endpoints
│       │   └── index.ts            # Express app setup
│       ├── package.json
│       ├── tsconfig.json
│       └── nodemon.json
│
├── packages/                       # Shared packages
│   ├── db/                         # Database schema and types
│   │   ├── schema.sql              # Supabase SQL schema
│   │   ├── types.ts                # TypeScript type definitions
│   │   ├── index.ts
│   │   └── package.json
│   │
│   ├── config/                     # Shared configuration
│   │   ├── index.ts                # Config exports
│   │   ├── tsconfig.json           # Shared TS config
│   │   └── package.json
│   │
│   ├── ui/                         # Shared UI components
│   │   ├── Button.tsx
│   │   ├── index.tsx
│   │   └── package.json
│   │
│   └── utils/                      # Shared utilities
│       ├── src/
│       │   └── index.ts            # Utility functions
│       ├── tsconfig.json
│       └── package.json
│
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── .prettierrc                     # Prettier configuration
├── .eslintrc.json                  # ESLint configuration
│
├── package.json                    # Root package.json with scripts
│
├── README.md                       # Main documentation
├── SETUP_GUIDE.md                  # Detailed setup instructions
├── QUICKSTART.md                   # Quick start guide
├── FEATURES.md                     # Feature documentation
└── PROJECT_STRUCTURE.md            # This file
```

## 📝 Key Files Explained

### Root Level

- **`package.json`**: Manages workspaces and provides unified dev/build scripts
- **`.env.example`**: Template for environment variables
- **`.gitignore`**: Specifies files to ignore in version control

### Web App (`apps/web`)

- **Next.js 14** with App Router for modern React features
- **`app/`**: Contains all pages and layouts
- **`components/`**: Reusable React components
- **`lib/`**: Utility functions and API clients

### Admin Panel (`apps/admin`)

- **React + Vite** for fast development
- **`pages/`**: Admin pages with left sidebar navigation
- **`components/Layout.tsx`**: Sidebar layout with navigation
- **React Router** for client-side routing

### API Backend (`apps/api`)

- **Express.js** REST API
- **`routes/`**: API endpoint handlers
- **`middleware/`**: Authentication and validation
- **TypeScript** for type safety

### Shared Packages (`packages/`)

- **`db/`**: Database schema and TypeScript types
- **`config/`**: Shared configuration values
- **`ui/`**: Reusable UI components
- **`utils/`**: Common utility functions

## 🔄 Data Flow

1. **User visits website** → Next.js serves pages
2. **User action** → API request to Express backend
3. **API processes** → Validates, authenticates, queries Supabase
4. **Supabase returns data** → API formats response
5. **Frontend updates** → React re-renders UI

## 🎯 Component Architecture

### Web App Components

```
Layout (Navbar + Footer)
├── Home Page
│   ├── Hero Section
│   ├── Features Grid
│   ├── Product Grid (ProductCard)
│   ├── Newsletter Section
│   └── Testimonials
├── Store Page
│   ├── Filters Sidebar
│   └── Product Grid (ProductCard)
└── Cart Page
    ├── Cart Table
    └── Cart Totals
```

### Admin Panel Components

```
Layout (Sidebar Navigation)
├── Dashboard
│   ├── Stats Cards
│   └── Quick Actions
├── Products
│   ├── Product Table
│   └── Product Form (Add/Edit)
├── Categories
│   ├── Category Grid
│   └── Category Form
├── Orders
│   └── Order Table
└── Users
    └── User Table
```

## 🗂️ File Naming Conventions

- **Pages**: PascalCase (e.g., `Dashboard.tsx`)
- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Types**: PascalCase (e.g., `Product`, `Order`)
- **Routes**: lowercase (e.g., `products.ts`)

## 📦 Package Dependencies

### Web App

- Next.js, React, TypeScript
- Tailwind CSS, Shadcn UI
- Supabase client
- Lucide icons

### Admin Panel

- React, React Router, TypeScript
- Vite, Tailwind CSS, Shadcn UI
- Lucide icons

### API

- Express, TypeScript
- Supabase client
- CORS, dotenv
- Nodemon (dev)

### Shared

- TypeScript
- ESLint, Prettier

## 🛠️ Build Process

1. **Development**: `npm run dev` starts all apps with hot reload
2. **Build**: `npm run build` compiles TypeScript and bundles
3. **Production**: Each app can be deployed independently

## 🔐 Security Structure

- Environment variables for secrets
- Row Level Security (RLS) in Supabase
- JWT tokens for authentication
- Service role key for admin operations
- CORS configuration in API

## 📊 State Management

- **Web App**: React hooks (useState, useEffect)
- **Admin Panel**: React hooks + localStorage for auth
- **API**: Supabase session management

No external state management library needed for this architecture.
