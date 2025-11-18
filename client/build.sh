#!/bin/bash
# Build script for Render deployment - SPA with routing support

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🏗️  Building React application..."
npm run build

echo "🔄 Copying SPA redirect rules..."
if [ -f "public/_redirects" ]; then
  cp public/_redirects dist/_redirects
  echo "✅ _redirects file copied successfully"
else
  echo "❌ ERROR: _redirects file not found in public/"
  exit 1
fi

# Verify _redirects is in dist
if [ -f "dist/_redirects" ]; then
  echo "✅ Verified: _redirects is in dist/"
  cat dist/_redirects
else
  echo "❌ ERROR: _redirects was not copied to dist/"
  exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build output is in ./dist directory"
