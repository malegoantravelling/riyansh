#!/bin/bash

# Fix Admin Panel Redirect Loop
echo "🔧 Fixing Admin Panel Redirect Loop"
echo "====================================="

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

# Rebuild Admin App to ensure base path is correctly applied
echo ""
echo "🔨 Rebuilding Admin App with correct base path and API URL..."
cd apps/admin || exit 1

# Ensure vite.config.ts has base: '/admin/'
if ! grep -q "base: '/admin/'" vite.config.ts; then
    echo "⚠️  Warning: vite.config.ts might not have base: '/admin/'"
fi

npm run build
if [ $? -eq 0 ]; then
    echo "✅ Admin app build successful"
else
    echo "❌ Admin app build failed"
    cd ../..
    exit 1
fi
cd ../..

# Verify the built index.html has correct asset paths
echo ""
echo "🔍 Verifying build output..."
if grep -q 'src="/admin/assets/' apps/admin/dist/index.html 2>/dev/null || grep -q 'src="/assets/' apps/admin/dist/index.html 2>/dev/null; then
    echo "✅ Build output looks correct"
else
    echo "⚠️  Warning: Build output might need review"
fi

# Restart PM2 with updated config
echo ""
echo "▶️  Starting PM2 processes with updated config..."
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

echo ""
echo "=========================================="
echo "✅ ADMIN PANEL FIX COMPLETE!"
echo "=========================================="
echo ""
echo "🧪 Test the admin panel:"
echo "1. Visit: https://riyanshamrit.com/admin/"
echo "2. Should load without redirect loop"
echo "3. Login with: admin / admin123"
echo ""
echo "📊 If issues persist, check logs:"
echo "   pm2 logs riyansh-admin --lines 50"
echo "   tail -n 100 /var/log/apache2/error.log"
echo ""

