#!/bin/bash
# Build script for Render deployment - SPA with routing support

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🏗️  Building React application..."
npm run build

echo "🔄 Copying SPA redirect rules..."
cp public/_redirects dist/_redirects 2>/dev/null || echo "⚠️  No _redirects file found"

echo "✅ Build completed successfully!"
echo "📁 Build output is in ./dist directory"
