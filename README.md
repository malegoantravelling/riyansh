# 🛍️ Riyansh E-Commerce Platform

> A modern, production-ready Ayurvedic e-commerce platform built with Next.js, React, Express.js, and Supabase.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e)](https://supabase.com/)

**✨ Fully functional | 🎨 Beautiful UI | 📱 Responsive | 🚀 Production-ready**

## 🏗️ Monorepo Structure

```
riyansh-ecommerce/
├── apps/
│   ├── web/              # Next.js 14 customer-facing website
│   ├── admin/            # React admin panel
│   └── api/              # Express.js REST API
├── packages/
│   ├── db/               # Supabase schema and migrations
│   ├── config/           # Shared configurations
│   ├── ui/               # Shared UI components
│   └── utils/            # Utility functions
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd riyansh-ecommerce
   ```

2. **Install dependencies**

   ```bash
   npm install
   cd apps/web && npm install
   cd ../admin && npm install
   cd ../api && npm install
   cd ../../packages/db && npm install
   cd ../config && npm install
   cd ../ui && npm install
   cd ../utils && npm install
   cd ../..
   ```

   Or use the shortcut:

   ```bash
   npm run install:all
   ```

3. **Set up Supabase**

   - Create a new Supabase project at https://supabase.com
   - Get your project URL and anon key from Settings > API
   - Get your service role key (keep this secure!)

4. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Supabase credentials:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

5. **Set up the database**

   The database schema is defined in `packages/db/schema.sql`. You can:

   **Option A: Using Supabase Dashboard**

   - Go to your Supabase project
   - Navigate to SQL Editor
   - Copy and paste the contents of `packages/db/schema.sql`
   - Run the SQL

   **Option B: Using Supabase CLI**

   ```bash
   cd packages/db
   npm run migrate
   ```

6. **Create Supabase Storage Bucket**

   - Go to Storage in your Supabase dashboard
   - Create a new bucket named `product-images`
   - Set it to public access

7. **Run the development servers**

   ```bash
   npm run dev
   ```

   This will start:

   - Web app: http://localhost:3000
   - Admin panel: http://localhost:3001
   - API: http://localhost:4000

## 🎨 Color Palette

- Background: `#FFFFFF`
- Text: `#1A1A1A`
- Muted text: `#737373`
- Primary/CTA: `#5B8C51`
- Primary hover: `#4E7A46`
- Primary dark: `#3D5D36`
- Accent (light green): `#7BA672`
- Cream / secondary surface: `#F6F0E2`
- Light cream: `#FAFAF2`
- Borders: `#E0E0E0` – `#EEEEEE`

## 📱 Apps

### Web App (Customer-facing)

- **Port**: 3000
- **Tech**: Next.js 14, Tailwind CSS, Shadcn UI
- **Features**:
  - Home page with featured products
  - Shop with filtering and sorting
  - Product detail pages
  - Shopping cart
  - User authentication
  - Contact form
  - About page

### Admin Panel

- **Port**: 3001
- **Tech**: React, Vite, Tailwind CSS, Shadcn UI
- **Login**: admin / admin123
- **Features**:
  - Left sidebar navigation
  - Dashboard with statistics
  - Product management (CRUD)
  - Category management
  - Order management
  - User management

### API Backend

- **Port**: 4000
- **Tech**: Express.js, TypeScript
- **Endpoints**:
  - `/api/auth/*` - Authentication
  - `/api/products/*` - Product operations
  - `/api/categories/*` - Category operations
  - `/api/cart/*` - Cart management
  - `/api/orders/*` - Order management
  - `/api/users/*` - User management (admin)

## 📦 Packages

- **db**: Supabase schema and types
- **config**: Shared TypeScript and ESLint configs
- **ui**: Reusable UI components
- **utils**: Utility functions and helpers

## 🔧 Development

### Commands

```bash
# Run all apps in development mode
npm run dev

# Run individual apps
npm run dev:web
npm run dev:admin
npm run dev:api

# Build all apps
npm run build

# Build individual apps
npm run build:web
npm run build:admin
npm run build:api
```

### Environment Variables

Each app requires specific environment variables. See `.env.example` for a complete list.

## 🗄️ Database Schema

### Tables

- `users` - User accounts
- `categories` - Product categories
- `products` - Product catalog
- `cart_items` - Shopping cart
- `orders` - Customer orders
- `order_items` - Order line items

### Storage

- `product-images` - Product image uploads

## 🚢 Deployment

### Web App (Vercel)

```bash
cd apps/web
vercel
```

### Admin Panel (Vercel/Netlify)

```bash
cd apps/admin
npm run build
# Deploy the dist/ folder
```

### API (Heroku/Railway/Render)

```bash
cd apps/api
# Follow your hosting provider's instructions
```

## 📝 Admin Credentials

**Default admin login:**

- Username: `admin`
- Password: `admin123`

⚠️ **Change these credentials in production!**

## 🔐 Security Notes

- Never commit `.env` files
- Use environment variables for all secrets
- Keep service role keys secure
- Enable RLS (Row Level Security) in Supabase for production
- Change default admin credentials

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 📧 Support

For support, email support@riyansh.com or open an issue.
