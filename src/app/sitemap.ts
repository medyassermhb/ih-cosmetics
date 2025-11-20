import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js' // Use the direct client

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.SITE_URL || 'https://ih-cosmetics.vercel.app'
  
  // 1. Initialize a simple Supabase client
  // We use the '!' to tell TypeScript we know these exist
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Safety check for build time
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Missing Supabase environment variables during sitemap build')
    return []
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // 2. Get all products
  const { data: products } = await supabase
    .from('products')
    .select('id, created_at') 

  const productEntries: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `${siteUrl}/product/${product.id}`,
    // Use created_at for lastModified
    lastModified: product.created_at ? new Date(product.created_at) : new Date(), 
  }));

  // 3. Define your static pages
  const staticRoutes = [
    { url: `${siteUrl}/`, lastModified: new Date() },
    { url: `${siteUrl}/shop`, lastModified: new Date() },
    { url: `${siteUrl}/contact`, lastModified: new Date() },
  ]
 
  // 4. Combine them and return
  return [
    ...staticRoutes,
    ...productEntries
  ]
}