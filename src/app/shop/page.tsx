import { createServer } from '@/lib/supabase-server'
import ProductCard from '@/components/products/ProductCard'
import ProductFilter from '@/components/products/ProductFilter'
import { type Product } from '@/types/cart'
import { Suspense } from 'react'

// --- THIS IS A CRITICAL FIX ---
// We force the page to be dynamic to solve conflicts
// with cookies() and the searchParams promise.
export const revalidate = 0
// --- END OF FIX ---

export const metadata = {
  title: 'Boutique | IH Cosmetics',
}

// --- THIS IS THE FIX ---
// searchParams is a Promise
type ShopPageProps = {
  searchParams: Promise<{
    category?: string
    gender?: string
  }>
}
// --- END OF FIX ---

const ShopPage = async ({ searchParams }: ShopPageProps) => {
  const supabase = createServer()
  
  // --- THIS IS THE FIX ---
  // We await the promise to get the real object
  const { category, gender } = await searchParams
  // --- END OF FIX ---

  // Start building the query
  let query = supabase.from('products').select('*')

  // Apply filters if they exist
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  if (gender && gender !== 'all') {
    query = query.eq('gender', gender)
  }

  // Await the query
  const { data: products, error } = await query.order('created_at', {
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

      {/* Product Grid */}
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