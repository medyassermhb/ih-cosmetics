'use client'

import { Product } from '@/types/cart'
import { useCart } from '@/lib/store/cart-store'
import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'

type ProductCardProps = {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() 
    e.stopPropagation() 
    addItem(product)
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border">
      <Link href={`/product/${product.id}`} className="absolute inset-0 z-0" />
      <div className="aspect-h-4 aspect-w-3 overflow-hidden bg-gray-100">
        <Image
          src={product.image_url ?? '/placeholder.png'}
          alt={product.name}
          width={400}
          height={500}
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          unoptimized 
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <h3 className="text-lg font-medium text-gray-900">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500 capitalize">
          {product.category} / {product.gender}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-semibold">{product.price} DHS</p>
          <button
            onClick={handleAddToCart}
            aria-label={`Ajouter ${product.name} au panier`} // <-- Translated
            className="relative z-10 rounded-full bg-yellow-700 p-2 text-white shadow-md transition-all
             hover:bg-yellow-800"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard