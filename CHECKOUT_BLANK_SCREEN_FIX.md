# 🔧 Checkout Blank Screen Fix

## Problem Analysis

**Issue**: When clicking "Proceed to Checkout" button from cart, the checkout page shows a blank screen.

**Root Cause**:

1. **API URL Issue**: Line 284 in `checkout/page.tsx` was using empty string `''` in production

   ```typescript
   // BEFORE (WRONG):
   const apiUrl =
     process.env.NODE_ENV === 'production'
       ? ''
       : process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:4000'
   ```

   This causes requests to go to relative paths like `/api/orders/create-razorpay-order` which may not be properly routed.

2. **Error Handling**: If API call fails, errors might not be caught properly, causing React to crash and show blank screen.

3. **Response Validation**: Missing validation for response data before using it.

## Solution Applied

### Fix 1: Correct API URL Configuration

**File**: `apps/web/src/app/checkout/page.tsx` (line 284)

**Changed**:

```typescript
// BEFORE
const apiUrl =
  process.env.NODE_ENV === 'production'
    ? ''
    : process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:4000'

// AFTER
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://riyanshamrit.com' : 'http://0.0.0.0:4000')
```

**Why**:

- Uses `NEXT_PUBLIC_API_URL` if set (from environment variables)
- Falls back to production URL (`https://riyanshamrit.com`) in production
- Falls back to localhost in development
- Ensures API calls always go to the correct server

### Fix 2: Improved Error Handling

**Added**:

- Better error handling for failed API responses
- Response validation before parsing JSON
- Validation of response data before using it

**Why**:

- Prevents blank screens from uncaught errors
- Provides better error messages to users
- Handles network errors gracefully

## Expected Behavior After Fix

✅ Checkout page loads correctly
✅ API calls go to `https://riyanshamrit.com/api/orders/create-razorpay-order`
✅ If API call fails, error is shown to user (not blank screen)
✅ Razorpay payment modal opens correctly
✅ Payment verification works

## Deployment

### Step 1: Update Environment Variables

Ensure `NEXT_PUBLIC_API_URL` is set correctly:

**On Server** (`apps/web/.env.local`):

```bash
NEXT_PUBLIC_API_URL=https://riyanshamrit.com
```

### Step 2: Rebuild Web App

```bash
cd apps/web
npm run build
```

### Step 3: Restart Next.js

```bash
pm2 restart riyansh-web
```

Or if using the deployment script:

```bash
cd /home/1542906.cloudwaysapps.com/awxrfzsrma/public_html
./DEPLOY_FIX.sh
```

## Verification

After deployment:

1. **Add product to cart**

   - Visit: `https://riyanshamrit.com/store`
   - Add product to cart

2. **Go to checkout**

   - Click "Proceed to Checkout" from cart
   - ✅ Should see checkout form (not blank screen)

3. **Check browser console**

   - ✅ Should see: `POST https://riyanshamrit.com/api/orders/create-razorpay-order`
   - ❌ Should NOT see: Errors or blank page

4. **Complete checkout**
   - Fill in contact and address information
   - Click "Proceed to Payment"
   - ✅ Razorpay modal should open

## Technical Details

### How Next.js Environment Variables Work

- `NEXT_PUBLIC_*` variables are available in browser code
- Must be set before build (not runtime)
- Used at build time and bundled into JavaScript

### API URL Resolution Order

1. Check `process.env.NEXT_PUBLIC_API_URL` (set in `.env.local`)
2. If production: use `https://riyanshamrit.com`
3. If development: use `http://0.0.0.0:4000`

This ensures correct API URL in all environments.

## Related Issues

- **Admin Panel Login**: Similar API URL issue (fixed separately)
- **Admin Dashboard**: Same API URL issue (fixed separately)

All three issues stem from hardcoded localhost/empty string fallbacks that need proper production URLs.

---

**Status**: Fixed ✅ | Needs deployment ⚠️

**Files Modified**:

- `apps/web/src/app/checkout/page.tsx`

**Next**: Rebuild web app and deploy
