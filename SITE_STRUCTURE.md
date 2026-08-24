# Riyansh Website — Content Structure Inventory

Structural map of the public web app (`apps/web`). Use this as a content blueprint for redesign; design, color, typography, and layout details are intentionally omitted.

**Total pages:** 20  
**App shell:** Every route is wrapped by the root layout: **Navbar** → **Main (page content)** → **Footer**.

---

## Site hierarchy

```
/
├── Home (/)
├── Marketing
│   ├── Store (/store)
│   ├── Product Detail (/products/[slug])
│   ├── About (/about)
│   └── Contact / E-Consultation (/contact)
├── Commerce
│   ├── Cart (/cart)
│   ├── Wishlist (/wishlist)
│   ├── Checkout — Shipping (/checkout)
│   └── Checkout — Payment (/checkout/payment)
├── Account & Auth
│   ├── Login (/login)
│   ├── Signup (/signup)
│   ├── Google OAuth Callback (/auth/google/callback)
│   └── My Orders (/account/orders)
├── Order status
│   ├── Success (/orders/success)
│   ├── Failure (/orders/failure)
│   └── Pending (/orders/pending)
└── Policies
    ├── Shipping Policy (/shipping)
    ├── Cancellation & Refund (/cancellation-refund)
    ├── Privacy Policy (/privacy)
    └── Terms & Conditions (/terms)
```

### Primary navigation (Navbar)

| Label | Route |
|-------|--------|
| Home | `/` |
| Store | `/store` |
| About us | `/about` |
| E-Consultation | `/contact` |

**Utility links (Navbar):** Wishlist (`/wishlist`), Login (`/login`) or Account menu → My Orders (`/account/orders`) + Sign out, Cart (`/cart`), phone call CTA.

### Footer link groups

| Group | Links |
|-------|--------|
| Brand / about | Brand name, short description, trust badges, social links (Facebook, Twitter, Instagram, YouTube) |
| Quick Links | Home, Shop (`/store`), About Us, Contact |
| Customer Service | Shipping Policy, Returns & Refunds, Privacy Policy, Terms & Conditions, Support Center (`/contact`) |
| Contact Us | Address, phone, email, business hours |
| Newsletter | Email subscribe field |
| Bottom bar | Copyright, Privacy, Terms, Shipping, Returns |

---

## Global shell sections

Present on all pages via root layout.

### Navbar

1. **Utility bar** — Wishlist, Account/Login, Cart  
2. **Brand bar** — Brand name, tagline, phone CTA, mobile menu toggle  
3. **Primary category nav** — Home, Store, About us, E-Consultation  
4. **Mobile menu** (conditional) — Same primary links + account/login + phone  

### Footer

1. **Brand & trust** — About blurb, security/certification badges, social follow  
2. **Quick Links**  
3. **Customer Service**  
4. **Contact Us** — Address, phone, email, hours  
5. **Newsletter subscribe**  
6. **Legal / copyright bottom bar**

---

## Page-by-page content sections

### 1. Home — `/`

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Hero** | Badge (“Trusted Healthcare Partner”), headline, supporting copy, primary CTA (Explore Products → `/store`), secondary CTA (Learn More → `/about`), trust indicators (Genuine / Fast Delivery / 24/7 Support), hero media (image mobile / video desktop) |
| 2 | **Why Choose Riyansh (Features)** | Section header + 3 feature blocks: Free Delivery, 100% Genuine, 24/7 Support |
| 3 | **Featured Products** | Section header (“Featured Collection” / “Our Premium Products”), product grid (up to 8), empty/loading states, CTA “View All Products” → `/store` |
| 4 | **Newsletter / deals promo** | Headline (exclusive deals & updates), offer messaging, subscribe form (present but currently hidden in markup), trust badges (secure / no spam / subscriber count) |
| 5 | **Testimonials** | Section header + customer review cards (name, quote, avatar, rating, verified label) |

---

### 2. Store — `/store`

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Search & sort controls** | Product search field; sort options (default, price low–high, price high–low, newest); mobile filters toggle |
| 2 | **Filter sidebar — Product Category** | Checkboxes: Ayurvedic Juices & Tonics, Capsules & Supplements, Personal Care & Herbal Oils, Health & Nutrition |
| 3 | **Filter sidebar — Health Concern** | Checkboxes: Immunity & Digestion, Joint Pain & Mobility, Diabetes & Blood Sugar, Women’s Health, Strength & Stamina |
| 4 | **Filter sidebar — Popular Products** | Featured/popular product card (first product) |
| 5 | **Filter sidebar — Warning Information** | Regulatory / dosage disclaimer copy |
| 6 | **Product grid** | Paginated product cards with “Show More”; empty state with reset filters |

---

### 3. Product Detail — `/products/[slug]`

