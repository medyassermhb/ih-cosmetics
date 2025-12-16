/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hnrhhlxpnpkatvdagzcq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      // 1. Prevent 403 Forbidden errors
      allowedOrigins: ['ih-cosmetics.vercel.app', 'localhost:3000'],
      // 2. Fix 413 Content Too Large (Default is 1mb)
      bodySizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig