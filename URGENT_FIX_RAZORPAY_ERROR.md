# 🚨 URGENT FIX: Razorpay Configuration Error

## ❌ Current Error

**Error Message**: "Payment Failed because of a configuration error. Authentication key was missing during initialization."

**Cause**: The Razorpay API keys are not configured in the API server's `.env` file.

## ✅ Solution (Follow These Steps)

### Step 1: Get Your Razorpay Keys

1. Go to [https://razorpay.com/](https://razorpay.com/)
2. Login to your account (or sign up if you don't have one)
3. Go to **Settings** → **API Keys** (in the left sidebar)
4. Click **"Generate Test Keys"** (for testing)
5. You'll see:
   - **Key ID**: `rzp_test_xxxxxxxxxx` (copy this)
   - **Key Secret**: Click "Show" to reveal, then copy it

### Step 2: Update the .env File

1. Open the file: `apps/api/.env`
2. Replace the placeholder values with your actual keys:

```env
# Supabase Configuration
SUPABASE_URL=https://iwvrjjgjxxtlvvbdbytb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

# Razorpay Configuration (REPLACE THESE!)
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_KEY_SECRET

# Server Configuration
PORT=4000
```

### Step 3: Get Supabase Service Role Key

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **riyanshamrit106@gmail.com's Project**
3. Go to **Settings** → **API**
4. Find **"service_role" key** (under "Project API keys")
5. Click "Reveal" and copy it
6. Replace `YOUR_SERVICE_ROLE_KEY_HERE` in the `.env` file

### Step 4: Restart the API Server

```bash
# Stop the current API server (Ctrl+C in the terminal)

# Navigate to API directory
cd apps/api

# Start the server again
npm start
```

### Step 5: Test Again

1. Go to your website: http://localhost:3000
2. Add items to cart
3. Go to checkout
4. Fill in the form
5. Click "Proceed to Payment"
6. Razorpay modal should now open! ✅

## 🧪 Test Card Details

Once configured, use these test cards:

**Successful Payment**:

- Card Number: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: `12/25`
- Name: Any name

## 📝 Quick Copy-Paste Template

Create/edit `apps/api/.env` with this template:

```env
# Supabase Configuration
SUPABASE_URL=https://iwvrjjgjxxtlvvbdbytb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_SERVICE_ROLE_KEY

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET

# Server Configuration
PORT=4000
```

## ⚠️ Important Notes

1. **Never commit `.env` file to Git** - It contains sensitive keys
2. **Use Test Keys** for development (start with `rzp_test_`)
3. **Restart API server** after changing `.env` file
4. **Keep keys secure** - Don't share them publicly

## 🔍 Verify Configuration

After updating `.env`, verify the keys are loaded:

1. Open `apps/api/src/routes/orders.ts`
2. The Razorpay initialization should look like:

   ```typescript
   const razorpay = new Razorpay({
     key_id: process.env.RAZORPAY_KEY_ID || '',
     key_secret: process.env.RAZORPAY_KEY_SECRET || '',
   })
   ```

3. Check API server logs when it starts:
   - Should see: `🚀 API server running on http://localhost:4000`
   - Should NOT see any Razorpay initialization errors

## 🆘 Still Getting Error?

### Check 1: Verify .env file exists

```bash
cd apps/api
dir .env
```

### Check 2: Verify keys are not empty

Open `.env` and ensure:

- `RAZORPAY_KEY_ID` has a value starting with `rzp_test_`
- `RAZORPAY_KEY_SECRET` has a value (not empty)
- No extra spaces before or after the `=` sign

### Check 3: Restart API server

```bash
# Kill all node processes
taskkill /F /IM node.exe

# Start API server again
cd apps/api
npm start
```

### Check 4: Check browser console

1. Open DevTools (F12)
2. Go to Console tab
3. Look for any error messages
4. Check Network tab for failed API calls

## ✅ Success Indicators

You'll know it's working when:

1. ✅ No error popup appears
2. ✅ Razorpay payment modal opens
3. ✅ You can see payment options (Card, UPI, etc.)
4. ✅ Test payment completes successfully

## 📞 Need Help?

If you're still stuck:

1. Check the error in browser console (F12)
2. Check API server logs in terminal
3. Verify both keys are correct (no typos)
4. Make sure API server restarted after adding keys

---

**Next Step**: Add your Razorpay keys to `apps/api/.env` and restart the API server!
