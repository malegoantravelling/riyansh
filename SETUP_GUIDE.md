# Riyansh E-Commerce - Complete Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **Supabase** account (free tier is fine)
- A code editor (VS Code recommended)

## 🚀 Step-by-Step Setup

### 1. Install Dependencies

First, install the root dependencies:

```bash
npm install
```

Then install dependencies for all apps and packages:

```bash
# Web app
cd apps/web
npm install
cd ../..

# Admin panel
cd apps/admin
npm install
cd ../..

# API backend
cd apps/api
npm install
cd ../..

# Shared packages
cd packages/db
npm install
cd ../config
npm install
cd ../ui
npm install
cd ../utils
npm install
cd ../..
```

Or use the convenient script:

```bash
npm run install:all
```

### 2. Set Up Supabase

#### 2.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create a free account
3. Click "New Project"
4. Fill in the details:
   - Project name: `riyansh-ecommerce`
   - Database password: (create a strong password)
   - Region: Choose closest to you
5. Click "Create new project" and wait for it to initialize

#### 2.2 Get Your Supabase Credentials

1. Go to **Settings** > **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**
   - **service_role key** (⚠️ Keep this secret!)

#### 2.3 Set Up the Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the entire contents of `packages/db/schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the SQL

This will create:

- All necessary tables (users, products, categories, cart_items, orders, order_items)
- Indexes for better performance
- Row Level Security (RLS) policies
- Sample categories

#### 2.4 Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **Create a new bucket**
3. Bucket name: `product-images`
4. Set to **Public bucket** (toggle on)
5. Click **Create bucket**

### 3. Configure Environment Variables

Create a `.env` file in the root directory:
`
```bash
cp .env.example .env
```

Edit the `.env` file and add your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# API Configuration
API_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000

# Admin Panel
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Backend Configuration
PORT=4000
NODE_ENV=development
JWT_SECRET=your_random_secret_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_service_role_key_here
```

### 4. Run the Development Servers

From the root directory, run:

```bash
npm run dev
```

This will start all three applications simultaneously:

- **Web App**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **API Backend**: http://localhost:4000

### 5. Access the Applications

#### Customer-Facing Website (http://localhost:3000)

- Browse products
- Add items to cart
- Create an account
- Place orders

#### Admin Panel (http://localhost:3001)

**Default credentials:**

- Username: `admin`
- Password: `admin123`

**Features:**

- Dashboard with statistics
- Product management (CRUD)
- Category management
- Order management
- User management

#### API Backend (http://localhost:4000)

REST API endpoints for all operations

## 📦 Adding Sample Products (Optional)

Since we don't have seed data, you can add products manually:

1. Go to http://localhost:3001
2. Login with `admin` / `admin123`
3. Navigate to **Products**
4. Click **Add Product**
5. Fill in the form:
   - Name: `Bioderma`
   - Slug: `bioderma`
   - Description: `Natural skincare product`
   - Price: `49.00`
   - Category: Select one
   - Stock: `100`
   - Image URL: Use placeholder like `https://via.placeholder.com/300x300?text=Bioderma`
6. Click **Create Product**

Repeat for multiple products to populate your store.

## 🛠️ Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

```bash
# Kill the process using the port (macOS/Linux)
lsof -ti:3000 | xargs kill
lsof -ti:3001 | xargs kill
lsof -ti:4000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module Not Found Errors

Make sure all dependencies are installed:

```bash
npm run install:all
```

### Supabase Connection Issues

1. Double-check your environment variables
2. Ensure the Supabase project is active
3. Verify the credentials from Supabase dashboard

### API Not Responding

1. Check if the API is running on port 4000
2. Verify environment variables are set
3. Check the terminal for error messages

## 🔄 Running Individual Apps

If you need to run apps separately:

```bash
# Web app only
npm run dev:web

# Admin panel only
npm run dev:admin

# API only
npm run dev:api
```

## 📝 Building for Production

Build all apps:

```bash
npm run build
```

Or build individually:

```bash
npm run build:web
npm run build:admin
npm run build:api
```

## 🚢 Deployment

### Web App (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to web app: `cd apps/web`
3. Run: `vercel`
4. Add environment variables in Vercel dashboard

### Admin Panel (Vercel/Netlify)

1. Build: `cd apps/admin && npm run build`
2. Deploy the `dist` folder to your hosting provider

### API (Railway/Render/Heroku)

1. Create a new project
2. Connect your repository
3. Set environment variables
4. Deploy from `apps/api` directory

## 📧 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure Supabase database schema is properly set up
4. Check that all dependencies are installed

## 🎉 Next Steps

1. Customize the color scheme in Tailwind configs
2. Add your own product images
3. Configure email notifications
4. Set up payment gateway integration
5. Add more features as needed

Enjoy building with Riyansh E-Commerce! 🛍️
 