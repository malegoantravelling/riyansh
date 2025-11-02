#!/bin/bash

# Quick Deployment Fix - Razorpay Payment Issue
echo "🔧 Quick Deployment Fix for Razorpay Payment"
echo "============================================="

# Navigate to project directory
PROJECT_DIR="/home/1542906.cloudwaysapps.com/awxrfzsrma/public_html"
cd "$PROJECT_DIR" || { echo "❌ Failed to navigate to project directory"; exit 1; }

echo "✅ Current directory: $(pwd)"

# Stop PM2
echo ""
echo "⏹️  Stopping PM2 processes..."
pm2 stop all
sleep 2

# Create/Update environment files with Razorpay credentials
echo ""
echo "📝 Creating environment files with Razorpay credentials..."

# Web app .env.local
cat > apps/web/.env.local << 'EOF'
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://riyanshamrit.com
NEXT_PUBLIC_SUPABASE_URL=https://iwvrjjgjxxtlvvbdbytb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dnJqamdqeHh0bHZ2YmRieXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNDE5NDYsImV4cCI6MjA3NTYxNzk0Nn0.GfdDYw6nfj3RyG6xj50lxhIwTJGouLvO0MxJXaa-LDk
EOF

# API .env with Razorpay credentials
cat > apps/api/.env << 'EOF'
NODE_ENV=production
PORT=4000
SUPABASE_URL=https://iwvrjjgjxxtlvvbdbytb.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dnJqamdqeHh0bHZ2YmRieXRiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDA0MTk0NiwiZXhwIjoyMDc1NjE3OTQ2fQ.example-service-key
JWT_SECRET=your-jwt-secret-here
EMAIL_USER=riyanshamrit106@gmail.com
EMAIL_PASSWORD=your-app-password-here
RAZORPAY_KEY_ID=rzp_test_RamROqs2QkoEYq
RAZORPAY_KEY_SECRET=JJSQXyYUxWSFg24opv4i1pfm
EOF

# Admin .env
cat > apps/admin/.env << 'EOF'
NODE_ENV=production
VITE_API_URL=https://riyanshamrit.com
VITE_SUPABASE_URL=https://iwvrjjgjxxtlvvbdbytb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dnJqamdqeHh0bHZ2YmRieXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNDE5NDYsImV4cCI6MjA3NTYxNzk0Nn0.GfdDYw6nfj3RyG6xj50lxhIwTJGouLvO0MxJXaa-LDk
EOF

echo "✅ Environment files created with Razorpay credentials"

# Rebuild API with updated code
echo ""
echo "🔨 Rebuilding API (with Razorpay fix)..."
cd apps/api || exit 1
npm run build
if [ $? -eq 0 ]; then
    echo "✅ API build successful"
else
    echo "❌ API build failed"
    cd ../..
    exit 1
fi
cd ../..

# Rebuild Web App
echo ""
echo "🔨 Rebuilding Web App..."
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

# Rebuild Admin App
echo ""
echo "🔨 Rebuilding Admin App..."
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

# Start PM2
echo ""
echo "▶️  Starting PM2 processes..."
pm2 start ecosystem.config.js
pm2 save
sleep 5

# Check status
echo ""
echo "📊 PM2 Status:"
pm2 status

# Test API
echo ""
echo "🔍 Testing API..."
API_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/api_test http://localhost:4000/api/products 2>/dev/null)
if [ "$API_RESPONSE" = "200" ]; then
    echo "✅ API responding correctly"
else
    echo "⚠️  API response: $API_RESPONSE"
fi

echo ""
echo "=========================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "🎉 Razorpay payment should now work!"
echo ""
echo "🧪 Test Payment:"
echo "1. Visit: https://riyanshamrit.com/store"
echo "2. Add product and checkout"
echo "3. Use test card: 4111111111111111"
echo ""
echo "📊 Check logs: pm2 logs riyansh-api"
echo ""
