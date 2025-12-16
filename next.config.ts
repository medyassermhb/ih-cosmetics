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
      // Allow specific origins to prevent 403 errors
      allowedOrigins: ['ih-cosmetics.vercel.app', 'localhost:3000'],
      // Increase body size limit to 5MB (default is 1MB)
      bodySizeLimit: '5mb',
    },
  },
}

module.exports = nextConfig