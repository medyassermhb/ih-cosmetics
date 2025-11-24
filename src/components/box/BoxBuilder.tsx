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

export default function BoxBuilder({ products }: BoxBuilderProps) {
  // État pour stocker les produits sélectionnés
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const { addItem } = useCart()

  const BOX_LIMIT = 3 // Limite de 3 produits

  // Gérer la sélection
  const toggleProduct = (product: Product) => {
    const isSelected = selectedProducts.find((p) => p.id === product.id)

    if (isSelected) {
      // Si déjà sélectionné, on le retire
      setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id))
    } else {
      // Si pas sélectionné
      if (selectedProducts.length >= BOX_LIMIT) {
        toast.error(`Vous ne pouvez choisir que ${BOX_LIMIT} produits.`)
        return
      }
      setSelectedProducts((prev) => [...prev, product])
    }
  }

  // Ajouter tout le coffret au panier
  const handleAddBoxToCart = () => {
    if (selectedProducts.length !== BOX_LIMIT) {
      toast.error(`Veuillez sélectionner ${BOX_LIMIT} produits pour valider le coffret.`)
      return
    }

    // Ajouter chaque produit au panier
    selectedProducts.forEach((product) => {
      addItem(product)
    })

    toast.success('Coffret ajouté au panier !')
    // Optionnel : Vider la sélection après l'ajout
    setSelectedProducts([])
  }

  // Calcul du total actuel
  const currentTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0)

  return (
    <div>
      {/* Barre de progression flottante en bas (Mobile & Desktop) */}
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
          
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-gray-500">Valeur totale</p>
              <p className="font-bold">{currentTotal.toFixed(2)} DHS</p>
            </div>
            <button
              onClick={handleAddBoxToCart}
              disabled={selectedProducts.length !== BOX_LIMIT}
              className="rounded-md bg-yellow-700 px-6 py-3 font-bold text-white transition-colors hover:bg-yellow-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>

      {/* Grille de produits */}
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
              {/* Indicateur de sélection */}
              <div className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors
                ${isSelected ? 'bg-yellow-700 text-white' : 'bg-gray-200 text-gray-400'}
              `}>
                {isSelected ? <Check size={18} /> : <Plus size={18} />}
              </div>

              <div className="aspect-h-4 aspect-w-3 relative bg-gray-200">
                <Image
                  src={product.image_url || '/placeholder.png'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                <p className="mt-2 font-medium text-yellow-700">{product.price} DHS</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}