Dynamic product page.

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Breadcrumb** | Home → Store → Product name |
| 2 | **Product showcase — media** | Primary product image; optional sale badge |
| 3 | **Product showcase — info & actions** | Title, rating row, share/copy link, price (and compare-at / discount), product meta, quantity selector, Add to Cart, Buy Now, bullet highlights (authenticity, return window, support phone) |
| 4 | **Tabbed details — Product details** | Description, Usage, Indications & health benefits, Herbal formulation story |
| 5 | **Tabbed details — Product Reviews** | Customer reviews & ratings list |
| 6 | **Tabbed details — Shipping and Returns** | Shipping, free delivery threshold, returns, support phone |
| 7 | **Related Products** | Header + related product grid |
| — | **Not found / loading** | Alternate states: loading indicator; Product Not Found + Browse Store |

---

### 4. About — `/about`

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Hero** | Company badge, headline, intro copy, breadcrumb (Home → About Us) |
| 2 | **Company story (Who We Are)** | Narrative about Riyansh Multitrade, milestones (Founded / Certification / Base / Reach), supporting image + ISO callout |
| 3 | **Our Promise / Values** | Header + 4 value cards: Rooted in Ayurveda, Quality First, Health & Happiness, Pan-India Reach |
| 4 | **Product range (Our Range)** | Signature products list (Amrit Juice, Artho-G, Daibo-G, Lady Life Care) with links to product pages + “View all products” |
| 5 | **Quality strip** | Three assurance points: Herbal formulations, Certified company, Delivered to your door |
| 6 | **Stats** | Happy customers, herbs count, years of trust, distribution reach |
| 7 | **CTA** | Closing pitch + Shop Products / Contact Us |

---

### 5. Contact (E-Consultation) — `/contact`

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Hero** | Badge, “Contact Us” headline, intro, breadcrumb |
| 2 | **Get In Touch (contact form)** | Fields: First Name, Last Name, Email, Subject, Message; submit action |
| 3 | **Let’s Connect (contact info)** | Call Us (phone + hours); Email Us (email + 24/7 support note) |

---

### 6. Cart — `/cart`

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Breadcrumb** | Home → Your Shopping Cart |
| 2 | **Page title** | “Your Cart” |
| 3 | **Empty cart state** | Message + Continue Shopping |
| 4 | **Cart line items table** | Columns: Product, Price, Quantity (adjust/remove), Total |
| 5 | **Order notes** | Optional note field + Continue Shopping |
| 6 | **Subtotal & checkout** | Subtotal, shipping/tax disclaimer, Check Out CTA |

---

### 7. Wishlist — `/wishlist`

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Breadcrumb** | Home → Wishlist |
| 2 | **Page title** | “Wishlist” |
| 3 | **Empty wishlist state** | Message + Browse Store |
| 4 | **Wishlist items table** | Columns: Product, Price, Availability, Actions (remove / add to cart / checkout item) |
| 5 | **Wishlist summary / bulk actions** | Subtotal and checkout-all style actions (when items exist) |

---

### 8. Checkout — Shipping — `/checkout`

Requires auth; redirects to login if needed.

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Checkout progress breadcrumb** | Cart → Shipping → Payment |
| 2 | **Shipping details form** | First name, Phone, Address, City, State, PIN code, Order notes; Continue to payment |
| 3 | **Order summary** | Line items + total |
| — | **Empty cart state** | Message + Continue shopping |

---

### 9. Checkout — Payment — `/checkout/payment`

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Checkout progress breadcrumb** | Cart → Shipping → Payment |
| 2 | **Payment header** | “Secure checkout” / Choose payment + short explanation |
| 3 | **Delivery address summary** | Ship-to details with Edit link back to shipping |
| 4 | **UPI apps** | Payment method options (recommended group) |
| 5 | **Cards, net banking & wallets** | Additional PayU payment options |
| 6 | **Pay action** | Pay CTA + secure processor notice |
| 7 | **Order summary** | Items list, totals |

---

### 10. Login — `/login`

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Brand header** | Brand name + tagline |
| 2 | **Page intro** | “Welcome back” + supporting line |
| 3 | **Auth panel** | Error message (if any), Continue with Google, divider, email/password form, link to Signup |

---

### 11. Signup — `/signup`

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Brand header** | Brand name + tagline |
| 2 | **Page intro** | “Create your account” + supporting line |
| 3 | **Auth panel** | Error/success messages, Continue with Google, divider, form (Full name, Email, Password), link to Login |

---

### 12. Google OAuth Callback — `/auth/google/callback`

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Status message** | Transient “Completing Google sign-in…” (or error) then redirect |

Utility/auth bridge page — minimal content surface.

---

### 13. My Orders — `/account/orders`

