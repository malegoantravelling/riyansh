# 🚢 Deployment Guide

This guide covers deploying the Riyansh E-Commerce platform to production.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Supabase project set up and schema deployed
- [ ] Storage bucket created and configured
- [ ] Admin credentials changed from defaults
- [ ] All apps build successfully locally
- [ ] Test all critical user flows

## 🌐 Deploy Web App (Next.js)

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Navigate to web app**

   ```bash
   cd apps/web
   ```

3. **Deploy**

   ```bash
   vercel
   ```

4. **Add Environment Variables** in Vercel Dashboard:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL`

5. **Set Production Domain**
   - Configure custom domain in Vercel settings

### Option 2: Netlify

1. **Build the app**

   ```bash
   cd apps/web
   npm run build
   ```

2. **Deploy to Netlify**

   - Drag and drop `.next` folder to Netlify
   - Or connect GitHub repository

3. **Configure Environment Variables** in Netlify dashboard

### Manual Deployment

```bash
cd apps/web
npm run build
npm start
```

Serve on port 3000 or configure Nginx/Apache.

## 🎨 Deploy Admin Panel (React + Vite)

### Option 1: Vercel

1. **Build the app**

   ```bash
   cd apps/admin
   npm run build
   ```

2. **Deploy `dist` folder**

   ```bash
   vercel --prod
   ```

3. **Add Environment Variables**:
   - `VITE_API_URL`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Option 2: Netlify

1. **Build**

   ```bash
   cd apps/admin
   npm run build
   ```

2. **Deploy**
   - Drag `dist/` folder to Netlify
   - Configure environment variables

### Option 3: Static Hosting

The admin panel is a static SPA. You can host it on:

- AWS S3 + CloudFront
- Azure Static Web Apps
- GitHub Pages
- Any static file server

## 🔌 Deploy API Backend (Express.js)

### Option 1: Railway

1. **Create account** at [railway.app](https://railway.app)

2. **Create new project**

3. **Connect GitHub** or deploy manually

4. **Configure**:

   - Root directory: `apps/api`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

5. **Add Environment Variables**:
   - `PORT=4000`
   - `NODE_ENV=production`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `JWT_SECRET`

### Option 2: Render

1. **Create account** at [render.com](https://render.com)

2. **Create new Web Service**

3. **Configure**:

   - Environment: Node
   - Build command: `cd apps/api && npm install && npm run build`
   - Start command: `cd apps/api && npm start`

4. **Add Environment Variables**

### Option 3: Heroku

1. **Install Heroku CLI**

   ```bash
   npm i -g heroku
   ```

2. **Login**

   ```bash
   heroku login
   ```

3. **Create app**

   ```bash
   heroku create riyansh-api
   ```

4. **Deploy**

   ```bash
   cd apps/api
   git push heroku main
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set SUPABASE_URL=xxx
   heroku config:set SUPABASE_KEY=xxx
   ```

### Option 4: Digital Ocean / AWS / GCP

1. **Create a VM instance**

2. **Install Node.js**

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone repository**

   ```bash
   git clone <your-repo>
   cd riyansh-ecommerce/apps/api
   ```

4. **Install dependencies**

   ```bash
   npm install
   npm run build
   ```

5. **Set up PM2**

   ```bash
   npm i -g pm2
   pm2 start dist/index.js --name riyansh-api
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx** (optional)

   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔐 Security Best Practices

### Before Going Live

1. **Change Admin Credentials**

   - Update hardcoded admin login in `apps/api/src/routes/auth.ts`
   - Use environment variables for admin users

2. **Use HTTPS**

   - Enable SSL certificates (Let's Encrypt)
   - Redirect HTTP to HTTPS

3. **Environment Variables**

   - Never commit `.env` files
   - Use secure key management (AWS Secrets Manager, etc.)

4. **CORS Configuration**

   - Update CORS origins in `apps/api/src/index.ts`
   - Only allow your production domains

5. **Rate Limiting**

   - Add rate limiting middleware to API
   - Protect against DDoS attacks

6. **Database Security**

   - Enable Supabase RLS policies
   - Use service role key only in backend
   - Never expose service role key to frontend

7. **Input Validation**
   - Validate all user inputs
   - Sanitize data before database operations

## 📊 Monitoring & Analytics

### Recommended Tools

1. **Application Monitoring**

   - Sentry for error tracking
   - New Relic for performance
   - LogRocket for session replay

2. **Analytics**

   - Google Analytics
   - Mixpanel
   - Plausible (privacy-friendly)

3. **Uptime Monitoring**
   - Pingdom
   - UptimeRobot
   - Better Uptime

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd apps/web && npm install && npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-admin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd apps/admin && npm install && npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd apps/api && npm install && npm run build
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: 'riyansh-api'
          heroku_email: 'your-email@example.com'
```

## 🌍 Custom Domain Setup

### Web App

1. Add custom domain in Vercel/Netlify
2. Update DNS records (CNAME or A record)
3. Enable HTTPS/SSL

### Admin Panel

1. Add custom domain (e.g., admin.yourdomain.com)
2. Update DNS records
3. Enable HTTPS/SSL

### API

1. Add custom domain (e.g., api.yourdomain.com)
2. Update DNS A record to server IP
3. Configure Nginx/Cloudflare
4. Enable HTTPS/SSL

## 📧 Post-Deployment

### Update API URLs

1. **Update Web App**:

   ```env
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   ```

2. **Update Admin Panel**:

   ```env
   VITE_API_URL=https://api.yourdomain.com
   ```

3. **Redeploy all apps**

### Test Everything

- [ ] Homepage loads correctly
- [ ] Product pages work
- [ ] User registration/login
- [ ] Add to cart functionality
- [ ] Order placement
- [ ] Admin login
- [ ] Product management
- [ ] Order management

## 🔍 Troubleshooting

### Common Issues

**Build Fails**

- Check Node.js version (18+)
- Verify all dependencies installed
- Check for TypeScript errors

**API Connection Issues**

- Verify CORS settings
- Check environment variables
- Ensure API is running

**Database Connection Fails**

- Verify Supabase credentials
- Check network connectivity
- Ensure RLS policies are correct

**Authentication Issues**

- Check Supabase auth settings
- Verify JWT secret
- Check token expiration

## 📞 Support

If you encounter issues:

1. Check logs in hosting platform
2. Review environment variables
3. Test locally first
4. Check Supabase dashboard for errors

## 🎉 Success!

Your Riyansh E-Commerce platform is now live!

Remember to:

- Monitor error logs
- Set up automated backups
- Keep dependencies updated
- Monitor performance metrics
- Collect user feedback
