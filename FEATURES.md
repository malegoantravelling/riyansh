# Riyansh E-Commerce - Features Documentation

## 🎨 Design System

### Color Palette

- **Background**: `#FFFFFF` - Clean white background
- **Text**: `#333333` - Primary text color
- **Primary/CTA**: `#8BC34A` - Green accent for buttons and highlights
- **Section Background**: `#A5D6A7` - Light green for alternating sections
- **Borders**: `#CCCCCC` to `#EEEEEE` - Subtle borders
- **Accent**: `#FF69B4` - Pink for special elements (hearts, favorites)

### Typography

- Modern, clean sans-serif font stack
- Clear hierarchy with proper spacing
- Responsive text sizes

## 🌐 Customer-Facing Website (Port 3000)

### Pages

#### 1. Home Page (`/`)

- **Hero Section**: Large banner with CTA button
- **Features Section**: 3 feature cards (Free Delivery, New Medicine, Packing Guaranteed)
- **Featured Products**: Grid of 4 featured products
- **Newsletter Section**: Email signup with gradient background
- **Testimonials**: Customer reviews section
- **Why Us**: 3 numbered benefits

#### 2. Store/Shop Page (`/store`)

- **Product Grid**: Responsive product cards
- **Sidebar Filter**: Price range slider
- **Sorting Options**: Default, Price, Newest
- **Pagination**: Navigate through product pages
- **Category Filter**: Filter by product categories

#### 3. Product Detail Page (`/products/[slug]`)

- Product image gallery
- Product information
- Add to cart functionality
- Quantity selector
- Favorite/wishlist button
- Related products section

#### 4. About Page (`/about`)

- **Hero Section**: About the company
- **Info Sections**: Why Us, History, Awards
- **Leadership Team**: Team member cards with photos
- **Newsletter Signup**
- **Company Stats**

#### 5. Contact Page (`/contact`)

- **Contact Form**: First name, last name, email, subject, message
- **Office Locations**: 3 office cards (New York, London, Canada)
- **Contact Information**: Address, phone, email with icons

#### 6. Cart Page (`/cart`)

- **Cart Table**: Image, product name, price, quantity, total, remove
- **Quantity Controls**: Plus/minus buttons
- **Update Cart**: Refresh cart items
- **Coupon Code**: Apply discount codes
- **Cart Totals**: Subtotal and total
- **Checkout Button**: Proceed to payment

#### 7. Authentication

- **Login Page** (`/auth/login`): Email and password
- **Signup Page** (`/auth/signup`): Full name, email, password
- **No email verification required**

### Components

#### Navigation Bar

- Logo/Brand name
- Menu links (Home, Store, About, Contact)
- Search icon
- Shopping cart with item count badge
- User login/account button

#### Footer

- About section
- Navigation links
- Contact information
- Social media (optional)
- Copyright notice

#### Product Card

- Product image
- Product name
- Price (with compare-at price if available)
- Hover effects
- Link to product detail

### User Features

- Browse products by category
- Search products
- Add to cart
- View cart and update quantities
- User registration and login
- Place orders
- View order history (future)

## 🔐 Admin Panel (Port 3001)

### Left Sidebar Navigation

- **Dashboard**: Overview and statistics
- **Products**: Manage products
- **Categories**: Manage categories
- **Orders**: View and manage orders
- **Users**: View registered users
- **Logout**: Sign out

### Pages

#### 1. Dashboard (`/`)

- **Statistics Cards**:
  - Total Products
  - Total Orders
  - Total Users
  - Total Revenue
- **Recent Orders**: List of latest orders
- **Quick Actions**: Shortcuts to common tasks

#### 2. Products (`/products`)

- **Product List**: Table view with all products
- **Add Product**: Form to create new products
  - Name, slug, description
  - Price, compare-at price
  - Category selection
  - Image URL
  - Stock quantity
  - Featured toggle
  - Active/inactive status
- **Edit Product**: Update existing products
- **Delete Product**: Remove products
- **Product Columns**:
  - Name
  - Category
  - Price
  - Stock
  - Status (Active/Inactive)
  - Actions (Edit, Delete)

#### 3. Categories (`/categories`)

- **Category Grid**: Card view of categories
- **Add Category**: Form to create categories
  - Name
  - Slug
  - Description
  - Image URL
- **Edit Category**: Update categories
- **Delete Category**: Remove categories

#### 4. Orders (`/orders`)

- **Order List**: Table view of all orders
- **Order Details**:
  - Order ID
  - Customer email
  - Total amount
  - Status
  - Date
- **Status Management**: Update order status
  - Pending
  - Processing
  - Shipped
  - Delivered
  - Cancelled
- **Status Color Coding**: Visual indicators

#### 5. Users (`/users`)

- **User List**: Table of registered users
- **User Information**:
  - Full name
  - Email
  - Phone
  - Join date

### Admin Authentication

- **Hardcoded Login**: `admin` / `admin123`
- **Token-based session**: Stored in localStorage
- **Protected routes**: Redirect to login if not authenticated

### Admin UI Features

- Clean, modern design
- Responsive layout
- Fixed left sidebar
- Color-coded status badges
- Inline editing where applicable
- Confirmation dialogs for destructive actions

