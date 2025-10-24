# ✅ Complete Setup & Deployment Checklist

Use this checklist to ensure everything is properly set up and deployed.

## 📦 Initial Setup

### 1. Repository Setup

- [ ] Clone/download the repository
- [ ] Navigate to project directory
- [ ] Review `README.md`

### 2. Dependencies Installation

- [ ] Install Node.js (v18+)
- [ ] Run `npm install` in root
- [ ] Run `npm run install:all` or use install script
- [ ] Verify all packages installed successfully

### 3. Supabase Setup

- [ ] Create Supabase account
- [ ] Create new Supabase project
- [ ] Wait for project initialization
- [ ] Note down project URL
- [ ] Copy anon/public key
- [ ] Copy service role key (keep secure!)

### 4. Database Configuration

- [ ] Open Supabase SQL Editor
- [ ] Copy contents of `packages/db/schema.sql`
- [ ] Run SQL in Supabase editor
- [ ] Verify all tables created:
  - [ ] users
  - [ ] categories
  - [ ] products
  - [ ] cart_items
  - [ ] orders
  - [ ] order_items
- [ ] Check sample categories inserted

### 5. Storage Setup

- [ ] Go to Supabase Storage
- [ ] Create new bucket: `product-images`
- [ ] Set bucket to public
- [ ] Verify bucket is accessible

### 6. Environment Variables

- [ ] Copy `.env.example` to `.env`
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Add `VITE_SUPABASE_URL`
- [ ] Add `VITE_SUPABASE_ANON_KEY`
- [ ] Add `SUPABASE_URL` (backend)
- [ ] Add `SUPABASE_KEY` (backend)
- [ ] Set `JWT_SECRET` (random string)
- [ ] Verify all variables set correctly

### 7. First Run

- [ ] Run `npm run dev` from root
- [ ] Check terminal for errors
- [ ] Verify web app starts (port 3000)
- [ ] Verify admin panel starts (port 3001)
- [ ] Verify API starts (port 4000)

## 🧪 Testing

### Customer Website (localhost:3000)

- [ ] Home page loads
- [ ] Navigation works
- [ ] All menu links work
- [ ] Footer displays correctly
- [ ] Responsive on mobile
- [ ] Store page loads
- [ ] Product filtering works
- [ ] Cart page accessible
- [ ] About page displays
- [ ] Contact form renders

### Authentication

- [ ] Can access signup page
- [ ] Can register new user
- [ ] Receive confirmation
- [ ] Can login with credentials
- [ ] Login persists on refresh
- [ ] Can logout successfully

### Shopping Flow

- [ ] Can browse products
- [ ] Can view product details
- [ ] Can add product to cart
- [ ] Cart count updates
- [ ] Cart page shows items
- [ ] Can update quantities
- [ ] Can remove items
- [ ] Cart total calculates correctly

### Admin Panel (localhost:3001)

- [ ] Login page loads
- [ ] Can login with admin/admin123
- [ ] Dashboard displays
- [ ] All sidebar links work
- [ ] Statistics display correctly

### Admin - Products

- [ ] Product list displays
- [ ] Can add new product
- [ ] Form validation works
- [ ] Can edit existing product
- [ ] Can delete product
- [ ] Changes reflect immediately

### Admin - Categories

- [ ] Category list displays
- [ ] Can add new category
- [ ] Can edit category
- [ ] Can delete category
- [ ] Changes persist

### Admin - Orders

- [ ] Orders list displays
- [ ] Can view order details
- [ ] Can update order status
- [ ] Status changes save

### Admin - Users

- [ ] User list displays
- [ ] User information shows correctly
- [ ] List updates when new users register

### API Testing (localhost:4000)

- [ ] API responds at root endpoint
- [ ] Auth endpoints work
- [ ] Product endpoints work
- [ ] Category endpoints work
- [ ] Protected routes require auth
- [ ] Error handling works

## 🎨 Customization

### Branding

- [ ] Update logo/brand name in Navbar
- [ ] Update footer text
- [ ] Update meta tags in layouts
- [ ] Add favicon

### Content

- [ ] Add sample products (at least 8-10)
- [ ] Upload product images to Supabase Storage
- [ ] Update about page content
- [ ] Update contact information
- [ ] Customize home page text

### Colors (if needed)

- [ ] Update `apps/web/tailwind.config.ts`
- [ ] Update `apps/admin/tailwind.config.js`
- [ ] Test color changes across all pages

## 🚢 Pre-Deployment

### Code Quality

