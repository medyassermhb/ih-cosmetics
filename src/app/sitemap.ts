import { createServer } from '@/lib/supabase-server'
import { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.SITE_URL || 'https://ih-cosmetics.vercel.app'
  const supabase = createServer()

  // 1. Récupérer tous les produits
  // CORRECTION : On utilise 'created_at' au lieu de 'updated_at'
  const { data: products } = await supabase
    .from('products')
    .select('id, created_at') 

  const productEntries: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `${siteUrl}/product/${product.id}`,
    // On utilise la date de création pour le SEO
    lastModified: product.created_at ? new Date(product.created_at) : new Date(), 
  }));

  // 2. Définir les pages statiques
  const staticRoutes = [
    { url: `${siteUrl}/`, lastModified: new Date() },
    { url: `${siteUrl}/shop`, lastModified: new Date() },
    { url: `${siteUrl}/contact`, lastModified: new Date() },
  ]
 
  // 3. Combiner et retourner
  return [
    ...staticRoutes,
    ...productEntries
  ]
}