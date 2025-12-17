'use client'

import { useState } from 'react'
import Image from 'next/image'
import { type Product } from '@/types/cart'
import { useCart } from '@/lib/store/cart-store'
import { Check, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

type BoxBuilderProps = {
  products: Product[]
}

// --- CONFIGURATION ---
const BOX_LIMIT = 3
const BOX_PRICE = 130 // <--- CHANGE THIS TO YOUR DESIRED FIXED PRICE (e.g. 250, 300)
// ---------------------

export default function BoxBuilder({ products }: BoxBuilderProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const { addItem } = useCart()

  const toggleProduct = (product: Product) => {
    const isSelected = selectedProducts.find((p) => p.id === product.id)

    if (isSelected) {
      setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id))
    } else {
      if (selectedProducts.length >= BOX_LIMIT) {
        toast.error(`Maximum ${BOX_LIMIT} produits.`)
        return
      }
      setSelectedProducts((prev) => [...prev, product])
    }
  }

  const handleAddBoxToCart = () => {
    if (selectedProducts.length !== BOX_LIMIT) {
      toast.error(`Veuillez sélectionner ${BOX_LIMIT} produits.`)
      return
    }

    const productNames = selectedProducts.map(p => p.name).join(', ')
    const productIds = selectedProducts.map(p => p.id)

    // Create the "Box Product" with the FIXED PRICE
    const boxProduct: Product = {
      id: 'coffret-custom',
      name: `Coffret Personnalisé (${BOX_LIMIT} Parfums)`,
      description: 'Coffret composé sur mesure',
      price: BOX_PRICE, // <--- Uses the fixed price here
      category: 'box',
      gender: 'unisex',
      image_url: selectedProducts[0].image_url,
      created_at: new Date().toISOString()
    }

    addItem(
      boxProduct, 
      productIds, 
      `Contient : ${productNames}`
    )

    setSelectedProducts([])
    toast.success('Coffret ajouté au panier !')
  }

  // Calculate the "Real Value" (Sum of individual prices) to show savings
  const realValue = selectedProducts.reduce((sum, p) => sum + p.price, 0)

  return (
    <div>
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Votre Coffret</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-yellow-700">
                {selectedProducts.length} / {BOX_LIMIT}
              </span>
              <span className="text-sm text-gray-400">sélectionnés</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-gray-500">Prix du coffret</p>
              <div className="flex items-baseline gap-2">
                {/* Show the Fixed Price */}
                <p className="text-xl font-bold text-gray-900">{BOX_PRICE.toFixed(2)} DHS</p>
                
                {/* Optional: Show crossed-out real value if products are selected */}
                {selectedProducts.length > 0 && realValue > BOX_PRICE && (
                  <span className="text-sm text-gray-400 line-through">
                    {realValue.toFixed(0)} DHS
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddBoxToCart}
              disabled={selectedProducts.length !== BOX_LIMIT}
              className="rounded-md bg-yellow-700 px-6 py-3 font-bold text-white transition-colors hover:bg-yellow-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              Ajouter ({BOX_PRICE} DHS)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-32 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const isSelected = selectedProducts.find((p) => p.id === product.id)
          const isDisabled = !isSelected && selectedProducts.length >= BOX_LIMIT

          return (
            <div
              key={product.id}
              onClick={() => !isDisabled && toggleProduct(product)}
              className={`group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all
                ${isSelected 
                  ? 'border-yellow-700 bg-yellow-50 shadow-md' 
                  : 'border-transparent bg-white shadow-sm hover:border-yellow-200'}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors
                ${isSelected ? 'bg-yellow-700 text-white' : 'bg-gray-200 text-gray-400'}
              `}>
                {isSelected ? <Check size={18} /> : <Plus size={18} />}
              </div>

              <div className="relative h-64 w-full bg-gray-100">
                <Image
                  src={product.image_url || '/placeholder.png'}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                {/* Note: We still show the individual product price for information */}
                <p className="mt-2 font-medium text-gray-400">{product.price} DHS</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}