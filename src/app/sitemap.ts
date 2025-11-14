import { createServer } from '@/lib/supabase-server'
import { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.SITE_URL || 'https://ih-cosmetics.vercel.app'
  const supabase = createServer()

  // 1. Get all products
  const { data: products } = await supabase
    .from('products')
    .select('id, updated_at') // We only need the ID

  const productEntries: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `${siteUrl}/product/${product.id}`,
    // We don't have an 'updated_at' on products, so we'll use a default
    // lastModified: product.updated_at ? new Date(product.updated_at) : new Date(), 
  }));

  // 2. Define your static pages
  const staticRoutes = [
    { url: `${siteUrl}/`, lastModified: new Date() },
    { url: `${siteUrl}/shop`, lastModified: new Date() },
    { url: `${siteUrl}/contact`, lastModified: new Date() },
  ]
 
  // 3. Combine them and return
  return [
    ...staticRoutes,
    ...productEntries
  ]
}