- [ ] Run builds for all apps
- [ ] Fix any build errors
- [ ] Fix any TypeScript errors
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Remove console.logs
- [ ] Remove test data

### Security

- [ ] Change admin credentials
- [ ] Update admin login logic
- [ ] Verify environment variables secure
- [ ] Check no secrets in code
- [ ] Verify CORS settings
- [ ] Test RLS policies

### Documentation

- [ ] Update README with your info
- [ ] Document any custom changes
- [ ] Update environment variable docs
- [ ] Add deployment notes

## 🌐 Deployment

### Web App Deployment

- [ ] Choose hosting (Vercel recommended)
- [ ] Create account
- [ ] Connect repository or deploy manually
- [ ] Add environment variables
- [ ] Deploy and test
- [ ] Configure custom domain (optional)
- [ ] Enable HTTPS/SSL
- [ ] Test production URL

### Admin Panel Deployment

- [ ] Choose hosting (Netlify/Vercel)
- [ ] Build admin panel
- [ ] Deploy dist folder
- [ ] Add environment variables
- [ ] Test admin URL
- [ ] Configure subdomain (optional)
- [ ] Enable HTTPS/SSL

### API Deployment

- [ ] Choose hosting (Railway/Render)
- [ ] Create new service
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Deploy API
- [ ] Note API URL
- [ ] Test API endpoints
- [ ] Enable HTTPS

### Post-Deployment Updates

- [ ] Update web app API URL
- [ ] Update admin panel API URL
- [ ] Redeploy web app
- [ ] Redeploy admin panel
- [ ] Test all integrations

### Domain Configuration

- [ ] Purchase domain (optional)
- [ ] Configure DNS records
- [ ] Set up subdomains:
  - [ ] www/@ → Web app
  - [ ] admin → Admin panel
  - [ ] api → Backend API
- [ ] Wait for DNS propagation
- [ ] Test all domains

## 🔍 Production Testing

### Functionality

- [ ] User registration works
- [ ] User login works
- [ ] Product browsing works
- [ ] Add to cart works
- [ ] Checkout works
- [ ] Order creation works
- [ ] Admin login works
- [ ] Admin CRUD operations work

### Performance

- [ ] Page load times acceptable
- [ ] Images load properly
- [ ] API response times good
- [ ] No console errors
- [ ] Mobile performance good

### Security

- [ ] HTTPS working on all domains
- [ ] Admin panel password changed
- [ ] Environment variables secure
- [ ] CORS configured correctly
- [ ] Auth tokens working
- [ ] RLS policies active

## 📊 Post-Launch

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Set up analytics (Google Analytics)
- [ ] Set up uptime monitoring
- [ ] Configure alerts
- [ ] Monitor database usage
- [ ] Check API logs

### Maintenance

- [ ] Backup database regularly
- [ ] Monitor storage usage
- [ ] Update dependencies monthly
- [ ] Review security advisories
- [ ] Test backup restoration

### Optimization

- [ ] Monitor performance metrics
- [ ] Optimize slow queries
- [ ] Review and optimize images
- [ ] Enable caching where possible
- [ ] Monitor user feedback

## 🎉 Launch Checklist

### Final Pre-Launch

- [ ] All features tested
- [ ] All bugs fixed
- [ ] Security reviewed
- [ ] Performance optimized
- [ ] Backups configured
- [ ] Monitoring active
- [ ] Documentation complete
- [ ] Team trained on admin panel

### Launch Day

- [ ] Deploy to production
- [ ] Test all critical flows
- [ ] Announce launch
- [ ] Monitor error rates
- [ ] Monitor performance
- [ ] Be ready for quick fixes

### Week 1 Post-Launch

- [ ] Monitor user feedback
- [ ] Track analytics
- [ ] Fix any issues reported
- [ ] Optimize based on usage
- [ ] Review metrics

## 📝 Notes

Use this section to track your progress or note any custom configurations:

```
Date Started: _______________
Date Completed Setup: _______________
Date Deployed: _______________

Custom Changes:
-
-
-

Known Issues:
-
-
-

Next Steps:
-
-
-
```

---

## ✅ Quick Check

**Minimum to Run Locally:**

- [x] Dependencies installed
- [x] Supabase project created
- [x] Database schema deployed
- [x] Storage bucket created
- [x] Environment variables set
- [x] `npm run dev` running

**Minimum to Deploy:**

- [x] All local tests passing
- [x] Admin credentials changed
- [x] All three apps deployed
- [x] Environment variables updated
- [x] Production testing complete

---

**Congratulations! 🎉**

Once all checkboxes are complete, your Riyansh E-Commerce platform is fully operational!
