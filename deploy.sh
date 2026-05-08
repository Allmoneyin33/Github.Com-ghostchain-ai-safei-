#!/bin/bash
# =======================================================
# 🚀 GHOSTCHAIN SAFEFI: PRODUCTION DEPLOYMENT SCRIPT
# OWNER: ALLMONEYIN33 LLC
# =======================================================

echo "🔍 [CHECK]: Verifying environment stability..."
if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "⚠️ [WARNING]: STRIPE_SECRET_KEY is not set. Running in SIMULATION MODE."
else
    echo "✅ [SUCCESS]: Financial gateway configured."
fi

echo "📦 [DEPS]: Re-synchronizing production node_modules..."
npm ci --only=production

echo "⚙️ [BUILD]: Compiling GhostChain Omni-Master v140..."
npm run build

echo "🌐 [LAUNCH]: Activating SafeFi Cluster on Port 3000..."
# Use PM2 for zero-downtime clustering
npx pm2 start ecosystem.config.cjs --name "ghostchain-safe-fi-live"

echo "💾 [SYNCC]: Saving process list..."
npx pm2 save

echo "======================================================="
echo "✅ [DEPLOYMENT COMPLETE]"
echo "📊 MONITORING: npx pm2 dash"
echo "🌐 ENDPOINT: http://localhost:3000/api/health"
echo "======================================================="
