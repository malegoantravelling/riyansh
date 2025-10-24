# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     RIYANSH E-COMMERCE                      │
│                   Full-Stack Architecture                    │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐        ┌──────────────────┐
│   Customer Web   │        │   Admin Panel    │
│   (Port 3000)    │        │   (Port 3001)    │
│                  │        │                  │
│   Next.js 14     │        │   React + Vite   │
│   App Router     │        │   React Router   │
│   Tailwind CSS   │        │   Tailwind CSS   │
└────────┬─────────┘        └────────┬─────────┘
         │                           │
         │    HTTP/REST API          │
         └───────────┬───────────────┘
                     │
         ┌───────────▼────────────┐
         │    Express.js API      │
         │    (Port 4000)         │
         │                        │
         │   Authentication       │
         │   Business Logic       │
         │   Data Validation      │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │   Supabase Backend     │
         │                        │
         │   PostgreSQL DB        │
         │   Authentication       │
         │   Storage (Images)     │
         │   Row Level Security   │
         └────────────────────────┘
```

## Request Flow

### Customer Website Flow

```
User Action → Next.js Page → API Call → Express API → Supabase → Response

Example: Adding to Cart
1. User clicks "Add to Cart" button
2. Next.js component calls api.post('/api/cart', data)
3. Express API receives request
4. Validates authentication token
5. Queries Supabase database
6. Returns cart data
7. Next.js updates UI
```

### Admin Panel Flow

```
Admin Action → React Component → API Call → Express API → Supabase → Response

Example: Creating Product
1. Admin fills product form
2. React submits to api.post('/api/products', data)
3. Express API validates admin token
4. Inserts product into Supabase
5. Returns created product
6. React updates product list
```

## Data Models

### User Flow

```
┌─────────────┐
│   Sign Up   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────┐
│ Supabase    │────▶│ users table  │
│ Auth        │     │ (profile)    │
└──────┬──────┘     └──────────────┘
       │
       ▼
┌─────────────┐
│  JWT Token  │
└─────────────┘
```

### Product Flow

```
┌──────────────┐
│ Admin Panel  │
│ Product Form │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌────────────────┐
│  Express API │────▶│ products table │
│  Validation  │     │ + category FK  │
└──────┬───────┘     └────────────────┘
       │
       ▼
┌──────────────┐
│ Customer Web │
│ Product List │
└──────────────┘
```

### Order Flow

```
┌──────────────┐
│  Cart Items  │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌───────────────┐
│   Checkout   │────▶│ orders table  │
│   Process    │     │ + order_items │
└──────┬───────┘     └───────────────┘
       │
       ▼
┌──────────────┐
│ Admin Panel  │
│ Order Mgmt   │
└──────────────┘
```

## Database Schema Relationships

```
┌──────────────┐
│    users     │
│ (auth.users) │
└──────┬───────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌────────────┐  ┌──────────┐
│ cart_items │  │  orders  │
└─────┬──────┘  └────┬─────┘
      │              │
      │              ▼
      │       ┌─────────────┐
      │       │ order_items │
      │       └──────┬──────┘
      │              │
      ▼              ▼
┌────────────────────────┐
│      products          │
└───────────┬────────────┘
            │
            ▼
   ┌────────────────┐
   │   categories   │
   └────────────────┘
```

## Authentication Flow

### Customer Authentication

```
1. Sign Up/Login
   ├─→ Supabase Auth
   └─→ Returns JWT token

2. API Requests
   ├─→ Include token in Authorization header
   ├─→ Express middleware validates token
   └─→ Supabase verifies user

3. Protected Routes
   ├─→ Check token existence
   └─→ Redirect to login if invalid
```

### Admin Authentication

```
1. Admin Login
   ├─→ Hardcoded credentials check
   └─→ Returns simple token

2. Admin Routes
   ├─→ Check token in localStorage
   └─→ Validate on protected pages

3. API Calls
   ├─→ Include token in requests
   └─→ Backend validates admin status
```

## Component Architecture

### Web App Component Tree

```
App
├── Layout
│   ├── Navbar
│   │   ├── Search
│   │   ├── Cart Icon (+ count badge)
│   │   └── User Menu
│   ├── [Page Content]
│   │   ├── Home
│   │   │   ├── Hero Section
│   │   │   ├── Features Grid
│   │   │   ├── Product Grid
│   │   │   │   └── ProductCard (×4)
│   │   │   ├── Newsletter
│   │   │   └── Testimonials
│   │   ├── Store
│   │   │   ├── Filters Sidebar
│   │   │   └── Product Grid
│   │   │       └── ProductCard (×N)
│   │   ├── Cart
│   │   │   ├── Cart Table
│   │   │   ├── Coupon Section
│   │   │   └── Cart Totals
│   │   └── [Other Pages]
│   └── Footer
└── UI Components
    ├── Button
    ├── Input
    ├── Card
    └── Label