Requires auth.

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Breadcrumb** | Home → My Orders |
| 2 | **Page title** | “My Orders” |
| 3 | **Error banner** | Optional fetch/verify errors |
| 4 | **Empty orders state** | Message + Browse store |
| 5 | **Orders list** | Per order: ID, date, status, line items, total, payment IDs, verify-payment / view actions |

---

### 14. Order Success — `/orders/success`

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Success status card** | Success headline, thank-you copy, optional Order ID / Transaction ID, auto-redirect notice, CTAs: My Orders, Continue shopping |

---

### 15. Order Failure — `/orders/failure`

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Failure status card** | Failure headline, message/reason/status/order meta, CTAs: Try again, My Orders |

---

### 16. Order Pending — `/orders/pending`

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Pending status card** | “Confirming payment”, status message, optional PayU/order IDs, CTAs: My Orders, Back to cart |

---

### 17. Shipping Policy — `/shipping`

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Hero** | Title, intro, breadcrumb |
| 2 | **Shipping options** | Standard Shipping; Express Shipping (duration, cost, features) |
| 3 | **Shipping information** | Processing Time; Delivery Areas; Important Information |
| 4 | **Order tracking journey** | Steps: Order Confirmed → Processing → Shipped → Out for Delivery → Delivered |
| 5 | **Important notes** | Delivery Issues?; Delivery Success Tips |
| 6 | **Help / contact CTA** | Email / phone support for shipping |

---

### 18. Cancellation & Refund — `/cancellation-refund`

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Hero** | Title, intro, breadcrumb |
| 2 | **Policy overview** | Key metrics: Return Window, Refund Processing, Satisfaction Guarantee |
| 3 | **Order cancellation policy** | Before Shipping; After Shipping |
| 4 | **Refund policy details** | Refund Processing Time; Eligible for Refund; Not Eligible for Refund |
| 5 | **Return process steps** | Initiate → Authorization → Package → Ship Back → Receive Refund |
| 6 | **Important notes** | Return Shipping Costs; Quick Tips |
| 7 | **Help / contact CTA** | Support for returns/refunds |

---

### 19. Privacy Policy — `/privacy`

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Hero** | Title, intro, breadcrumb |
| 2 | **Introduction** | Policy summary + last updated |
| 3 | **Information We Collect** | |
| 4 | **How We Use Your Information** | |
| 5 | **Information Sharing** | |
| 6 | **Data Security** | |
| 7 | **Your Rights** | |
| 8 | **Cookies and Tracking** | |
| 9 | **Children’s Privacy** | |
| 10 | **Changes to This Policy** | |
| 11 | **Contact Us** | Email, phone, address |

---

### 20. Terms & Conditions — `/terms`

| # | Section | Content / purpose |
|---|---------|-------------------|
| 1 | **Hero** | Title, intro, breadcrumb |
| 2 | **Introduction** | Agreement summary + last updated |
| 3 | **Acceptance of Terms** | |
| 4 | **Use License** | |
| 5 | **Product Information** | |
| 6 | **Order Acceptance** | |
| 7 | **Account Orders** | |
| 8 | **Intellectual Property** | |
| 9 | **Limitation of Liability** | |
| 10 | **Questions About Terms (Contact)** | Email, phone |

---

## Cross-page content relationships

| Flow | Pages involved |
|------|----------------|
| Browse → product → cart | `/` or `/store` → `/products/[slug]` → `/cart` |
| Checkout | `/cart` → `/login` (if needed) → `/checkout` → `/checkout/payment` → `/orders/{success\|pending\|failure}` → `/account/orders` |
| Wishlist → purchase | `/wishlist` → cart/checkout |
| Auth | `/login` ↔ `/signup`; Google via `/auth/google/callback` |
| Support / legal | Footer & policy pages ↔ `/contact` |
| Marketing CTAs | Home / About → `/store`, `/about`, `/contact` |

### Reusable content blocks (not pages)

- **Product card** — Used on Home, Store, Product related grid, Store popular widget  
- **Toast notifications** — Global feedback for cart, forms, errors  

---

## Page count summary by category

| Category | Count | Routes |
|----------|------:|--------|
| Marketing / catalog | 5 | `/`, `/store`, `/products/[slug]`, `/about`, `/contact` |
| Commerce | 4 | `/cart`, `/wishlist`, `/checkout`, `/checkout/payment` |
| Auth / account | 4 | `/login`, `/signup`, `/auth/google/callback`, `/account/orders` |
| Order status | 3 | `/orders/success`, `/orders/failure`, `/orders/pending` |
| Policies | 4 | `/shipping`, `/cancellation-refund`, `/privacy`, `/terms` |
| **Total** | **20** | |

---

*Generated from the Next.js App Router pages under `apps/web/src/app`. Structural only — no visual design specifications.*