## 🔌 API Backend (Port 4000)

### Authentication Endpoints

#### POST `/api/auth/signup`

Register new user

```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

#### POST `/api/auth/login`

User login

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/logout`

User logout

#### POST `/api/auth/admin/login`

Admin login (hardcoded)

```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Product Endpoints

#### GET `/api/products`

Get all products

- Query params: `category`, `featured`, `search`, `limit`, `offset`

#### GET `/api/products/:id`

Get single product by ID

#### GET `/api/products/slug/:slug`

Get product by slug

#### POST `/api/products`

Create new product (admin)

#### PUT `/api/products/:id`

Update product (admin)

#### DELETE `/api/products/:id`

Delete product (admin)

### Category Endpoints

#### GET `/api/categories`

Get all categories

#### GET `/api/categories/:id`

Get single category

#### POST `/api/categories`

Create category (admin)

#### PUT `/api/categories/:id`

Update category (admin)

#### DELETE `/api/categories/:id`

Delete category (admin)

### Cart Endpoints (Authenticated)

#### GET `/api/cart`

Get user's cart items

#### POST `/api/cart`

Add item to cart

```json
{
  "product_id": "uuid",
  "quantity": 1
}
```

#### PUT `/api/cart/:id`

Update cart item quantity

#### DELETE `/api/cart/:id`

Remove item from cart

#### DELETE `/api/cart`

Clear entire cart

### Order Endpoints (Authenticated)

#### GET `/api/orders`

Get user's orders

#### GET `/api/orders/all`

Get all orders (admin)

#### GET `/api/orders/:id`

Get single order

#### POST `/api/orders`

Create new order from cart

```json
{
  "shipping_address": {},
  "billing_address": {},
  "notes": "Optional notes"
}
```

#### PUT `/api/orders/:id`

Update order status (admin)

### User Endpoints (Authenticated)

#### GET `/api/users`

Get all users (admin)

#### GET `/api/users/me`

Get current user profile

#### PUT `/api/users/me`

Update user profile

## 🗄️ Database Schema

### Tables

#### `users`

- id (UUID, PK)
- email (TEXT, UNIQUE)
- full_name (TEXT)
- phone (TEXT)
- avatar_url (TEXT)
- created_at, updated_at

#### `categories`

- id (UUID, PK)
- name (TEXT)
- slug (TEXT, UNIQUE)
- description (TEXT)
- image_url (TEXT)
- created_at, updated_at

#### `products`

- id (UUID, PK)
- name (TEXT)
- slug (TEXT, UNIQUE)
- description (TEXT)
- price (DECIMAL)
- compare_at_price (DECIMAL)
- category_id (UUID, FK)
- image_url (TEXT)
- images (TEXT[])
- stock_quantity (INTEGER)
- is_featured (BOOLEAN)
- is_active (BOOLEAN)
- created_at, updated_at

#### `cart_items`

- id (UUID, PK)
- user_id (UUID, FK)
- product_id (UUID, FK)
- quantity (INTEGER)
- created_at, updated_at

#### `orders`

- id (UUID, PK)
- user_id (UUID, FK)
- total_amount (DECIMAL)
- status (TEXT)
- shipping_address (JSONB)
- billing_address (JSONB)
- notes (TEXT)
- created_at, updated_at

#### `order_items`

- id (UUID, PK)
- order_id (UUID, FK)
- product_id (UUID, FK)
- product_name (TEXT)
- product_image (TEXT)
- quantity (INTEGER)
- price (DECIMAL)
- created_at

### Row Level Security (RLS)

- Users can only access their own data
- Public read access for products and categories
- Order and cart data is user-specific
- Admin operations bypass RLS using service role key

### Storage Buckets

#### `product-images`

- Public bucket for product images
- Accessible via Supabase CDN
- Organized by product ID or custom names

## 🔧 Technology Stack

### Frontend (Web)

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **State**: React Hooks
- **Auth**: Supabase Auth

### Frontend (Admin)

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + JWT

### Shared Packages

- **TypeScript**: Type safety across the monorepo
- **Utility Functions**: Shared helpers
- **UI Components**: Reusable components
- **Database Types**: Type definitions

## 📱 Responsive Design

All pages are fully responsive:

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

Features:

- Flexible grid layouts
- Collapsible navigation
- Touch-friendly buttons
- Optimized images
- Readable typography

## 🎯 Best Practices Implemented

1. **Type Safety**: TypeScript throughout
2. **Component Reusability**: Shared UI components
3. **Clean Code**: ESLint + Prettier
4. **Security**: Environment variables, RLS policies
5. **Performance**: Lazy loading, optimized images
6. **Accessibility**: Semantic HTML, ARIA labels
7. **SEO**: Meta tags, proper heading hierarchy
8. **User Experience**: Loading states, error handling

## 🚀 Future Enhancements

Potential features to add:

- Payment gateway integration (Stripe/PayPal)
- Email notifications (order confirmations)
- Product reviews and ratings
- Wishlist/Favorites functionality
- Advanced search and filters
- Inventory management
- Discount codes and promotions
- Multi-currency support
- Shipping integration
- Analytics dashboard
- Customer support chat
