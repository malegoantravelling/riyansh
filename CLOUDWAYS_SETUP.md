# Cloudways Nginx Configuration Setup

## Overview

This guide helps you configure Nginx on Cloudways to route:

- `riyanshamrit.com` → Web app (port 3000)
- `riyanshamrit.com/admin` → Admin panel (port 3001)
- `riyanshamrit.com/api` → API server (port 4000)

## Step 1: Login to Cloudways

1. Go to https://platform.cloudways.com/
2. Select your application
3. Navigate to **Server Management** → **Settings & Packages**

## Step 2: Access Nginx Configuration

1. Click **"Enable/Disable Extended Varnish"** or **"Update Nginx Configuration"**
2. Or go to **Application Management** → **Nginx Configuration**

## Step 3: Add Nginx Configuration

In the Nginx configuration file, add the following rules **INSIDE** the main server block:

**IMPORTANT**: Order matters in Nginx! Add these rules in this exact order:

```nginx
# API endpoints - riyanshamrit.com/api (MUST be first!)
location ~ ^/api/(.*)$ {
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }

    proxy_pass http://localhost:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

# Admin panel - riyanshamrit.com/admin
location /admin/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

# Admin root redirect
location = /admin {
    return 301 /admin/;
}

# Next.js static files
location /_next/ {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

# Main website - riyanshamrit.com (MUST be last!)
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;

    # Increase timeouts for Next.js
    proxy_read_timeout 300;
    proxy_connect_timeout 300;
    proxy_send_timeout 300;
}
```

## Step 4: Update environment variables

### API Server (`apps/api/.env`)

```env
NODE_ENV=production
PORT=4000
# ... your other env variables
```

### Web App (`apps/web/.env.local`)

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://riyanshamrit.com/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Admin Panel (`apps/admin/.env`)

```env
VITE_API_URL=https://riyanshamrit.com/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**IMPORTANT**: Notice the `VITE_API_URL` uses your actual domain, not localhost!

## Step 5: Rebuild Admin with New Base Path

Since we changed the Vite config, you need to rebuild:

```bash
cd apps/admin
npm run build
cd ../..
```

## Step 6: Restart PM2

```bash
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

## Step 7: Test Your Configuration

1. **Main website**: https://riyanshamrit.com

   - Should show your e-commerce homepage
   - Products should load

2. **Admin panel**: https://riyanshamrit.com/admin

   - Should show admin login page
   - Login credentials: admin / admin123

3. **API**: https://riyanshamrit.com/api/products
   - Should return JSON data of products

## Troubleshooting

### Issue: Products not loading

**Solution**:

1. Check `NEXT_PUBLIC_API_URL` in web app env
2. Verify API is running: `curl http://localhost:4000/api/products`
3. Check Nginx logs: `tail -f /var/log/nginx/error.log`

### Issue: Admin panel shows 404

**Solution**:

1. Make sure you rebuilt admin after adding `base: '/admin/'`
2. Check PM2 logs: `pm2 logs riyansh-admin`
3. Verify Vite preview is running: `curl http://localhost:3001`

### Issue: API endpoints not working

**Solution**:

1. Check API logs: `pm2 logs riyansh-api`
2. Test API directly: `curl http://localhost:4000/api/products`
3. Check CORS settings in API code

### Issue: Nginx returning 502 Bad Gateway

**Solution**:

1. Verify all apps are running: `pm2 list`
2. Check if ports are listening: `netstat -tulpn | grep -E ':(3000|3001|4000)'`
3. Restart Nginx: `sudo service nginx reload`

## Alternative: Using Cloudways Application Settings

If the Nginx configuration method above doesn't work, you can try:

1. In Cloudways, go to **Application Management**
2. Click on **Domain Settings**
3. Add a subdomain or path mapping:
   - **Primary Domain**: riyanshamrit.com
   - **Path**: Leave empty for web app
   - **Redirect/Subdomain**: admin → Port 3001

This method may vary depending on your Cloudways plan and PHP/Nginx setup.

## SSL/HTTPS Configuration

Make sure SSL certificate is configured in Cloudways:

1. Go to **Application Management** → **SSL Certificate**
2. Install Let's Encrypt certificate
3. Force HTTPS redirect in Nginx config:

```nginx
# Force HTTPS
if ($scheme != "https") {
    return 301 https://$server_name$request_uri;
}
```

## Final Checklist

- [ ] Nginx configuration updated
- [ ] Admin panel rebuilt with new base path
- [ ] Environment variables updated with production URLs
- [ ] All apps running on PM2
- [ ] SSL certificate installed
- [ ] Main website accessible: https://riyanshamrit.com
- [ ] Admin panel accessible: https://riyanshamrit.com/admin
- [ ] API accessible: https://riyanshamrit.com/api/products
- [ ] Products loading on website
- [ ] Admin login working

## Support

For Cloudways-specific issues, refer to their documentation:

- https://support.cloudways.com/en/articles/5124839-how-to-configure-nginx-on-cloudways

For Nginx configuration help:

- https://nginx.org/en/docs/
