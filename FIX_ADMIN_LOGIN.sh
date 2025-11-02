#!/bin/bash

# Fix Admin Panel Login Issue - localhost API URL
echo "🔧 Fixing Admin Panel Login Issue"
echo "==================================="

# Navigate to project directory
PROJECT_DIR="/home/1542906.cloudwaysapps.com/awxrfzsrma/public_html"
cd "$PROJECT_DIR" || { echo "❌ Failed to navigate to project directory"; exit 1; }

echo "✅ Current directory: $(pwd)"

# Stop PM2
echo ""
echo "⏹️  Stopping PM2 processes..."
pm2 stop all
sleep 2

# Create/Update admin .env with correct API URL
echo ""
echo "📝 Setting up admin environment variables..."
cat > apps/admin/.env << 'EOF'
NODE_ENV=production
VITE_API_URL=https://riyanshamrit.com
VITE_SUPABASE_URL=https://iwvrjjgjxxtlvvbdbytb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dnJqamdqeHh0bHZ2YmRieXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNDE5NDYsImV4cCI6MjA3NTYxNzk0Nn0.GfdDYw6nfj3RyG6xj50lxhIwTJGouLvO0MxJXaa-LDk
EOF
echo "✅ Admin environment variables configured"

# Verify the API URL in the source code
echo ""
echo "🔍 Verifying source code has correct fallback..."
cd apps/admin
if grep -q "VITE_API_URL || 'https://riyanshamrit.com'" src/lib/api.ts 2>/dev/null; then
    echo "✅ Source code has correct production URL fallback"
else
    echo "⚠️  Warning: Source code might need to be updated"
    echo "   Expected: VITE_API_URL || 'https://riyanshamrit.com'"
    echo "   Checking current value..."
    grep -n "VITE_API_URL" src/lib/api.ts || echo "   ⚠️  VITE_API_URL not found in api.ts"
fi

# Clean previous build
echo ""
echo "🧹 Cleaning previous build..."
rm -rf dist
rm -rf node_modules/.vite

# Rebuild Admin App with correct API URL
echo ""
echo "🔨 Rebuilding Admin App with correct API URL..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Admin app build successful"
else
    echo "❌ Admin app build failed"
    cd ../..
    exit 1
fi

# Verify the built bundle contains correct URL (basic check)
echo ""
echo "🔍 Verifying build output..."
if grep -q "riyanshamrit.com" dist/assets/*.js 2>/dev/null; then
    echo "✅ Build contains production URL"
else
    echo "⚠️  Warning: Could not verify production URL in build"
fi

cd ../..

# Restart PM2 with updated config
echo ""
echo "▶️  Starting PM2 processes..."
pm2 start ecosystem.config.js
pm2 save
sleep 5

# Check status
echo ""
echo "📊 PM2 Status:"
pm2 status

# Test admin server directly
echo ""
echo "🔍 Testing admin server..."
ADMIN_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/admin_test http://localhost:3001/admin/ 2>/dev/null | tail -1)
if [ "$ADMIN_RESPONSE" = "200" ]; then
    echo "✅ Admin server responding correctly on port 3001"
else
    echo "⚠️  Admin server response: $ADMIN_RESPONSE"
    echo "   Check logs: pm2 logs riyansh-admin"
fi

# Test API endpoint
echo ""
echo "🔍 Testing admin login API endpoint..."
API_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/api_test -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  http://localhost:4000/api/auth/admin/login 2>/dev/null | tail -1)
if [ "$API_RESPONSE" = "200" ]; then
    echo "✅ Admin login API endpoint responding correctly"
else
    echo "⚠️  Admin login API response: $API_RESPONSE"
    echo "   Check API logs: pm2 logs riyansh-api"
fi

echo ""
echo "=========================================="
echo "✅ ADMIN LOGIN FIX COMPLETE!"
echo "=========================================="
echo ""
echo "🧪 Test the admin panel:"
echo "1. Visit: https://riyanshamrit.com/admin/"
echo "2. Login with: admin / admin123"
echo "3. Check browser console for:"
echo "   ✅ POST https://riyanshamrit.com/api/auth/admin/login"
echo "   ❌ Should NOT see: localhost:4000"
echo ""
echo "📊 If issues persist, check logs:"
echo "   pm2 logs riyansh-admin --lines 50"
echo "   pm2 logs riyansh-api --lines 50"
echo ""

