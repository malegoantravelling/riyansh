#!/bin/bash

# Riyansh E-Commerce Installation Script
# This script installs all dependencies for the monorepo

echo "🚀 Installing Riyansh E-Commerce..."
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
echo "✅ Root dependencies installed"
echo ""

# Install web app dependencies
echo "📦 Installing web app dependencies..."
cd apps/web
npm install
cd ../..
echo "✅ Web app dependencies installed"
echo ""

# Install admin panel dependencies
echo "📦 Installing admin panel dependencies..."
cd apps/admin
npm install
cd ../..
echo "✅ Admin panel dependencies installed"
echo ""

# Install API dependencies
echo "📦 Installing API dependencies..."
cd apps/api
npm install
cd ../..
echo "✅ API dependencies installed"
echo ""

# Install shared package dependencies
echo "📦 Installing shared package dependencies..."

cd packages/db
npm install
cd ..

cd config
npm install
cd ..

cd ui
npm install
cd ..

cd utils
npm install
cd ../..

echo "✅ Shared packages dependencies installed"
echo ""

echo "🎉 Installation complete!"
echo ""
echo "Next steps:"
echo "1. Set up your Supabase project"
echo "2. Copy .env.example to .env and add your credentials"
echo "3. Run 'npm run dev' to start all applications"
echo ""
echo "See QUICKSTART.md for detailed instructions."

