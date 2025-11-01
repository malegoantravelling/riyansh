#!/bin/bash

# Emergency Fix Script for Cloudways
# Run this script on your Cloudways server to fix the port conflict

echo "🔧 Fixing PM2 port conflicts..."

# Navigate to project directory
cd /home/1542906.cloudwaysapps.com/awxrfzsrma/public_html || {
    echo "❌ Error: Could not navigate to project directory"
    echo "Please update the path in this script"
    exit 1
}

# Stop all PM2 processes
echo "⏹️  Stopping PM2..."
pm2 delete all || true

# Kill any stuck Node processes
echo "🧹 Cleaning up stuck processes..."
killall node || true
killall next || true
killall vite || true
sleep 2

# Clear ports if needed
echo "🔌 Clearing ports..."
lsof -ti:3000 | xargs kill -9 || true
lsof -ti:3001 | xargs kill -9 || true
lsof -ti:4000 | xargs kill -9 || true
sleep 2

# Fix API .env if it has wrong port
if [ -f "apps/api/.env" ]; then
    echo "📝 Fixing apps/api/.env..."
    # Backup the file
    cp apps/api/.env apps/api/.env.backup
    # Remove or fix PORT line
    grep -v "^PORT=" apps/api/.env.backup > apps/api/.env.tmp || true
    echo "PORT=4000" >> apps/api/.env.tmp
    mv apps/api/.env.tmp apps/api/.env
    echo "✅ Fixed apps/api/.env"
fi

# Rebuild API to ensure clean state
echo "🔨 Rebuilding API..."
cd apps/api
npm run build
cd ../..

# Start PM2
echo "🚀 Starting PM2..."
pm2 start ecosystem.config.js

# Show status
echo ""
echo "📊 PM2 Status:"
pm2 status

# Show logs
echo ""
echo "📋 Checking logs..."
echo "--- API Logs (last 5 lines) ---"
pm2 logs riyansh-api --lines 5 --nostream || true
echo ""
echo "--- Web Logs (last 5 lines) ---"
pm2 logs riyansh-web --lines 5 --nostream || true
echo ""
echo "--- Admin Logs (last 5 lines) ---"
pm2 logs riyansh-admin --lines 5 --nostream || true

echo ""
echo "✅ Fix complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Run: pm2 logs --lines 50"
echo "2. Check: pm2 status"
echo "3. Verify: curl http://localhost:4000/api/products"
echo "4. Verify: curl http://localhost:3000"
echo "5. Verify: curl http://localhost:3001/admin/"
echo ""
echo "If issues persist, check: FIX_API_PORT_ERROR.md"

