# 🔧 Environment Setup Guide

## 🚨 **CRITICAL: This is why your payment is failing!**

The error **"Authentication key was missing during initialization"** means:

- The API server doesn't have Razorpay keys configured
- The `.env` file is missing or has placeholder values

## 📋 **Step-by-Step Fix**

### 1️⃣ Create the .env File

Navigate to `apps/api/` and create a file named `.env` (if it doesn't exist):

**Location**: `D:\Github\riyansh\apps\api\.env`

**Contents**:

```env
# Supabase Configuration
SUPABASE_URL=https://iwvrjjgjxxtlvvbdbytb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

# Razorpay Configuration
RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET_HERE

# Server Configuration
PORT=4000
```

### 2️⃣ Get Supabase Service Role Key

1. Go to: https://supabase.com/dashboard/project/iwvrjjgjxxtlvvbdbytb/settings/api
2. Find the **"service_role"** key (under "Project API keys")
3. Click **"Reveal"** to show the key
4. Copy the entire key
5. Replace `YOUR_SERVICE_ROLE_KEY_HERE` in `.env`

**It should look like**:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```

### 3️⃣ Get Razorpay Keys

#### Option A: If you already have a Razorpay account

1. Go to: https://dashboard.razorpay.com/app/keys
2. Login to your account
3. Click **"Generate Test Keys"** (if not already generated)
4. Copy both:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (click "Show" to reveal)

#### Option B: If you DON'T have a Razorpay account

1. Go to: https://razorpay.com/
2. Click **"Sign Up"**
3. Fill in your details:
   - Email
   - Password
   - Business name (can be anything for testing)
4. Verify your email
5. After login, go to **Settings** → **API Keys**
6. Click **"Generate Test Keys"**
7. Copy both keys

### 4️⃣ Update the .env File

Replace the placeholders in `apps/api/.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://iwvrjjgjxxtlvvbdbytb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_KEY...

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_AbCdEfGhIjKlMn
RAZORPAY_KEY_SECRET=YourActualSecretKeyHere123456

# Server Configuration
PORT=4000
```

### 5️⃣ Restart the API Server

**IMPORTANT**: You MUST restart the server after changing `.env`

```bash
# Stop the current server (press Ctrl+C in the terminal where it's running)

# Navigate to API directory
cd apps/api

# Start the server again
npm start
```

**Expected output**:

```
🚀 API server running on http://localhost:4000
```

### 6️⃣ Test the Payment

1. Go to: http://localhost:3000
2. Add items to cart
3. Go to checkout
4. Fill in contact info and address
5. Click **"Proceed to Payment"**
6. ✅ Razorpay modal should now open (no error!)

## 🧪 Test Card Details

Use these test cards once Razorpay is configured:

**Successful Payment**:

```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
Name: Test User
```

**Failed Payment** (to test error handling):

```
Card Number: 4000 0000 0000 0002
CVV: 123
Expiry: 12/25
Name: Test User
```

## ✅ Verification Checklist

Before testing, verify:

- [ ] `.env` file exists in `apps/api/`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is filled (not placeholder)
- [ ] `RAZORPAY_KEY_ID` starts with `rzp_test_`
- [ ] `RAZORPAY_KEY_SECRET` is filled (not placeholder)
- [ ] No extra spaces in the `.env` file
- [ ] API server was restarted after adding keys
- [ ] API server is running (check terminal output)

## 🔍 Troubleshooting

### Error: "Authentication key was missing"

**Cause**: Razorpay keys not configured or API server not restarted

**Fix**:

1. Check `.env` file has actual keys (not placeholders)
2. Restart API server
3. Clear browser cache and refresh

### Error: "Invalid API Key"

**Cause**: Wrong Razorpay key or typo

**Fix**:

1. Verify you copied the correct key from Razorpay dashboard
2. Check for extra spaces or line breaks
3. Ensure key starts with `rzp_test_` for test mode

### Error: "Database error"

**Cause**: Supabase service role key is wrong

**Fix**:

1. Go to Supabase dashboard
2. Copy the service_role key again
3. Update `.env` file
4. Restart API server

### Payment modal doesn't open

**Cause**: Multiple possible issues

**Fix**:

1. Open browser console (F12)
2. Look for error messages
3. Check Network tab for failed API calls
4. Verify API server is running

## 📝 Quick Command Reference

```bash
# Navigate to API directory
cd D:\Github\riyansh\apps\api

# Check if .env exists
dir .env

# Edit .env file (use any text editor)
notepad .env

# Restart API server
npm start

# Check if server is running
# Should see: 🚀 API server running on http://localhost:4000
```

## ⚠️ Security Notes

1. **NEVER commit `.env` to Git**

   - It's already in `.gitignore`
   - Contains sensitive keys

2. **Use Test Keys for Development**

   - Test keys start with `rzp_test_`
   - No real money is charged

3. **Keep Keys Secure**
   - Don't share in screenshots
   - Don't post in public forums
   - Don't commit to GitHub

## 🎯 Summary

**The error happens because**:

- API server needs Razorpay keys to create payment orders
- Without keys, it can't return `key_id` to the frontend
- Frontend Razorpay SDK fails without `key_id`

**The fix is simple**:

1. Add Razorpay keys to `apps/api/.env`
2. Restart API server
3. Test payment again

---

**After following these steps, your payment should work perfectly!** 🎉
