'use client'

import { useCart } from '@/lib/store/cart-store'
import { ShoppingBag } from 'lucide-react'
import { useState, useEffect } from 'react' // Import useState and useEffect

export function CartIcon() {
  const { openModal, getCartCount } = useCart()
  
  // 1. Create a state to track if the component is mounted
  const [isMounted, setIsMounted] = useState(false)

  // 2. When the component mounts, set the state to true
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 3. Get the real cart count from the store
  const cartCount = getCartCount()

  return (
    <button
      onClick={openModal}
      aria-label="Ouvrir le panier"
      className="flex items-center gap-1 text-gray-600 hover:text-yellow-600"
    >
      <ShoppingBag size={20} />
      
      {/* 4. The Fix:
        - If not mounted, render '0' (to match the server).
        - If mounted, render the *real* cartCount.
      */}
      <span className="text-sm font-medium">
        ({isMounted ? cartCount : 0})
      </span>
    </button>
  )
}