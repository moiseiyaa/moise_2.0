/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure Next.js to use the new frontend directory structure
  distDir: '.next',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Update the source directory to point to the frontend directory
  // This tells Next.js where to find the pages/app directory
  // Note: This is a custom configuration that might need additional setup
  // depending on your deployment setup
  experimental: {
    appDir: './frontend/app',
  },
  // Update the webpack configuration to handle the new paths
  webpack: (config, { isServer }) => {
    // Add alias for the frontend directory
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'frontend'),
      '@/components': require('path').resolve(__dirname, 'frontend/components'),
      '@/lib': require('path').resolve(__dirname, 'frontend/lib'),
      '@/styles': require('path').resolve(__dirname, 'frontend/styles'),
      '@/app': require('path').resolve(__dirname, 'frontend/app'),
      '@/hooks': require('path').resolve(__dirname, 'frontend/hooks'),
      '@/public': require('path').resolve(__dirname, 'frontend/public'),
      '@/backend': require('path').resolve(__dirname, 'backend'),
    };
    
    // Important: return the modified config
    return config;
  },
}

export default nextConfig
