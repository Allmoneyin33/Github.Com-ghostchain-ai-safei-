#!/usr/bin/env bash
# ⚡³³ ALLMONEYIN33 LLC | MULTI-PLATFORM DEPLOYMENT ENGINE
# AUTH: Tony Giatano Jones | CAO: €hain Sentinel
# DATE: April 30, 2026 | VERSION: v33-ALL

set -euo pipefail
IFS=$'\n\t'

log() { echo -e "\e[32m[⚡³³] $1\e[0m"; }
error() { echo -e "\e[31m[ERROR] $1\e[0m" >&2; exit 1; }

readonly PROJECT_ID="ghostchain-ai-safefi"

log "Authenticating into production project: ${PROJECT_ID}..."
gcloud config set project "${PROJECT_ID}" --quiet

log "1. Building Cloud Run deployment images..."
cat <<EOF > Dockerfile
FROM node:20-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080
CMD [ "node", "main.js" ]
EOF

# Build using Google Cloud Build
gcloud builds submit --tag "gcr.io/${PROJECT_ID}/ghostchain-oauth:latest" --quiet

log "2. Deploying across Cloud Run platforms..."
gcloud run deploy ghostchain-oauth \
    --image="gcr.io/${PROJECT_ID}/ghostchain-oauth:latest" \
    --platform="managed" \
    --region="us-central1" \
    --allow-unauthenticated \
    --quiet

log "3. Building multi-platform desktop distributions..."
if [ ! -d "node_modules" ]; then
    npm install --quiet
fi

# Build for various platforms using electron-builder
npx electron-builder build --mac --win --linux --x64 --publish never

log "4. Updating web application environments and widgets..."
firebase deploy --only hosting:ghostchain-ai-safefi --quiet

log "System successfully deployed to all endpoints."
