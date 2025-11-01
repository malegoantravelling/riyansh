# Quick Fix: Products Not Showing on Cloudways

## Current Error Status

**If you're seeing "EADDRINUSE" or port conflicts** (API trying to use port 3000 instead of 4000):
👉 **Read: FIX_API_PORT_ERROR.md first!**

**If your API has too many unstable restarts:**
👉 **Run the EMERGENCY_FIX.sh script on your server**

---

## The Problem

Your web app is trying to connect to `http://localhost:4000/api/products` but it should use your production domain.

**Error**: `GET http://localhost:4000/api/products net::ERR_CONNECTION_REFUSED`

## The Solution

You need to create a `.env.local` file in `apps/web/` with the correct API URL.

## Step-by-Step Fix

### 1. SSH into Cloudways Server

```bash
ssh master@your-server-ip
# Enter your password
```

### 2. Navigate to Project Directory

```bash
cd /home/1542906.cloudwaysapps.com/awxrfzsrma/public_html
```

### 3. Create Environment File for Web App

```bash
nano apps/web/.env.local
```

**Paste this content** (replace with your actual values):

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://riyanshamrit.com/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Press**: `Ctrl+X`, then `Y`, then `Enter` to save

### 4. Create Environment File for Admin

```bash
nano apps/admin/.env
```

**Paste this content**:

```env
NODE_ENV=production
VITE_API_URL=https://riyanshamrit.com/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Press**: `Ctrl+X`, then `Y`, then `Enter` to save

### 5. Create Environment File for API

```bash
nano apps/api/.env
```

**Paste this content** (fill in your actual values):

```env
NODE_ENV=production
PORT=4000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-email-app-password
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

**Press**: `Ctrl+X`, then `Y`, then `Enter` to save

### 6. Rebuild ALL Applications

```bash
# Rebuild API
cd apps/api
npm run build
cd ../..

# Rebuild Web App
cd apps/web
npm run build
cd ../..

# Rebuild Admin
cd apps/admin
npm run build
cd ../..
```

### 7. Restart PM2

```bash
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

### 8. Check PM2 Status

```bash
pm2 status
```

You should see all 3 apps running:

- riyansh-api
- riyansh-web
- riyansh-admin

### 9. Check Logs

```bash
# Check if API is working
pm2 logs riyansh-api --lines 50

# Check if Web app is working
pm2 logs riyansh-web --lines 50

# Check if Admin is working
pm2 logs riyansh-admin --lines 50
```

### 10. Test Your Website

1. Open your browser
2. Go to: `https://riyanshamrit.com`
3. Products should now load!

## Verify It's Working

### Test API directly:

```bash
curl https://riyanshamrit.com/api/products
```

Should return JSON with your products.

### Check browser console:

1. Open developer tools (F12)
2. Go to Network tab
3. Refresh page
4. Look for `/api/products` request
5. Should show `https://riyanshamrit.com/api/products` (NOT localhost!)

## Common Issues

### Issue: Still seeing localhost in network requests

**Fix**: You didn't rebuild the web app. Run:

```bash
cd apps/web
npm run build
cd ../..
pm2 restart riyansh-web
```

### Issue: Environment variables not being read

**Fix**: Make sure file is named exactly `.env.local` (not `.env.local.example`)

```bash
ls -la apps/web/.env.local  # Should show the file
```

### Issue: "NEXT_PUBLIC_API_URL is not defined"

**Fix**: Check file location and content:

```bash
cat apps/web/.env.local  # Should show your env variables
```

### Issue: API still returning connection refused

**Fix**: Check if API is actually running:

```bash
pm2 status riyansh-api  # Should show "online"
curl http://localhost:4000/api/products  # Should return JSON
```

## Still Having Issues?

Run these diagnostic commands:

```bash
# Check if all PM2 apps are running
pm2 status

# Check if ports are listening
netstat -tulpn | grep -E ':(3000|3001|4000)'

# Check environment variables are loaded
pm2 env 0  # For API
pm2 env 1  # For Web
pm2 env 2  # For Admin

# Check recent logs
pm2 logs --lines 100
```

## Success Indicators

✅ Browser console shows NO errors about localhost  
✅ Network tab shows `https://riyanshamrit.com/api/products`  
✅ Products display on the homepage  
✅ Admin panel accessible at `https://riyanshamrit.com/admin`  
✅ API returns data at `https://riyanshamrit.com/api/products`

## Need More Help?

Read the full guide: `CLOUDWAYS_SETUP.md`
