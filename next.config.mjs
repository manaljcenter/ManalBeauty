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
  
  // Configure build caching
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['react-icons'],
    // Disable turbotrace to reduce memory usage
    turbotrace: false,
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
  
  // Disable telemetry
  telemetry: {
    telemetryDisabled: true,
  },
};

export default nextConfig; 