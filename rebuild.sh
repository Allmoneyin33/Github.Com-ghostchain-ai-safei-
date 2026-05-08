#!/usr/bin/env bash
# GhostChain AI + SafeFi - Complete Rebuild Script
# This script performs a hard reset: cleans artifacts, reinstalls, rebuilds, and restarts.

set -e

echo "=================================================="
echo "  GhostChain AI: Sovereign Hive - Full Rebuild    "
echo "=================================================="

echo "🧹 1/4: Cleaning old build artifacts and caches..."
rm -rf dist
rm -rf .vite

echo "📦 2/4: Installing dependencies..."
npm install

echo "🔨 3/4: Building the frontend (PWA & Vite)..."
npm run build

echo "🚀 4/4: Starting Sovereign Node in production mode..."
echo "Waiting for connections on port 3000..."
echo "--------------------------------------------------"

export NODE_ENV=production
npm run start
