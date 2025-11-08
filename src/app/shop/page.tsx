// src/app/shop/page.tsx
import { Suspense } from 'react'
import { createServer } from '@/lib/supabase-server'
import ProductCard from '@/components/products/ProductCard'
import ProductFilter from '@/components/products/ProductFilter'
import { type Product } from '@/types/cart'
import type { Metadata } from 'next'

// Force dynamic SSR for this route
export const revalidate = 0
// Or: export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Boutique | IH Cosmetics',
}

// In Next 15+, `searchParams` is a Promise you should await.
type ShopPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const supabase = createServer()

  // Resolve the promise and safely read our params
  const params = await searchParams
  const category = Array.isArray(params.category)
    ? params.category[0]
    : params.category
  const gender = Array.isArray(params.gender) ? params.gender[0] : params.gender

  let query = supabase.from('products').select('*')

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  if (gender && gender !== 'all') {
    query = query.eq('gender', gender)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return (
      <p className="text-center text-red-500">
        Erreur de chargement des produits.
      </p>
    )
  }

  const products = (data ?? []) as Product[]

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">Notre Collection</h1>

      <Suspense fallback={<div className="h-16" />}>
        <ProductFilter />
      </Suspense>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          Aucun produit ne correspond à vos critères.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
