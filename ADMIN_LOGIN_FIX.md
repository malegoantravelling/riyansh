# 🔧 Admin Login Fix - localhost API URL Issue

## Problem Identified

The admin panel at `https://riyanshamrit.com/admin/` was failing to login with error:
```
POST http://localhost:4000/api/auth/admin/login net::ERR_CONNECTION_REFUSED
```

### Root Cause

1. **API URL Fallback**: `apps/admin/src/lib/api.ts` had fallback URL as `http://0.0.0.0:4000`
2. **Missing Environment Variable**: `VITE_API_URL` was either not set during build or the built app wasn't using it
3. **Hardcoded localhost**: `apps/admin/src/pages/Products.tsx` had hardcoded `http://0.0.0.0:4000` for image uploads

## Solution Applied

### Fix 1: Updated API URL Fallback

**File**: `apps/admin/src/lib/api.ts`

**Changed**:
```typescript
// Before
const API_URL = import.meta.env.VITE_API_URL || 'http://0.0.0.0:4000'

// After  
export const API_URL = import.meta.env.VITE_API_URL || 'https://riyanshamrit.com'
```

**Why**: 
- Changed fallback from localhost to production URL
- Exported API_URL for use in other files
- If `VITE_API_URL` env var is missing during build, it will use production URL instead of localhost

### Fix 2: Fixed Hardcoded localhost in Products.tsx

**File**: `apps/admin/src/pages/Products.tsx`

**Changed**:
```typescript
// Before
const response = await fetch('http://0.0.0.0:4000/api/products/upload-image', {
  method: 'POST',
  body: formDataToSend,
})

// After
import { api, API_URL } from '@/lib/api'
// ...
const response = await fetch(`${API_URL}/api/products/upload-image`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
  },
  body: formDataToSend,
})
```

**Why**:
- Removed hardcoded localhost URL
- Uses same API_URL constant as rest of the app
- Added authorization header for consistency

### Fix 3: Updated Deployment Script

**File**: `FIX_ADMIN_REDIRECT_LOOP.sh`

**Added**: Environment variable setup before building admin app

**Why**: Ensures `VITE_API_URL` is set correctly during build process

## Deployment Steps

### Step 1: Upload Fixed Files

Upload these fixed files to your Cloudways server:

1. `apps/admin/src/lib/api.ts`
2. `apps/admin/src/pages/Products.tsx`
3. `FIX_ADMIN_REDIRECT_LOOP.sh` (updated)

### Step 2: SSH to Server and Deploy

```bash
cd /home/1542906.cloudwaysapps.com/awxrfzsrma/public_html

# Stop PM2
pm2 stop all

# Set environment variables and rebuild admin
chmod +x FIX_ADMIN_REDIRECT_LOOP.sh
./FIX_ADMIN_REDIRECT_LOOP.sh

# Or manually:
cd apps/admin
cat > .env << 'EOF'
NODE_ENV=production
VITE_API_URL=https://riyanshamrit.com
VITE_SUPABASE_URL=https://iwvrjjgjxxtlvvbdbytb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dnJqamdqeHh0bHZ2YmRieXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNDE5NDYsImV4cCI6MjA3NTYxNzk0Nn0.GfdDYw6nfj3RyG6xj50lxhIwTJGouLvO0MxJXaa-LDk
EOF
npm run build
cd ../..
pm2 start ecosystem.config.js
pm2 save
```

### Step 3: Verify

1. Visit: `https://riyanshamrit.com/admin/`
2. Fill in credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click "Sign In"
4. ✅ Should log in successfully
5. Check browser console:
   - ✅ Should see: `POST https://riyanshamrit.com/api/auth/admin/login`
   - ❌ Should NOT see: `localhost:4000` or `0.0.0.0:4000`

## Expected Behavior After Fix

✅ Admin panel loads at `https://riyanshamrit.com/admin/`
✅ Login form accepts credentials
✅ API calls go to `https://riyanshamrit.com/api/...`
✅ Login successful with admin/admin123
✅ No localhost or 0.0.0.0 references in console

## Technical Details

### How Vite Environment Variables Work

Vite replaces `import.meta.env.VITE_API_URL` at **build time**, not runtime. This means:

1. Environment variable must be set **before** running `npm run build`
2. The value is baked into the built JavaScript files
3. If the env var is missing, it uses the fallback value in code

### Why the Fix Works

1. **Updated Fallback**: Changed from `http://0.0.0.0:4000` to `https://riyanshamrit.com`
   - Even if env var is missing, it uses production URL

2. **Exported API_URL**: Now other files can import and use it
   - Consistent API URL across all files

3. **Environment Setup**: Script ensures env vars are set before build
   - Guarantees correct URL is used during build

## Verification Commands

```bash
# Check PM2 status
pm2 status

# Check admin logs
pm2 logs riyansh-admin --lines 50

# Test admin API call directly
curl https://riyanshamrit.com/api/auth/admin/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Verify environment variables
cat apps/admin/.env
```

---

**Status**: Fixed and ready for deployment ✅
**Files Modified**: 
- `apps/admin/src/lib/api.ts`
- `apps/admin/src/pages/Products.tsx`
- `FIX_ADMIN_REDIRECT_LOOP.sh`

**Next**: Upload files and run deployment script

