# Checkout Page Implementation

## Overview

Implemented a beautiful and aesthetic checkout page with contact information collection, address management, and Razorpay payment gateway integration preparation.

## Changes Made

### 1. Database Migration

**File**: Migration applied to Supabase

- Added `phone` column to `user_addresses` table to store phone numbers with addresses

```sql
ALTER TABLE user_addresses
ADD COLUMN IF NOT EXISTS phone text;
```

### 2. Cart Page Updates

**File**: `apps/web/src/app/cart/page.tsx`

**Changes**:

- Simplified the cart page by removing address selection UI
- Modified checkout button to redirect to `/checkout` page instead of directly placing order
- Removed unused `Address` interface and `addresses` state
- Removed `fetchAddresses()` function
- Updated button text to "Proceed to Checkout"

**Key Code**:

```typescript
const handleCheckout = () => {
  if (cartItems.length === 0) {
    alert('Your cart is empty')
    return
  }
  // Redirect to checkout page
  router.push('/checkout')
}
```

### 3. New Checkout Page

**File**: `apps/web/src/app/checkout/page.tsx`

**Features**:

1. **Contact Information Section**

   - Auto-fills full name and email from user profile
   - Phone number field (required)
   - All fields are editable

2. **Address Management**

   - Displays saved addresses if available
   - Allows selection from multiple saved addresses
   - Shows default address badge
   - Option to add new address
   - Auto-selects default address or first available address

3. **Address Form**

   - Complete address fields (Address Line 1, Address Line 2, Street, City, State, ZIP)
   - All address fields are required except Address Line 2
   - Phone number is stored with the address

4. **Order Summary Sidebar**

   - Displays all cart items with images
   - Shows quantity badges
   - Calculates subtotal, shipping (free), and total
   - Sticky sidebar for easy access

5. **Beautiful UI Design**
   - Gradient backgrounds and headers
   - Icon-enhanced labels
   - Smooth transitions and hover effects
   - Responsive design (mobile-friendly)
   - Color scheme: Green (#8BC34A) theme
   - Card-based layout with shadows and borders

**Key Functionality**:

- Auto-fills user data (name, email) from profile
- Auto-fills address data when selecting saved address
- Creates new address if needed or updates existing with phone
- Validates all required fields before submission
- Integrates with API to create order
- Prepared for Razorpay payment gateway integration

**Form Validation**:

```typescript
// Validates required fields
if (!formData.full_name || !formData.email || !formData.phone) {
  alert('Please fill in all required contact information')
  return
}

if (
  !formData.address_line_1 ||
  !formData.street_address ||
  !formData.city ||
  !formData.state ||
  !formData.zip_code
) {
  alert('Please fill in complete address information')
  return
}
```

**Address Handling**:

```typescript
// Creates new address with phone or updates existing
if (!addressId || showAddressForm) {
  // Create new address with phone
  const { data: newAddress, error: addressError } = await supabase
    .from('user_addresses')
    .insert({
      user_id: session.user.id,
      ...formData,
      phone: formData.phone,
      is_default: addresses.length === 0,
    })
    .select()
    .single()
} else {
  // Update existing address with phone
  await supabase.from('user_addresses').update({ phone: formData.phone }).eq('id', addressId)
}
```

## UI Components Used

- `Button` - For actions and submissions
- `Input` - For form fields
- `Label` - For field labels
- Lucide React Icons:
  - `ShoppingBag` - Cart/product icons
  - `MapPin` - Address icons
  - `User` - User/name icons
  - `Mail` - Email icons
  - `Phone` - Phone icons
  - `CreditCard` - Payment icons
  - `ChevronRight` - Navigation arrow

## Design Highlights

### Color Palette

- Primary: `#8BC34A` (Light Green)
- Primary Hover: `#7CB342` (Darker Green)
- Background: Gradient from gray-50 to white
- Text: Gray-900 (dark), Gray-600 (medium)

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Checkout Header                       │
├──────────────────────────────────┬──────────────────────┤
│  Contact Information Card        │   Order Summary      │
│  (with gradient header)          │   (sticky sidebar)   │
├──────────────────────────────────┤                      │
│  Saved Addresses Selection       │   - Cart Items       │
│  (radio buttons with cards)      │   - Subtotal         │
├──────────────────────────────────┤   - Shipping         │
│  Address Form                    │   - Total            │
│  (if new address or no saved)    │   - Payment Button   │
└──────────────────────────────────┴──────────────────────┘
```

### Responsive Design

- Desktop: 2-column layout (form + sidebar)
- Mobile: Single column, stacked layout
- Sticky sidebar on desktop for easy access

## Payment Gateway Integration (Next Steps)

The checkout page is prepared for Razorpay integration. To complete:

1. **Add Razorpay Script**

   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```

2. **Initialize Razorpay Payment**

   ```typescript
   const options = {
     key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
     amount: calculateTotal() * 100, // Amount in paise
     currency: 'INR',
     name: 'Your Store Name',
     description: 'Order Payment',
     order_id: data.razorpay_order_id,
     handler: function (response) {
       // Handle successful payment
     },
     prefill: {
       name: formData.full_name,
       email: formData.email,
       contact: formData.phone,
     },
   }
   const razorpay = new Razorpay(options)
   razorpay.open()
   ```

3. **Backend Integration**
   - Create Razorpay order in API
   - Verify payment signature
   - Update order status

## Testing Checklist

- [x] Database migration applied successfully
- [x] Cart page redirects to checkout
- [x] Checkout page loads without errors
- [x] Contact information auto-fills from profile
- [x] Saved addresses display correctly
- [x] Address selection works
- [x] New address form works
- [x] Phone number is required and stored
- [x] Order summary displays correctly
- [x] Form validation works
- [ ] Order creation via API (requires testing)
- [ ] Razorpay payment integration (pending)

## User Flow

1. User adds items to cart
2. User clicks "Proceed to Checkout" on cart page
3. User is redirected to `/checkout` page
4. Contact information is auto-filled (name, email)
5. User enters phone number (required)
6. User selects saved address OR enters new address
7. User reviews order summary
8. User clicks "Proceed to Payment"
9. Order is created in database
10. User is redirected to Razorpay payment gateway
11. After payment, user is redirected to order confirmation

## Files Modified/Created

### Modified

- `apps/web/src/app/cart/page.tsx` - Simplified and added redirect to checkout

### Created

- `apps/web/src/app/checkout/page.tsx` - New checkout page with all features

### Database

- Migration: Added `phone` column to `user_addresses` table

## Notes

- Phone number is now stored with addresses for delivery contact
- All existing addresses will have `null` phone initially
- Users can update phone when checking out
- The checkout page is fully responsive and mobile-friendly
- Beautiful gradient design with smooth animations
- Ready for Razorpay integration (placeholder code included)
