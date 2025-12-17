'use client'

import { useCart } from '@/lib/store/cart-store'
import { Product } from '@/types/cart'
import { ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()

  const handleAdd = () => {
    addItem(product)
    toast.success('Produit ajouté au panier')
  }

  return (
    <button
      onClick={handleAdd}
      className="flex w-full items-center justify-center rounded-md bg-yellow-700 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      Ajouter au panier
    </button>
  )
}