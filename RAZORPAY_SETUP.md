# Quick Razorpay Setup Guide

## Step 1: Get Razorpay Test Keys

1. Go to [https://razorpay.com/](https://razorpay.com/)
2. Click "Sign Up" (or "Login" if you have an account)
3. Complete the registration process
4. After login, go to **Settings** → **API Keys** (in the left sidebar)
5. Click **Generate Test Keys**
6. You'll see:
   - **Key ID**: `rzp_test_xxxxxxxxxx`
   - **Key Secret**: Click "Show" to reveal, then copy

## Step 2: Add Keys to API Server

1. Navigate to `apps/api/` folder
2. Create a `.env` file (if it doesn't exist)
3. Add the following:

```env
# Supabase Configuration (keep existing values)
SUPABASE_URL=your_existing_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_existing_service_role_key

# Razorpay Configuration (add these)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Server Configuration
PORT=4000
```

4. Replace `rzp_test_xxxxxxxxxx` with your actual Key ID
5. Replace `your_razorpay_key_secret` with your actual Key Secret

## Step 3: Restart API Server

```bash
cd apps/api
npm start
```

## Step 4: Test Payment

1. Go to your website: `http://localhost:3000`
2. Add items to cart
3. Go to cart and click "Proceed to Checkout"
4. Fill in contact information and address
5. Click "Proceed to Payment"
6. Razorpay modal should open
7. Use test card details:

   - **Card Number**: `4111 1111 1111 1111`
   - **CVV**: `123`
   - **Expiry**: Any future date (e.g., `12/25`)
   - **Name**: Any name

8. Click "Pay" and payment should succeed!

## Important Notes

⚠️ **Never commit `.env` file to Git**

- The `.env` file contains sensitive keys
- It should be in `.gitignore`
- Share keys securely with team members

⚠️ **Test Mode vs Live Mode**

- Test keys start with `rzp_test_`
- No real money is charged in test mode
- Use test card numbers for testing
- Switch to live keys only after KYC verification

✅ **Security**

- `RAZORPAY_KEY_SECRET` should NEVER be exposed to frontend
- Only `RAZORPAY_KEY_ID` is safe to use in frontend
- All payment verification happens on the server

## Test Card Numbers

### Successful Payment

- `4111 1111 1111 1111` - Visa
- `5555 5555 5555 4444` - Mastercard
- `3782 822463 10005` - American Express

### Failed Payment

- `4000 0000 0000 0002` - Card declined

### Other Payment Methods

- **UPI**: Use `success@razorpay` for success
- **Netbanking**: Select any bank, credentials are auto-filled
- **Wallets**: Select any wallet, credentials are auto-filled

## Troubleshooting

### Payment modal not opening?

1. Check if `.env` file has correct keys
2. Restart API server after adding keys
3. Check browser console for errors
4. Verify API is running on port 4000

### "Invalid API Key" error?

1. Verify you copied the correct Key ID
2. Ensure there are no extra spaces
3. Check if you're using test keys (should start with `rzp_test_`)

### Payment verification fails?

1. Check if Key Secret is correct
2. Ensure Key Secret is not exposed to frontend
3. Check API logs for errors

## Going Live (Production)

When you're ready to accept real payments:

1. Complete KYC verification on Razorpay dashboard
2. Generate **Live Keys** (Settings → API Keys → Generate Live Keys)
3. Update `.env` with live keys:
   ```env
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_live_key_secret
   ```
4. Test thoroughly before going live
5. Monitor transactions in Razorpay dashboard

## Need Help?

- **Razorpay Docs**: [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **API Reference**: [https://razorpay.com/docs/api/](https://razorpay.com/docs/api/)
- **Support**: [https://razorpay.com/support/](https://razorpay.com/support/)
