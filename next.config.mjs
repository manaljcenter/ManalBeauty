/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import path from 'path';

// Convert the current file URL to a directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the cache handler
const cacheHandlerPath = path.join(__dirname, 'cache-handler.js');

const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Configure image domains for external images
  images: {
    domains: ['localhost', 'xsgames.co', 'placehold.it'],
    // Enable remote patterns if needed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Disable image optimization during build to reduce memory usage
    unoptimized: process.env.NODE_ENV === 'production',
  },
  
  // Configure build output for Netlify
  output: 'standalone',
  
  // Disable source maps in production to reduce memory usage
  productionBrowserSourceMaps: false,
  
  // Set build directory
  distDir: process.env.BUILD_DIR || '.next',
  
  // TypeScript configuration
  typescript: {
    // Ignore TypeScript errors in production build
    ignoreBuildErrors: true,
  },
  
  // Configure experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['react-icons'],
  },
  
  // External packages for server components (moved from experimental)
  serverExternalPackages: [],
  
  // Output file tracing root (moved from experimental)
  outputFileTracingRoot: path.join(__dirname),
  
  // Handle optional dependencies
  webpack: (config, { isServer }) => {
    // Fix for optional dependencies
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Reduce memory usage during build
    config.optimization = {
      ...config.optimization,
      minimize: true,
    };
    
    return config;
  },
  
  // Configure build cache
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 60 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
};

// Disable Next.js telemetry
export const generateBuildId = () => 'build';

export default nextConfig; 