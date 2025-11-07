// src/app/shop/page.tsx
export const runtime = 'nodejs'
export const revalidate = 0

export const metadata = {
  title: 'Boutique | IH Cosmetics',
}

type ShopPageProps = {
  searchParams: {
    category?: string
    gender?: string
  }
}

import { createServer } from '@/lib/supabase-server'
import ProductCard from '@/components/products/ProductCard'
import ProductFilter from '@/components/products/ProductFilter'
import { type Product } from '@/types/cart'
import { Suspense } from 'react'

const ShopPage = async ({ searchParams }: ShopPageProps) => {
  const supabase = createServer()
  const { category, gender } = searchParams

  let query = supabase.from('products').select('*')

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  if (gender && gender !== 'all') {
    query = query.eq('gender', gender)
  }

  const { data: products = [], error } = await query.order('created_at', {
    ascending: false,
  })

  if (error) {
    console.error('Error fetching products:', error)
    return <p className="text-center text-red-500">Erreur de chargement des produits.</p>
  }

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
            <ProductCard key={product.id} product={product as Product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ShopPage
