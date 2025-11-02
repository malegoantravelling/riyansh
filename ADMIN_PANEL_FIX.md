# 🔧 Admin Panel Fix - Complete Solution

## Issues Identified

### 1. ✅ .htaccess Double `/admin/admin` Path

**Problem**: `.htaccess` was routing `/admin/(.*)` to `http://127.0.0.1:3001/admin/$1`, creating `/admin/admin/...` paths.

**Fixed**: Changed to route to `http://127.0.0.1:3001/$1` instead.

### 2. ✅ Admin API URL Double `/api/api` Path

**Problem**: `VITE_API_URL` was set to `https://riyanshamrit.com/api`, causing `/api/api/...` paths.

**Fixed**: Changed to `https://riyanshamrit.com`.

### 3. ✅ Checkout Page localhost Reference

**Problem**: Checkout page had hardcoded `localhost:4000`.

**Fixed**: Changed to `0.0.0.0:4000`.

---

## Files Changed

### Configuration Files

1. ✅ `.htaccess` - Fixed admin routing to remove double `/admin` path
2. ✅ `FINAL_PRODUCTION_FIX.sh` - Fixed `VITE_API_URL` to remove `/api` suffix
3. ✅ `apps/web/src/app/checkout/page.tsx` - Fixed localhost reference

---

## Deployment Instructions

### Step 1: Deploy to Server

Upload these files to your Cloudways server:

- `.htaccess` (root)
- Updated `FINAL_PRODUCTION_FIX.sh`

### Step 2: Run Deployment Script

SSH into your Cloudways server and run:

```bash
cd /home/1542906.cloudwaysapps.com/awxrfzsrma/public_html
chmod +x FINAL_PRODUCTION_FIX.sh
./FINAL_PRODUCTION_FIX.sh
```

This will:

1. ✅ Update environment variables
2. ✅ Rebuild all applications
3. ✅ Restart PM2 processes

### Step 3: Verify

1. **Test Admin Panel**: https://riyanshamrit.com/admin/

   - Should load without `/admin/admin` errors
   - Console should show NO network errors

2. **Test Login**: Try logging in with admin/admin123

   - Should authenticate successfully
   - No API call errors in console

3. **Check Network Tab**:
   - API calls should go to: `https://riyanshamrit.com/api/auth/admin/login`
   - NO `api/api` in URLs
   - NO localhost errors

---

## Verification Checklist

- [ ] Admin panel loads at https://riyanshamrit.com/admin/
- [ ] No `404` errors for `/admin/admin` paths
- [ ] Console shows no network errors
- [ ] Login works with admin/admin123
- [ ] API calls go to correct URLs (no `/api/api`)
- [ ] All products visible in admin dashboard

---

## Expected Behavior

### Before Fix

- ❌ Admin panel shows blank page or 404
- ❌ Console shows `/admin/admin/...` 404 errors
- ❌ API calls go to `/api/api/...` (404)
- ❌ Login fails

### After Fix

- ✅ Admin panel loads correctly
- ✅ No console errors
- ✅ API calls go to `https://riyanshamrit.com/api/...`
- ✅ Login works perfectly
- ✅ Dashboard loads with data

---

## Technical Details

### .htaccess Changes

**Before**:

```apache
RewriteRule ^admin/(.*)$ http://127.0.0.1:3001/admin/$1 [P,L]
```

**After**:

```apache
RewriteRule ^admin/(.*)$ http://127.0.0.1:3001/$1 [P,L]
```

**Why**: Vite preview server already handles the `/admin/` base path, so we shouldn't add it twice.

### Environment Variable Changes

**Before**:

```bash
VITE_API_URL=https://riyanshamrit.com/api
```

**After**:

```bash
VITE_API_URL=https://riyanshamrit.com
```

**Why**: The admin API client already appends `/api` to endpoints, so the base URL shouldn't include it.

### Request Flow

**Request**: User visits `https://riyanshamrit.com/admin/`

1. Apache receives request
2. `.htaccess` matches `/admin/` pattern
3. Routes to `http://127.0.0.1:3001/` (with original path stripped)
4. Vite preview server serves from `/admin/` base path
5. ✅ Admin panel loads!

**API Call**: Login button clicked

1. Frontend: `api.post('/api/auth/admin/login', ...)`
2. API URL: `VITE_API_URL` = `https://riyanshamrit.com`
3. Full URL: `https://riyanshamrit.com/api/auth/admin/login`
4. Apache routes `/api/...` to port 4000
5. Express handles `/api/auth/admin/login` route
6. ✅ Login successful!

---

## Rollback Instructions

If something goes wrong:

```bash
# Restore original .htaccess
cd /home/1542906.cloudwaysapps.com/awxrfzsrma/public_html
git checkout .htaccess

# Restart PM2
pm2 restart all

# Or restore from backup
pm2 restart all --update-env
```

---

## Support

If issues persist after deploying:

1. Check PM2 logs:

   ```bash
   pm2 logs riyansh-admin --lines 50
   ```

2. Check Apache/Nginx logs:

   ```bash
   tail -n 100 /var/log/apache2/error.log
   ```

3. Verify environment variables:

   ```bash
   cat apps/admin/.env
   ```

4. Test API directly:
   ```bash
   curl https://riyanshamrit.com/api/products
   ```

---

**Last Updated**: November 2025  
**Status**: Ready for Deployment ✅
