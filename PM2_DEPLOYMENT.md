# PM2 Deployment Guide

## Issue Fixed

The original configuration was using `npm start` which was running dev mode. Now it uses direct commands to run production builds.

## Changes Made

### 1. **API Server**
- **Before**: `script: 'npm', args: 'start'` → was running `nodemon` (dev mode)
- **After**: `script: 'node', args: 'dist/index.js'` → runs compiled production code

### 2. **Web App**
- **Before**: `script: 'npm', args: 'start -- -p 3000'` 
- **After**: `script: 'node_modules/.bin/next', args: 'start -p 3000'` → runs Next.js production server

### 3. **Admin Panel**
- **Before**: `script: 'npm', args: 'run preview -- --port 3001'`
- **After**: `script: 'node_modules/.bin/vite', args: 'preview --port 3001 --host'` → runs Vite production preview

## Deployment Steps on Cloudways

### 1. Build All Applications

```bash
# Build API
cd apps/api
npm run build
cd ../..

# Build Web App
cd apps/web
npm run build
cd ../..

# Build Admin Panel
cd apps/admin
npm run build
cd ../..
```

### 2. Create Logs Directory

```bash
mkdir -p logs
```

### 3. Start with PM2

```bash
pm2 start ecosystem.config.js
```

### 4. Check Status

```bash
pm2 status
pm2 logs
```

### 5. Save Configuration

```bash
pm2 save
pm2 startup
# Follow the instructions, then:
pm2 save
```

## Verification

Check that all apps are running in production mode:

```bash
# Check API logs (should NOT see nodemon)
pm2 logs riyansh-api

# Check Web logs (should NOT see webpack-hmr errors)
pm2 logs riyansh-web

# Check Admin logs (should see Vite preview server)
pm2 logs riyansh-admin
```

## Troubleshooting

### If apps still show dev mode:
1. Make sure you ran `npm run build` in each app
2. Delete PM2 processes: `pm2 delete all`
3. Restart: `pm2 start ecosystem.config.js`

### If products still not showing:
1. Check API is running: `curl http://localhost:4000/api/products`
2. Check Web App API_URL env var points to correct API server
3. Check CORS settings on API
4. Check Supabase credentials are correct

### If seeing connection errors:
1. Verify all apps are actually running: `pm2 list`
2. Check if ports are available: `netstat -tulpn | grep :4000`
3. Review error logs: `tail -f logs/*-err.log`

## Important Notes

- **Always build before deploying** - PM2 now runs compiled code
- **Logs are in** `./logs/` directory at the root
- **All apps must be built** before starting PM2
- **Environment variables** must be set in each app's directory

## Production Checklist

- [ ] All apps built successfully
- [ ] Logs directory created
- [ ] Environment variables configured
- [ ] PM2 processes running
- [ ] PM2 startup script configured
- [ ] API responds at http://localhost:4000/api/products
- [ ] Web app accessible
- [ ] Admin panel accessible
- [ ] Products loading on website

