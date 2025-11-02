# 🔧 Admin Login Issue - Analysis & Solution

## Problem Analysis

**Issue**: Admin panel at `https://riyanshamrit.com/admin/` cannot login

**Error Observed**:
```
POST http://localhost:4000/api/auth/admin/login net::ERR_CONNECTION_REFUSED
```

**Root Cause**:
The deployed admin app was built with the old code that had `http://0.0.0.0:4000` as the API URL fallback. Even though we fixed the code to use `https://riyanshamrit.com` as the fallback, **the server is still running the old build**.

## Current Status

### ✅ Code is Fixed Locally
- `apps/admin/src/lib/api.ts` has correct fallback: `'https://riyanshamrit.com'`
- `apps/admin/src/pages/Products.tsx` uses `API_URL` constant (no hardcoded localhost)

### ❌ Server Has Old Build
- The admin app on the server needs to be rebuilt with the updated code
- Environment variables need to be set correctly during build

## Solution

### Deployment Steps

1. **Upload Fixed Files to Server**

   Upload these files to your Cloudways server:
   - `apps/admin/src/lib/api.ts` ✅ (has production URL fallback)
   - `apps/admin/src/pages/Products.tsx` ✅ (uses API_URL constant)

2. **SSH to Server and Run Fix Script**

   ```bash
   cd /home/1542906.cloudwaysapps.com/awxrfzsrma/public_html
   
   # Upload FIX_ADMIN_LOGIN.sh first, then:
   chmod +x FIX_ADMIN_LOGIN.sh
   ./FIX_ADMIN_LOGIN.sh
   ```

   OR manually:
   
   ```bash
   cd /home/1542906.cloudwaysapps.com/awxrfzsrma/public_html
   
   # Stop PM2
   pm2 stop all
   
   # Set environment variables
   cd apps/admin
   cat > .env << 'EOF'
   NODE_ENV=production
   VITE_API_URL=https://riyanshamrit.com
   VITE_SUPABASE_URL=https://iwvrjjgjxxtlvvbdbytb.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dnJqamdqeHh0bHZ2YmRieXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNDE5NDYsImV4cCI6MjA3NTYxNzk0Nn0.GfdDYw6nfj3RyG6xj50lxhIwTJGouLvO0MxJXaa-LDk
   EOF
   
   # Clean and rebuild
   rm -rf dist
   rm -rf node_modules/.vite
   npm run build
   
   # Restart PM2
   cd ../..
   pm2 start ecosystem.config.js
   pm2 save
   ```

3. **Verify After Deployment**

   - Visit: `https://riyanshamrit.com/admin/`
   - Login with: `admin` / `admin123`
   - Check browser console:
     - ✅ Should see: `POST https://riyanshamrit.com/api/auth/admin/login`
     - ❌ Should NOT see: `localhost:4000` or `0.0.0.0:4000`

## Expected Behavior After Fix

✅ Admin panel loads correctly
✅ Login form accepts credentials
✅ API calls go to `https://riyanshamrit.com/api/...`
✅ Login successful with admin/admin123
✅ No localhost or 0.0.0.0 errors in console

## Technical Details

### Why Vite Environment Variables Matter

Vite replaces `import.meta.env.VITE_API_URL` at **build time**, not runtime. This means:

1. If `VITE_API_URL` is set in `.env` before building, it uses that value
2. If `VITE_API_URL` is not set, it uses the fallback in code: `'https://riyanshamrit.com'`
3. The value is "baked into" the JavaScript bundle during build

### Current Code Status

**File**: `apps/admin/src/lib/api.ts`
```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'https://riyanshamrit.com'
```

This is correct! The fallback uses production URL instead of localhost.

**File**: `apps/admin/src/pages/Products.tsx`
```typescript
import { api, API_URL } from '@/lib/api'
// ...
const response = await fetch(`${API_URL}/api/products/upload-image`, {
  // ...
})
```

This is correct! No hardcoded localhost URLs.

## Verification Commands

```bash
# Check PM2 status
pm2 status

# Check admin logs
pm2 logs riyansh-admin --lines 50

# Test admin login API directly
curl -X POST http://localhost:4000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Verify environment variables
cat apps/admin/.env

# Check if build contains correct URL (grep the built bundle)
grep -r "riyanshamrit.com" apps/admin/dist/assets/*.js
```

---

**Status**: Code fixed locally ✅ | Needs deployment to server ⚠️

**Next**: Upload files and run `FIX_ADMIN_LOGIN.sh` on server

