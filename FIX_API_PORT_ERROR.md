# Fix: API Server Port Error

## The Problem

Your API server is trying to use port 3000 instead of 4000, causing a conflict with the web app.

**Error**: `EADDRINUSE` on port 3000, API shows "running on http://localhost:3000"

This happens because an `.env` file in `apps/api/` has `PORT=3000` which overrides the PM2 configuration.

## The Solution

You need to either:
1. Delete or fix the `.env` file in `apps/api/`
2. Or make sure it has `PORT=4000`

## Quick Fix Steps

### 1. Check if .env file exists

```bash
ssh master@your-server-ip
cd /home/1542906.cloudwaysapps.com/awxrfzsrma/public_html
ls -la apps/api/.env
```

### 2. If .env exists, check its contents

```bash
cat apps/api/.env
```

Look for a line like `PORT=3000` or similar.

### 3. Fix the .env file

```bash
nano apps/api/.env
```

Change `PORT=3000` to `PORT=4000` (or add this line if missing).

**Press**: `Ctrl+X`, then `Y`, then `Enter` to save

### 4. Or delete the .env file entirely

PM2 will use its own environment variables from `ecosystem.config.js`:

```bash
rm apps/api/.env
```

### 5. Stop and clean up PM2

```bash
pm2 delete all
pm2 kill  # Stop all PM2 processes
pm2 flush  # Clear logs
```

### 6. Check for any processes using the ports

```bash
# Check what's using port 3000
lsof -i :3000
# Kill any processes if needed
kill -9 $(lsof -t -i:3000)

# Check what's using port 4000
lsof -i :4000
# Kill any processes if needed
kill -9 $(lsof -t -i:4000)
```

### 7. Start PM2 again

```bash
pm2 start ecosystem.config.js
pm2 save
```

### 8. Verify it's working

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs riyansh-api --lines 20

# Should see: "🚀 API server running on http://localhost:4000"
# NOT: "🚀 API server running on http://localhost:3000"
```

### 9. Test the API

```bash
# Test API on the correct port
curl http://localhost:4000/api/products
```

Should return JSON data.

## Alternative: Create Correct .env File

If you prefer to keep a `.env` file, make sure it's correct:

```bash
cat > apps/api/.env << 'EOF'
NODE_ENV=production
PORT=4000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
EOF
```

Then rebuild and restart:

```bash
cd apps/api
npm run build
cd ../..
pm2 restart riyansh-api
```

## Why This Happens

- `dotenv.config()` in `apps/api/src/index.ts` reads `.env` files
- Environment variables from `.env` files take precedence over PM2's env variables
- So if `.env` has `PORT=3000`, it overrides `PORT=4000` in `ecosystem.config.js`

## Prevention

**Best Practice**: Don't use `.env` files in production with PM2. Instead:
1. Let PM2 manage environment variables via `ecosystem.config.js`
2. Or use PM2's `env_file` option to explicitly specify which .env to use
3. Or remove `.env` files and only use `ecosystem.config.js`

## Verify Success

✅ PM2 shows all apps "online"  
✅ API logs show port 4000  
✅ Web app logs show port 3000  
✅ Admin logs show port 3001  
✅ No "EADDRINUSE" errors  
✅ `curl http://localhost:4000/api/products` returns data

