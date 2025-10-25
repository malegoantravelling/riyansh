# Razorpay Payment Gateway Integration

## Overview

Successfully integrated Razorpay payment gateway into the checkout flow. When users click "Proceed to Payment", a Razorpay payment modal opens on the same page instead of redirecting.

## Changes Made

### 1. Database Migration

**Migration**: `add_razorpay_columns_to_orders`

Added columns to track Razorpay payment information:

```sql
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS razorpay_order_id text,
ADD COLUMN IF NOT EXISTS razorpay_payment_id text,
ADD COLUMN IF NOT EXISTS razorpay_signature text,
ADD COLUMN IF NOT EXISTS paid_at timestamp with time zone;
```

### 2. API Backend Changes

#### Installed Razorpay SDK

```bash
npm install razorpay
```

#### File: `apps/api/src/routes/orders.ts`

**Added Imports**:

```typescript
import Razorpay from 'razorpay'
import crypto from 'crypto'
```

**Initialized Razorpay**:

```typescript
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
})
```

**New Endpoints**:

1. **POST `/api/orders/create-razorpay-order`** - Creates order and Razorpay payment order

   - Validates cart items
   - Creates order in database with `pending` status
   - Creates order items
   - Creates Razorpay order
   - Returns Razorpay order details and key_id for frontend

2. **POST `/api/orders/verify-payment`** - Verifies payment after successful transaction
   - Verifies Razorpay signature using HMAC SHA256
   - Updates order status to `paid`
   - Stores payment details
   - Clears user's cart
   - Returns success response

**Key Code**:

```typescript
// Create Razorpay order
const razorpayOrder = await razorpay.orders.create({
  amount: Math.round(totalAmount * 100), // Amount in paise
  currency: 'INR',
  receipt: order.id,
  notes: {
    order_id: order.id,
    user_id: userId,
  },
})

// Verify payment signature
const body = razorpay_order_id + '|' + razorpay_payment_id
const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
  .update(body.toString())
  .digest('hex')

const isAuthentic = expectedSignature === razorpay_signature
```

### 3. Frontend Changes

#### File: `apps/web/src/app/layout.tsx`

Added Razorpay SDK script to the layout:

```typescript
<head>
  <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
</head>
```

#### File: `apps/web/src/app/checkout/page.tsx`

**Modified `handleSubmit` Function**:

1. **Validates form data** (contact info and address)
2. **Creates/updates address** with phone number
3. **Calls API** to create Razorpay order
4. **Opens Razorpay modal** with payment options
5. **Handles payment success** by verifying payment
6. **Handles payment failure** with error messages
7. **Handles modal dismissal** (user cancels payment)

**Razorpay Configuration**:

```typescript
const options = {
  key: data.key_id,
  amount: data.amount * 100, // Amount in paise
  currency: data.currency,
  name: 'RIYANSH',
  description: 'Order Payment',
  order_id: data.razorpay_order_id,
  handler: async function (response: any) {
    // Verify payment on success
    const verifyResponse = await fetch(`${API_URL}/api/orders/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        order_id: data.order_id,
      }),
    })
    // Handle verification response
  },
  prefill: {
    name: formData.full_name,
    email: formData.email,
    contact: formData.phone,
  },
  theme: {
    color: '#8BC34A', // Brand color
  },
  modal: {
    ondismiss: function () {
      setSubmitting(false)
      alert('Payment cancelled. Your order is saved and you can complete payment later.')
    },
  },
}

const razorpay = new (window as any).Razorpay(options)
razorpay.open()
```

## Environment Variables Required

### API Server (`.env` file in `apps/api/`)

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
```

### Frontend (`.env.local` file in `apps/web/`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## How to Get Razorpay Keys

