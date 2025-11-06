import { type Product } from '@/types/cart'
import ProductCard from '@/components/products/ProductCard'

type FeaturedCollectionProps = {
  products: Product[]
}

const FeaturedCollection = ({ products }: FeaturedCollectionProps) => {
  if (products.length === 0) {
    return null
  }

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Notre Sélection
        </h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeaturedCollection