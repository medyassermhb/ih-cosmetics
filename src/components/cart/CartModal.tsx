'use client'

import { useCart } from '@/lib/store/cart-store'
import { X, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useState, useEffect } from 'react' // <-- Import useState/useEffect

const CartModal = () => {
  const {
    items,
    isOpen,
    closeModal,
    removeItem,
    updateQuantity,
    getCartCount,
    getCartTotal,
  } = useCart()

  // 1. Create a state to track mounting
  const [isMounted, setIsMounted] = useState(false)

  // 2. When the component mounts, set the state to true
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 3. Get the real cart data
  const cartCount = getCartCount()
  const cartTotal = getCartTotal()

  return (
    <Fragment>
      {/* 1. Backdrop Overlay */}
      <div
        onClick={closeModal}
        className={`fixed inset-0 z-[99] bg-black/50 transition-opacity
          ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      {/* 2. Cart Modal */}
      <div
        className={`fixed right-0 top-0 z-[100] h-full w-full max-w-md transform bg-white shadow-xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-xl font-semibold">
              {/* 4. THE FIX: Only show real count when mounted */}
              Panier ({isMounted ? cartCount : 0})
            </h2>
            <button onClick={closeModal} aria-label="Fermer le panier">
              <X size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* 5. THE FIX: Also wait for mount to show items */}
            {!isMounted ? (
              <p className="text-center text-gray-500">Chargement...</p>
            ) : cartCount === 0 ? (
              <p className="text-center text-gray-500">Votre panier est vide.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.product.id} className="flex gap-4 py-4">
                    <Image
                      src={item.product.image_url ?? '/placeholder.png'}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                      unoptimized // Keep this
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.product.price} DHS
                      </p>
                      {/* Quantity Selector */}
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          className="rounded-md border p-1.5"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus size={16} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          className="rounded-md border p-1.5"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-600"
                      aria-label="Supprimer l'article"
                    >
                      <Trash2 size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="mb-4 flex justify-between font-semibold">
              <span>Sous-total</span>
              {/* 6. THE FIX: Wait for mount to show total */}
              <span>{isMounted ? cartTotal.toFixed(2) : '0.00'} DHS</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeModal}
              className={`block w-full rounded-md bg-yellow-700 p-3 text-center text-white
                hover:bg-yellow-800
                ${
                  cartCount === 0 || !isMounted
                    ? 'cursor-not-allowed opacity-50'
                    : ''
                }`}
              aria-disabled={cartCount === 0 || !isMounted}
            >
              Passer à la caisse
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default CartModal