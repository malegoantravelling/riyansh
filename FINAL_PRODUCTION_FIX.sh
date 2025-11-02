#!/bin/bash

# 🚨 FINAL FIX: Production API Issue - Products Not Showing
# This script fixes the localhost:4000 problem once and for all

echo "🚨 FINAL PRODUCTION FIX - SOLVING PRODUCT DISPLAY ISSUE"
echo "======================================================="

# Navigate to project directory
PROJECT_DIR="/home/1542906.cloudwaysapps.com/awxrfzsrma/public_html"
cd "$PROJECT_DIR" || { echo "❌ Failed to navigate to project directory"; exit 1; }

echo "✅ Current directory: $(pwd)"
echo "📊 Current PM2 Status:"
pm2 status

echo ""
echo "🔍 DIAGNOSING THE ISSUE..."
echo "=========================="

# Check if API is responding locally
echo "Testing API locally..."
API_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/api_test http://localhost:4000/api/products)
if [ "$API_RESPONSE" = "200" ]; then
    echo "✅ API is responding on localhost:4000"
    PRODUCTS_COUNT=$(cat /tmp/api_test | jq length 2>/dev/null || echo "unknown")
    echo "📦 Products in database: $PRODUCTS_COUNT"
else
    echo "❌ API not responding on localhost:4000 (HTTP: $API_RESPONSE)"
fi

# Check current environment files
echo ""
echo "📋 Checking current environment files..."
if [ -f "apps/web/.env.local" ]; then
    echo "✅ Web .env.local exists:"
    grep "NEXT_PUBLIC_API_URL" apps/web/.env.local || echo "❌ NEXT_PUBLIC_API_URL not found"
else
    echo "❌ Web .env.local missing"
fi

if [ -f "apps/api/.env" ]; then
    echo "✅ API .env exists:"
    grep "PORT" apps/api/.env || echo "❌ PORT not found"
else
    echo "❌ API .env missing"
fi

echo ""
echo "🔧 APPLYING FIX..."
echo "=================="

# Step 1: Stop PM2
echo "⏹️  Stopping PM2 processes..."
pm2 stop all
sleep 2

# Step 2: Create correct environment files
echo "📝 Creating correct environment files..."

# Web app .env.local
cat > apps/web/.env.local << 'EOF'
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://riyanshamrit.com/api
NEXT_PUBLIC_SUPABASE_URL=https://iwvrjjgjxxtlvvbdbytb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dnJqamdqeHh0bHZ2YmRieXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNDE5NDYsImV4cCI6MjA3NTYxNzk0Nn0.GfdDYw6nfj3RyG6xj50lxhIwTJGouLvO0MxJXaa-LDk
EOF

# API .env
cat > apps/api/.env << 'EOF'
NODE_ENV=production
PORT=4000
SUPABASE_URL=https://iwvrjjgjxxtlvvbdbytb.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dnJqamdqeHh0bHZ2YmRieXRiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDA0MTk0NiwiZXhwIjoyMDc1NjE3OTQ2fQ.example-service-key
JWT_SECRET=your-jwt-secret-here
EMAIL_USER=riyanshamrit106@gmail.com
EMAIL_PASSWORD=your-app-password-here
RAZORPAY_KEY_ID=your-razorpay-key-here
RAZORPAY_KEY_SECRET=your-razorpay-secret-here
EOF

# Admin .env
cat > apps/admin/.env << 'EOF'
NODE_ENV=production
VITE_API_URL=https://riyanshamrit.com/api
VITE_SUPABASE_URL=https://iwvrjjgjxxtlvvbdbytb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dnJqamdqeHh0bHZ2YmRieXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNDE5NDYsImV4cCI6MjA3NTYxNzk0Nn0.GfdDYw6nfj3RyG6xj50lxhIwTJGouLvO0MxJXaa-LDk
EOF

echo "✅ Environment files created"

# Step 3: Verify environment files
echo ""
echo "📋 Verifying environment files..."
echo "Web .env.local:"
grep "NEXT_PUBLIC_API_URL" apps/web/.env.local
echo "API .env:"
grep "PORT" apps/api/.env
echo "Admin .env:"
grep "VITE_API_URL" apps/admin/.env

# Step 4: Rebuild applications
echo ""
echo "🔨 Rebuilding applications..."

# Rebuild web app (CRITICAL!)
echo "Building web app..."
cd apps/web || exit 1
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Web app build successful"
else
    echo "❌ Web app build failed"
    cd ../..
    exit 1
fi
cd ../..

# Rebuild admin app
echo "Building admin app..."
cd apps/admin || exit 1
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Admin app build successful"
else
    echo "❌ Admin app build failed"
    cd ../..
    exit 1
fi
cd ../..

# Step 5: Start PM2
echo ""
echo "🚀 Starting PM2 processes..."
pm2 start ecosystem.config.js
pm2 save

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Step 6: Verify everything is working
echo ""
echo "🧪 VERIFICATION TESTS"
echo "===================="

echo "PM2 Status:"
pm2 status

echo ""
echo "Testing API locally:"
curl -s -w "HTTP Status: %{http_code}\n" http://localhost:4000/api/products | head -5

echo ""
echo "Testing API through domain:"
curl -s -w "HTTP Status: %{http_code}\n" https://riyanshamrit.com/api/products | head -5

echo ""
echo "✅ ========================================"
echo "✅ FIX COMPLETED!"
echo "✅ ========================================"
echo ""
echo "🔗 Test your website now:"
echo "   🌐 Main site: https://riyanshamrit.com"
echo "   🛒 Store page: https://riyanshamrit.com/store"
echo "   ⚙️  Admin: https://riyanshamrit.com/admin"
echo ""
echo "🔍 What to check:"
echo "   1. Open https://riyanshamrit.com/store"
echo "   2. Products should now be visible"
echo "   3. Check browser console (F12) - should show API calls to riyanshamrit.com/api"
echo "   4. No more localhost:4000 errors"
echo ""
echo "📊 Current PM2 Status:"
pm2 status
echo ""
echo "If products still don't show, check:"
echo "1. Nginx configuration for /api routing"
echo "2. Domain SSL certificate"
echo "3. Supabase database has products"
echo ""
