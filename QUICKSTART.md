# 🚀 Quick Start Guide

Get Riyansh E-Commerce running in under 10 minutes!

## Step 1: Install Dependencies (2 minutes)

```bash
# Install root dependencies
npm install

# Install all app dependencies
npm run install:all
```

## Step 2: Set Up Supabase (3 minutes)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to **SQL Editor** and run `packages/db/schema.sql`
4. Go to **Storage** and create public bucket named `product-images`
5. Copy your credentials from **Settings > API**

## Step 3: Configure Environment (1 minute)

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_service_role_key
```

## Step 4: Run the Apps (30 seconds)

```bash
npm run dev
```

## Step 5: Access Your Apps

- **Customer Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3001 (login: admin/admin123)
- **API**: http://localhost:4000

## Step 6: Add Sample Products (2 minutes)

1. Go to http://localhost:3001
2. Login with `admin` / `admin123`
3. Click **Products** → **Add Product**
4. Fill in the form and save
5. Repeat for a few more products

## 🎉 Done!

Your e-commerce platform is now running!

### What's Next?

- Customize colors in Tailwind configs
- Add your product images to Supabase Storage
- Configure email notifications
- Deploy to production

### Need Help?

- Check `SETUP_GUIDE.md` for detailed setup
- See `FEATURES.md` for complete feature list
- Read `README.md` for architecture overview

---

**Default Admin Credentials:**

- Username: `admin`
- Password: `admin123`

⚠️ **Important**: Change these in production!
