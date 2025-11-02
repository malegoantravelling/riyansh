# 🔧 Nginx Configuration Fix for Cloudways

## The Issue

Your website shows "No Products Found" because the frontend is trying to call `localhost:4000` instead of your production domain. Even though we've fixed the code, you need to ensure Nginx is properly routing `/api` requests.

## Required Nginx Configuration

Add this to your Cloudways Nginx configuration:

```nginx
# API endpoints - MUST be first for proper routing
location ~ ^/api/(.*)$ {
    # Handle CORS preflight requests
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }
    
    # Proxy to API server
    proxy_pass http://localhost:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    
    # Add CORS headers for actual requests
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
}

# Admin panel - Must be before location /
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

# Next.js static files and HMR
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

# Main website - MUST be last!
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

## How to Apply in Cloudways

1. **Login to Cloudways Dashboard**
2. **Go to your application**
3. **Navigate to "Application Settings" > "Nginx Settings"**
4. **Add the above configuration**
5. **Save and restart Nginx**

## Alternative: Via SSH

```bash
# SSH into your server
ssh master@YOUR_SERVER_IP

# Edit Nginx config (path may vary)
sudo nano /etc/nginx/sites-available/your-domain.conf

# Add the configuration above
# Save and exit

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Test After Configuration

```bash
# Test API through domain
curl https://riyanshamrit.com/api/products

# Should return JSON array of products
```

## Expected Behavior

**Before Fix:**
- ❌ `https://riyanshamrit.com/api/products` returns 404
- ❌ Frontend shows "No Products Found"
- ❌ Console shows localhost:4000 errors

**After Fix:**
- ✅ `https://riyanshamrit.com/api/products` returns product data
- ✅ Store page shows products
- ✅ Console shows API calls to riyanshamrit.com/api

## Troubleshooting

### If API still returns 404:
1. Check Nginx error logs: `tail -f /var/log/nginx/error.log`
2. Verify PM2 API is running: `pm2 status`
3. Test API locally: `curl http://localhost:4000/api/products`

### If CORS errors:
- The configuration above includes CORS headers
- Make sure the `/api` location block is first in your config

### If admin panel doesn't work:
- Ensure `/admin/` location block is before `/` location block
- Check admin app is running on port 3001

## Order Matters!

The Nginx location blocks MUST be in this order:
1. `/api/` (regex match)
2. `/admin/`
3. `/_next/`
4. `/` (catch-all - must be last)

Wrong order will cause routing issues!
