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

# Create cache directories
echo "Setting up cache directories..."
mkdir -p .next/cache/images
mkdir -p .next/cache/fetch-cache
mkdir -p .next/cache/webpack
mkdir -p node_modules/.cache

# Ensure cache directories are properly set up for Netlify
echo "Setting up Netlify cache directories..."
mkdir -p /opt/build/cache/next/cache
mkdir -p /opt/build/cache/next/server
mkdir -p /opt/build/cache/next/server/chunks
mkdir -p /opt/build/cache/next/server/chunks/app || true

# Clean up any previous builds but preserve cache
echo "Cleaning up previous builds while preserving cache..."
find .next -type f -not -path "*/cache/*" -delete || true
find .next -type d -empty -delete || true

# Install dependencies with specific flags to handle optional dependencies
echo "Installing dependencies..."
npm ci --prefer-offline --no-audit --progress=false

# Create a temporary .env file to disable TypeScript checks and set required environment variables
echo "Creating .env.local file with required variables..."
cat > .env.local << EOL
NEXT_TYPESCRIPT_CHECK=false
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
BUILD_DIR=.next
NEXT_CACHE_DIR=.next/cache
NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-https://yvbwzbcxogwxvbymlmsj.supabase.co}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Ynd6YmN4b2d3eHZieW1sbXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NDAwMjAsImV4cCI6MjA1NzMxNjAyMH0._GUA9qK5OmPe-DN_89UqHPncW7JcN36rcFjcjoNdVQg}
supabaseUrl=${supabaseUrl:-https://yvbwzbcxogwxvbymlmsj.supabase.co}
supabaseAnonKey=${supabaseAnonKey:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Ynd6YmN4b2d3eHZieW1sbXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NDAwMjAsImV4cCI6MjA1NzMxNjAyMH0._GUA9qK5OmPe-DN_89UqHPncW7JcN36rcFjcjoNdVQg}
EOL

# Print environment variables for debugging (without sensitive values)
echo "===== Environment Variables ====="
echo "NEXT_PUBLIC_SUPABASE_URL is set: ${NEXT_PUBLIC_SUPABASE_URL:+true}"
echo "supabaseUrl is set: ${supabaseUrl:+true}"
echo "NEXT_CACHE_DIR is set to: ${NEXT_CACHE_DIR:-.next/cache}"
echo "=================================="

# Build the Next.js application with increased memory limit and skip TypeScript checks
echo "Building Next.js application..."
NODE_OPTIONS="--max_old_space_size=4096" NEXT_TYPESCRIPT_CHECK=false npm run build

# Copy cache to Netlify's persistent cache location if it exists
if [ -d "/opt/build/cache" ]; then
  echo "Copying cache to Netlify's persistent cache location..."
  cp -R .next/cache/* /opt/build/cache/next/cache/ || true
fi

echo "Build completed successfully!"
exit $? 