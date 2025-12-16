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
  // Add this to allow Server Actions from your specific domain
  experimental: {
    serverActions: {
      allowedOrigins: ['ih-cosmetics.vercel.app', 'localhost:3000'],
    },
  },
}

module.exports = nextConfig