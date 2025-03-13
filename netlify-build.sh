#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Print environment information
echo "===== Environment Information ====="
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "=================================="

# Check for package.json
if [ ! -f package.json ]; then
  echo "Error: package.json not found!"
  exit 1
fi

# List installed packages for debugging
echo "===== Checking for critical dependencies ====="
npm list sharp encoding @netlify/plugin-nextjs --depth=0 || true
echo "=================================="

# Clean up any previous builds
echo "Cleaning up previous builds..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies with specific flags to handle optional dependencies
echo "Installing dependencies..."
npm ci --no-optional --prefer-offline --no-audit --progress=false

# Build the Next.js application with increased memory limit
echo "Building Next.js application..."
NODE_OPTIONS="--max_old_space_size=4096" npm run build

echo "Build completed successfully!"
exit $? 