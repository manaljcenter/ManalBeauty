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
mkdir -p /opt/build/cache/next/cache || true
mkdir -p /opt/build/cache/next/server || true
mkdir -p /opt/build/cache/next/server/chunks || true
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
BASE_URL=${BASE_URL:-https://wwwjamal.ly}
NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-https://yvbwzbcxogwxvbymlmsj.supabase.co}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Ynd6YmN4b2d3eHZieW1sbXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NDAwMjAsImV4cCI6MjA1NzMxNjAyMH0._GUA9qK5OmPe-DN_89UqHPncW7JcN36rcFjcjoNdVQg}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Ynd6YmN4b2d3eHZieW1sbXNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTc0MDAyMCwiZXhwIjoyMDU3MzE2MDIwfQ.ytMMnaMm7ua9pHlcG2eCIz9VKaovgDi2WDZaniWfrgU}
supabaseUrl=${supabaseUrl:-https://yvbwzbcxogwxvbymlmsj.supabase.co}
supabaseAnonKey=${supabaseAnonKey:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Ynd6YmN4b2d3eHZieW1sbXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NDAwMjAsImV4cCI6MjA1NzMxNjAyMH0._GUA9qK5OmPe-DN_89UqHPncW7JcN36rcFjcjoNdVQg}
EOL

# Print environment variables for debugging (without sensitive values)
echo "===== Environment Variables ====="
echo "BASE_URL is set: ${BASE_URL:+true}"
echo "NEXT_PUBLIC_SUPABASE_URL is set: ${NEXT_PUBLIC_SUPABASE_URL:+true}"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY is set: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:+true}"
echo "SUPABASE_SERVICE_ROLE_KEY is set: ${SUPABASE_SERVICE_ROLE_KEY:+true}"
echo "supabaseUrl is set: ${supabaseUrl:+true}"
echo "supabaseAnonKey is set: ${supabaseAnonKey:+true}"
echo "NEXT_CACHE_DIR is set to: ${NEXT_CACHE_DIR:-.next/cache}"
echo "=================================="

# Build the Next.js application with increased memory limit and skip TypeScript checks
echo "Building Next.js application..."
NODE_OPTIONS="--max_old_space_size=4096" NEXT_TYPESCRIPT_CHECK=false npm run build

# Ensure the public directory exists
echo "Ensuring public directory exists..."
mkdir -p public

# Create a _redirects file for Netlify in both .next and public directories
echo "Creating Netlify _redirects files..."
cat > .next/_redirects << EOL
# Netlify redirects file
# Redirect all requests to the Next.js handler
/*    /.netlify/functions/___netlify-handler    200!

# SPA fallback
/*    /index.html   404
EOL

# Copy _redirects to public directory to ensure it's included in the build
cp .next/_redirects public/_redirects || true

# Create a 404.html file for Netlify
echo "Creating 404.html file..."
if [ -f .next/server/app/_not-found.html ]; then
  cp .next/server/app/_not-found.html .next/404.html
else
  # Create a basic 404 page if the not-found page doesn't exist
  cat > .next/404.html << EOL
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - الصفحة غير موجودة</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background-color: #f9fafb;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      color: #111827;
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    p {
      color: #6b7280;
      margin-bottom: 2rem;
    }
    a {
      display: inline-block;
      background-color: #db2777;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.375rem;
      text-decoration: none;
      font-weight: 500;
    }
    a:hover {
      background-color: #be185d;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>404 - الصفحة غير موجودة</h1>
    <p>عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
    <a href="/">العودة إلى الصفحة الرئيسية</a>
  </div>
</body>
</html>
EOL
fi

# Copy 404.html to public directory
cp .next/404.html public/404.html || true

# Copy the standalone directory if it exists
if [ -d ".next/standalone" ]; then
  echo "Copying standalone directory..."
  cp -R .next/standalone/* .next/
fi

# Ensure the static directory is properly copied
if [ -d ".next/static" ]; then
  echo "Ensuring static directory is properly set up..."
  mkdir -p .next/standalone/public
  cp -R .next/static .next/standalone/public/ || true
fi

# Copy cache to Netlify's persistent cache location if it exists
if [ -d "/opt/build/cache" ]; then
  echo "Copying cache to Netlify's persistent cache location..."
  cp -R .next/cache/* /opt/build/cache/next/cache/ || true
fi

echo "Build completed successfully!"
exit $? 