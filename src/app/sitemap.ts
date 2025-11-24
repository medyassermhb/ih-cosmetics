import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Replace this string with your ACTUAL Vercel URL (no trailing slash)
  const siteUrl = 'https://ih-cosmetics-YOUR_NAME.vercel.app' 

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseKey) {
    return []
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: products } = await supabase
    .from('products')
    .select('id, created_at')

  const productEntries: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `${siteUrl}/product/${product.id}`,
    lastModified: product.created_at ? new Date(product.created_at) : new Date(),
  }))

  const staticRoutes = [
    { url: `${siteUrl}/`, lastModified: new Date() },
    { url: `${siteUrl}/shop`, lastModified: new Date() },
    { url: `${siteUrl}/contact`, lastModified: new Date() },
  ]

  return [...staticRoutes, ...productEntries]
}