# 🔧 Admin Panel Redirect Loop Fix

## Problem Identified

The admin panel at `https://riyanshamrit.com/admin/` is experiencing a **redirect loop** error (`ERR_TOO_MANY_REDIRECTS`).

### Root Cause

1. **Vite Config**: `vite.config.ts` has `base: '/admin/'` 
2. **Build Issue**: The built `index.html` references assets as `/assets/...` instead of `/admin/assets/...`
3. **Apache Routing**: `.htaccess` routes `/admin/(.*)` to port 3001, but there's a mismatch in how paths are handled
4. **Vite Preview**: The preview server needs to be configured to handle the base path correctly

### Current Configuration Issues

- ✅ `.htaccess` was forwarding `/admin/(.*)` to port 3001 as `/$1` (stripping admin)
- ❌ But Vite preview needs the base path to be preserved
- ❌ Built HTML has `/assets/...` instead of `/admin/assets/...`

## Solution

### Fix 1: Update `.htaccess` to Preserve Admin Path

**Changed**:
```apache
# Before
RewriteRule ^admin/(.*)$ http://127.0.0.1:3001/$1 [P,L]

# After  
RewriteRule ^admin/(.*)$ http://127.0.0.1:3001/admin/$1 [P,L]
```

**Why**: Vite preview server expects requests at `/admin/...` when base is set to `/admin/`

### Fix 2: Update PM2 Config to Use Base Path in Preview

**Changed in `ecosystem.config.js`**:
```javascript
// Before
args: 'preview --port 3001 --host',

// After
args: 'preview --port 3001 --host --base /admin/',
```

**Why**: Explicitly tells Vite preview server about the base path

### Fix 3: Rebuild Admin App

The admin app needs to be rebuilt to ensure assets are correctly referenced with the base path.

## Deployment Steps

### Step 1: Upload Fixed Files

Upload these fixed files to your Cloudways server:

1. `.htaccess` (root directory)
2. `ecosystem.config.js` (root directory)

### Step 2: SSH to Server and Rebuild

```bash
cd /home/1542906.cloudwaysapps.com/awxrfzsrma/public_html

# Stop PM2
pm2 stop all

# Rebuild admin app to ensure base path is correct
cd apps/admin
npm run build
cd ../..

# Restart PM2 with updated config
pm2 start ecosystem.config.js
pm2 save
```

### Step 3: Verify

1. Visit: `https://riyanshamrit.com/admin/`
   - Should load without redirect loop
   - No console errors

2. Check browser console:
   - No 404 errors for assets
   - Assets should load from `/admin/assets/...`

3. Test login:
   - Login with `admin` / `admin123`
   - Should authenticate successfully

## Alternative Solution (If Above Doesn't Work)

If the redirect loop persists, we may need to:

1. **Remove base path from Vite config** and handle routing differently
2. **Use a static file server** instead of Vite preview
3. **Serve admin from a subdomain** instead of `/admin/` path

## Expected Behavior After Fix

✅ Admin panel loads at `https://riyanshamrit.com/admin/`
✅ No redirect loops
✅ Assets load correctly from `/admin/assets/...`
✅ Login works
✅ All admin features functional

## Technical Details

### Request Flow (After Fix)

1. User visits: `https://riyanshamrit.com/admin/`
2. Apache receives request at `/admin/`
3. `.htaccess` matches pattern and forwards to `http://127.0.0.1:3001/admin/`
4. Vite preview server (running with `--base /admin/`) receives request at `/admin/`
5. Vite serves the HTML from `dist/index.html`
6. HTML references assets at `/admin/assets/...`
7. Browser requests `/admin/assets/...`
8. Apache forwards to `http://127.0.0.1:3001/admin/assets/...`
9. Vite serves the assets
10. ✅ Page loads successfully!

## Verification Commands

```bash
# Check PM2 status
pm2 status

# Check admin logs
pm2 logs riyansh-admin --lines 50

# Test admin server directly
curl http://localhost:3001/admin/

# Check Apache logs for errors
tail -n 100 /var/log/apache2/error.log
```

---

**Status**: Fixed and ready for deployment
**Date**: $(date)

