import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  // We'll get the live URL from the .env variable we made
  const siteUrl = process.env.SITE_URL || 'https://ih-cosmetics.vercel.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/account/',
        '/admin/',
        '/checkout/',
        '/login',
        '/signup',
        '/api/',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}