1. **Sign up** at [https://razorpay.com/](https://razorpay.com/)
2. **Login** to Razorpay Dashboard
3. Go to **Settings** → **API Keys**
4. Generate **Test Keys** for development
5. Copy **Key ID** and **Key Secret**
6. Add them to your `.env` file

**Test Mode Keys**:

- Start with `rzp_test_`
- Use test card numbers for testing
- No real money is charged

**Live Mode Keys**:

- Start with `rzp_live_`
- Requires KYC verification
- Real transactions

## Payment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User clicks "Proceed to Payment"          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Frontend validates form data (contact info + address)       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Frontend creates/updates address in Supabase               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Frontend calls API: POST /api/orders/create-razorpay-order │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  API creates order in database (status: pending)            │
│  API creates order items                                     │
│  API creates Razorpay order                                  │
│  API returns: order_id, razorpay_order_id, amount, key_id   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Frontend opens Razorpay payment modal                       │
│  User selects payment method (Card/UPI/Netbanking/Wallet)   │
│  User completes payment                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Razorpay returns: razorpay_payment_id, razorpay_signature  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Frontend calls API: POST /api/orders/verify-payment        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  API verifies payment signature (HMAC SHA256)                │
│  API updates order status to "paid"                          │
│  API stores payment details                                  │
│  API clears user's cart                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Frontend shows success message                              │
│  Frontend redirects to /account/orders                       │
└─────────────────────────────────────────────────────────────┘
```

## Testing

### Test Card Details (Razorpay Test Mode)

**Successful Payment**:

- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Failed Payment**:

- Card Number: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Other Test Methods**:

- **UPI**: Use `success@razorpay` for success
- **Netbanking**: Select any bank, use test credentials
- **Wallet**: Select any wallet, use test credentials

## Security Features

1. **Payment Signature Verification**

   - Uses HMAC SHA256 to verify payment authenticity
   - Prevents payment tampering

2. **Server-side Validation**

   - All payment verification happens on the server
   - Frontend cannot manipulate payment status

3. **Authentication Required**

   - All endpoints require valid JWT token
   - User can only access their own orders

4. **Order Status Tracking**
   - Orders start as `pending`
   - Only verified payments update to `paid`
   - Failed payments remain `pending`

## Error Handling

### Frontend Errors

- **Cart is empty**: Alert shown, prevents checkout
- **Invalid form data**: Alert shown with specific field
- **Razorpay SDK not loaded**: Alert with refresh instruction
- **Payment failed**: Alert with error description
- **Payment cancelled**: Alert informing order is saved
- **Verification failed**: Alert with error message

### Backend Errors

- **Empty cart**: Returns 400 error
- **Invalid signature**: Returns 400 error
- **Database errors**: Returns 400/500 with error message
- **Razorpay API errors**: Logged and returned as 500

## Order Status Flow

```
pending → (payment successful) → paid
   ↓
   └─→ (payment failed) → pending (can retry payment)
```

## Features

✅ **Modal Payment**: Payment happens in a modal, no page redirect
✅ **Multiple Payment Methods**: Card, UPI, Netbanking, Wallets
✅ **Auto-fill Contact Info**: Name, email, phone pre-filled
✅ **Secure Verification**: HMAC SHA256 signature verification
✅ **Order Tracking**: All orders tracked with Razorpay IDs
✅ **Cart Management**: Cart cleared only after successful payment
✅ **Error Handling**: Comprehensive error messages
✅ **Test Mode**: Easy testing with test cards
✅ **Responsive**: Works on mobile and desktop

## Next Steps

1. **Add Razorpay Keys**: Add your Razorpay test keys to `.env` file
2. **Test Payment Flow**: Use test cards to complete a payment
3. **Switch to Live Mode**:
   - Complete KYC on Razorpay
   - Generate live keys
   - Update `.env` with live keys
4. **Add Webhooks** (Optional):
   - Configure Razorpay webhooks for payment notifications
   - Handle payment failures and refunds
5. **Add Order Confirmation Email** (Optional):
   - Send email after successful payment
   - Include order details and invoice

## Troubleshooting

### "Razorpay SDK not loaded"

- Check if script is loaded in layout
- Refresh the page
- Check browser console for script errors

### "Invalid payment signature"

- Check if `RAZORPAY_KEY_SECRET` is correct
- Ensure secret is not exposed to frontend
- Verify signature generation logic

### Payment modal not opening

- Check if Razorpay keys are set
- Check browser console for errors
- Verify API response contains `razorpay_order_id`

### Cart not clearing after payment

- Check payment verification response
- Verify order status is updated to `paid`
- Check API logs for errors

## Files Modified/Created

### Modified

- `apps/api/src/routes/orders.ts` - Added Razorpay endpoints
- `apps/web/src/app/layout.tsx` - Added Razorpay script
- `apps/web/src/app/checkout/page.tsx` - Integrated Razorpay payment

### Database

- Migration: Added Razorpay tracking columns to `orders` table

### Dependencies

- `razorpay` - Razorpay Node.js SDK (API)

## Support

For Razorpay integration issues:

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
- [Razorpay Support](https://razorpay.com/support/)

For application issues:

- Check API logs: `npm start` output in `apps/api/`
- Check browser console for frontend errors
- Verify environment variables are set correctly
