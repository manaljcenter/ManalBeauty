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

# Clean install dependencies with more verbose output
echo "Installing dependencies..."
npm ci --verbose

# Build the Next.js app
echo "Building Next.js application..."
npm run build

echo "Build completed successfully!" 