```

### Admin Panel Component Tree

```
App
├── Login (unauthenticated)
└── Layout (authenticated)
    ├── Sidebar
    │   ├── Dashboard Link
    │   ├── Products Link
    │   ├── Categories Link
    │   ├── Orders Link
    │   ├── Users Link
    │   └── Logout Button
    └── [Page Content]
        ├── Dashboard
        │   ├── Stats Cards (×4)
        │   ├── Recent Orders
        │   └── Quick Actions
        ├── Products
        │   ├── Product Form (Add/Edit)
        │   └── Product Table
        ├── Categories
        │   ├── Category Form
        │   └── Category Grid
        ├── Orders
        │   └── Orders Table
        └── Users
            └── Users Table
```

## API Endpoint Structure

```
/api
├── /auth
│   ├── POST /signup
│   ├── POST /login
│   ├── POST /logout
│   └── POST /admin/login
├── /products
│   ├── GET    /              (list all)
│   ├── GET    /:id           (get one)
│   ├── GET    /slug/:slug    (get by slug)
│   ├── POST   /              (create)
│   ├── PUT    /:id           (update)
│   └── DELETE /:id           (delete)
├── /categories
│   ├── GET    /              (list all)
│   ├── GET    /:id           (get one)
│   ├── POST   /              (create)
│   ├── PUT    /:id           (update)
│   └── DELETE /:id           (delete)
├── /cart [auth required]
│   ├── GET    /              (get user cart)
│   ├── POST   /              (add item)
│   ├── PUT    /:id           (update quantity)
│   ├── DELETE /:id           (remove item)
│   └── DELETE /              (clear cart)
├── /orders [auth required]
│   ├── GET    /              (user orders)
│   ├── GET    /all           (all orders - admin)
│   ├── GET    /:id           (get one)
│   ├── POST   /              (create order)
│   └── PUT    /:id           (update status)
└── /users [auth required]
    ├── GET    /              (all users - admin)
    ├── GET    /me            (current user)
    └── PUT    /me            (update profile)
```

## Deployment Architecture

```
Production Environment

┌──────────────────┐
│   Vercel CDN     │
│   Web App        │
│   (Next.js)      │
└────────┬─────────┘
         │
         │
┌────────┴─────────┐      ┌──────────────────┐
│   Netlify CDN    │      │   Railway/Render │
│   Admin Panel    │      │   API Backend    │
│   (React SPA)    │      │   (Express)      │
└────────┬─────────┘      └────────┬─────────┘
         │                         │
         └─────────┬───────────────┘
                   │
         ┌─────────▼────────────┐
         │   Supabase Cloud     │
         │                      │
         │   Database           │
         │   Authentication     │
         │   Storage (CDN)      │
         └──────────────────────┘
```

## Security Layers

```
Security Stack

┌─────────────────────────────┐
│   HTTPS/SSL Encryption      │ ← Transport Layer
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│   CORS Configuration        │ ← API Layer
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│   JWT Token Validation      │ ← Auth Layer
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│   Row Level Security (RLS)  │ ← Database Layer
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│   Environment Variables     │ ← Config Layer
└─────────────────────────────┘
```

## Scaling Strategy

### Horizontal Scaling

```
Load Balancer
      │
      ├──→ API Instance 1
      ├──→ API Instance 2
      └──→ API Instance 3
            │
            ▼
      Supabase (auto-scales)
```

### Caching Strategy

```
Request Flow with Caching

User → CDN (Static Assets)
     → Next.js (ISR/SSG)
     → API (Response Caching)
     → Supabase (Query Caching)
```

## Monitoring Points

```
Monitoring Stack

Application Layer
├── Error Tracking (Sentry)
├── Performance (New Relic)
└── Logs (CloudWatch/Papertrail)

Infrastructure Layer
├── Uptime (UptimeRobot)
├── Analytics (Google Analytics)
└── Database (Supabase Dashboard)
```

## Development Workflow

```
Development Process

Local Development
├── npm run dev
└── All apps on localhost

Testing
├── Local testing
└── Build verification

Staging (Optional)
├── Deploy to staging environments
└── QA testing

Production
├── Deploy via CI/CD
└── Monitor metrics
```

## Technology Decision Matrix

| Requirement | Technology     | Reason                           |
| ----------- | -------------- | -------------------------------- |
| Customer UI | Next.js 14     | SEO, performance, modern React   |
| Admin UI    | React + Vite   | Fast dev, SPA suitable for admin |
| Backend     | Express.js     | Simple, flexible, widely adopted |
| Database    | Supabase       | PostgreSQL + Auth + Storage      |
| Styling     | Tailwind       | Utility-first, rapid development |
| Type Safety | TypeScript     | Catch errors early, better DX    |
| Monorepo    | npm workspaces | Simple, no extra tools needed    |

## Performance Optimizations

```
Optimization Strategies

Frontend
├── Code Splitting (Next.js automatic)
├── Image Optimization (next/image)
├── Lazy Loading (React.lazy)
└── Caching (SWR/React Query optional)

Backend
├── Database Indexing
├── Query Optimization
├── Response Compression
└── Connection Pooling

Database
├── Proper Indexes
├── RLS Policies
├── Query Optimization
└── Connection Limits
```

This architecture is designed to be:

- **Scalable**: Can handle growth
- **Maintainable**: Clean separation of concerns
- **Secure**: Multiple security layers
- **Fast**: Optimized at every level
- **Developer-friendly**: Easy to understand and extend
