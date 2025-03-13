#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Print environment information
echo "===== Environment Information ====="
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "=================================="

# Clean install dependencies
echo "Installing dependencies..."
npm ci

# Build the Next.js app
echo "Building Next.js application..."
npm run build

echo "Build completed successfully!" 