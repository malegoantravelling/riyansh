# 🚀 Development Guide - Running Your Entire Project

## Running All Applications at Once

### Option 1: Using npm run dev (Recommended for Development) ⭐

You already have a unified development command set up! Just run:

```bash
npm run dev
```

This single command will start all three applications:
- **Web App** (Next.js): http://localhost:3000
- **Admin Panel** (Vite): http://localhost:3001  
- **API** (Express): http://localhost:4000

Behind the scenes, it uses `concurrently` to run all apps simultaneously with colored output.

### Option 2: Using PM2 (Recommended for Production)

For production deployment on Cloudways:

```bash
# Start all apps
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs

# Stop all apps
pm2 stop all

# Restart all apps
pm2 restart all
```

---

## Individual Commands

If you need to run apps separately:

### Web App (Next.js)
```bash
npm run dev:web
# or
cd apps/web && npm run dev
```

### Admin Panel (Vite)
```bash
npm run dev:admin
# or
cd apps/admin && npm run dev
```

### API (Express)
```bash
npm run dev:api
# or
cd apps/api && npm run dev
```

---

## What's Configured

### `package.json` Scripts

```json
{
  "dev": "concurrently \"npm run dev:web\" \"npm run dev:admin\" \"npm run dev:api\"",
  "dev:web": "cd apps/web && npm run dev",
  "dev:admin": "cd apps/admin && npm run dev",
  "dev:api": "cd apps/api && npm run dev",
  "build": "npm run build:web && npm run build:admin && npm run build:api"
}
```

### `ecosystem.config.js` (PM2 Configuration)

**For Production Use:**
- **riyansh-api**: Port 4000
- **riyansh-web**: Port 3000  
- **riyansh-admin**: Port 3001

All configured with:
- ✅ Auto-restart
- ✅ Logging to `logs/` directory
- ✅ Memory limits
- ✅ Production environment

---

## Quick Start

### First Time Setup

```bash
# Install all dependencies
npm run install:all

# Run development servers
npm run dev
```

### Production Deployment

```bash
# Build all apps
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
```

---

## Ports Used

| Application | Port | URL |
|------------|------|-----|
| Web App (Next.js) | 3000 | http://localhost:3000 |
| Admin Panel (Vite) | 3001 | http://localhost:3001 |
| API (Express) | 4000 | http://localhost:4000 |

---

## Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### PM2 Process Issues

```bash
# Check if processes are running
pm2 status

# View detailed logs
pm2 logs riyansh-api --lines 50

# Delete all processes
pm2 delete all

# Restart from scratch
pm2 start ecosystem.config.js
```

### Build Issues

```bash
# Clean and rebuild
rm -rf apps/*/node_modules apps/*/.next apps/api/dist apps/admin/dist
npm run install:all
npm run build
```

---

## Development vs Production

### Development
- ✅ Use `npm run dev` (runs all 3 apps)
- ✅ Hot reload enabled
- ✅ Shows errors in console
- ✅ Source maps available

### Production (Cloudways)
- ✅ Use `pm2 start ecosystem.config.js`
- ✅ Auto-restart on crash
- ✅ Logs to files
- ✅ Memory limits enforced
- ✅ Production optimizations

---

## Summary

**For Development**: Just run `npm run dev` ✨

**For Production**: Use `pm2 start ecosystem.config.js`

That's it! Your entire full-stack application runs with a single command.
