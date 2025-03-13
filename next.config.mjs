/** @type {import('next').NextConfig} */
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
  
  // Configure build caching
  experimental: {
    // Enable build cache
    turbotrace: false,
    // Optimize package imports
    optimizePackageImports: ['react-icons'],
    // Enable persistent build cache
    enableUndici: true,
  },
  
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
};

// Disable Next.js telemetry outside of the config object
export const generateBuildId = () => 'build';

export default nextConfig; 