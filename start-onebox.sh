#!/usr/bin/env bash
# GhostChain AI + SafeFi - One-Box Node Run Script
# This script sets up the local environment, builds the project, and starts the server in production mode.

set -e

echo "=================================================="
echo "    GhostChain AI + SafeFi One-Box Deployment     "
echo "=================================================="

# Check for Node.js
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install Node.js."
    exit 1
fi

echo "📦 1/3: Installing dependencies..."
npm install

echo "🔨 2/3: Building frontend assets..."
npm run build

echo "🚀 3/3: Starting Sovereign Hive Node..."
echo "Waiting for connections on port 3000..."
echo "--------------------------------------------------"

# Run the Node server in production using tsx
export NODE_ENV=production
npm run start
