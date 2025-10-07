#!/bin/bash

# =============================================================================
# Snippet Platform - Setup & Run Script
# =============================================================================

echo "🚀 Snippet Platform - Authentication Setup"
echo "=========================================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Step 1: Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing base dependencies..."
    npm install
    echo ""
fi

# Step 2: Install auth packages
echo "🔐 Installing authentication packages..."
npm install next-auth@beta bcryptjs
npm install -D @types/bcryptjs
echo ""

# Step 3: Check .env.local
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found!"
    echo "Please create .env.local file with:"
    echo ""
    echo "NEXTAUTH_URL=http://localhost:3000"
    echo "NEXTAUTH_SECRET=your-secret-key-here"
    echo ""
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Step 4: Display info
echo "📋 Setup Complete!"
echo "=========================================="
echo ""
echo "📍 Available Routes:"
echo "   Home:      http://localhost:3000"
echo "   Sign In:   http://localhost:3000/auth/signin"
echo "   Sign Up:   http://localhost:3000/auth/signup"
echo "   Dashboard: http://localhost:3000/dashboard (protected)"
echo ""
echo "🔑 Demo Credentials:"
echo "   Email:    test@example.com"
echo "   Password: password"
echo ""
echo "📚 Documentation:"
echo "   Quick Start:  QUICKSTART.md"
echo "   Auth Guide:   AUTH_README.md"
echo "   Flow Diagram: AUTH_FLOW.md"
echo "   Checklist:    PROJECT_CHECKLIST.md"
echo ""
echo "🚀 Starting development server..."
echo "=========================================="
echo ""

# Step 5: Run dev server
npm run dev
