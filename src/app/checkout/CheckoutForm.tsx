'use client'

import { useCart } from '@/lib/store/cart-store'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useTransition, useState } from 'react' // Added useState
import { useActionState } from 'react'
import { createOrder } from './actions'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

type FieldErrors = {
  email?: string[];
  name?: string[];
  phone?: string[];
  address?: string[];
  city?: string[];
};

const orderInitialState: { error?: string, errors?: FieldErrors, success?: boolean } = { 
  error: undefined, 
  errors: undefined, 
  success: false 
}

const MOROCCO_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kenitra",
  "Tetouan",
  "Safi",
  "Mohammedia",
  "El Jadida",
  "Beni Mellal",
  "Nador",
  "Taza",
  "Settat",
  "Autre ville" // Fallback
];

export default function CheckoutForm() {
  const router = useRouter()
  const [isOrderPending, startOrderTransition] = useTransition()
  const [orderState, orderAction] = useActionState(createOrder, orderInitialState)
  
  // State for City and Shipping Logic
  const [selectedCity, setSelectedCity] = useState('Casablanca')

  const { items, getCartTotal, getCartCount } = useCart()
  const cartTotal = getCartTotal()
  const cartCount = getCartCount()

  // --- LOGIC: Calculate Shipping ---
  // If Casablanca: 20 DHS, Else: 35 DHS
  const shippingCost = selectedCity === 'Casablanca' ? 20 : 35
  const finalTotal = cartTotal + shippingCost

  useEffect(() => {
    if (!isOrderPending && cartCount === 0) {
      router.push('/shop')
    }
  }, [cartCount, router, isOrderPending])

  useEffect(() => {
    if (orderState.error && !orderState.errors) {
      toast.error(orderState.error)
    }
  }, [orderState])

  const cartItemsForAction = items.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
  }))

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">Paiement</h1>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        
        {/* 1. Order Summary (Now includes Shipping) */}
        <div className="order-last rounded-lg bg-gray-50 p-6 lg:order-first">
          <h2 className="mb-6 text-2xl font-semibold">Résumé de la commande</h2>
           <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-4">
                <Image
                  src={item.product.image_url ?? '/placeholder.png'}
                  alt={item.product.name}
                  width={64}
                  height={64}
                  className="rounded-md object-cover"
                  unoptimized
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">
                    Qté: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  {(item.product.price * item.quantity).toFixed(2)} DHS
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-6 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span>{cartTotal.toFixed(2)} DHS</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Livraison ({selectedCity})</span>
              <span className="font-medium text-yellow-700">{shippingCost} DHS</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t mt-2">
              <span>Total à payer</span>
              <span>{finalTotal.toFixed(2)} DHS</span>
            </div>
          </div>
        </div>

        {/* 2. Delivery Form */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold">Informations de livraison</h2>
          <form
            action={(formData) => {
              // We append the calculated shipping cost to the form data safely
              formData.set('shippingCost', shippingCost.toString())
              startOrderTransition(() => orderAction(formData))
            }}
            className="space-y-6"
          >
            <input
              type="hidden"
              name="cartItems"
              value={JSON.stringify(cartItemsForAction)}
            />
            {/* Hidden input to ensure shipping cost is sent even if JS fails (fallback) */}
            <input type="hidden" name="shippingCost" value={shippingCost} />

            <div>
              <label htmlFor="email" className="block text-sm font-medium">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
              />
              {orderState.errors?.email && (
                <p className="mt-1 text-sm text-red-600">{orderState.errors.email[0]}</p>
              )}
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium">Nom complet</label>
              <input type="text" id="name" name="name" required className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50" />
              {orderState.errors?.name && (
                <p className="mt-1 text-sm text-red-600">{orderState.errors.name[0]}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium">Téléphone</label>
              <input type="tel" id="phone" name="phone" required className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50" />
              {orderState.errors?.phone && (
                <p className="mt-1 text-sm text-red-600">{orderState.errors.phone[0]}</p>
              )}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium">Adresse</label>
              <input type="text" id="address" name="address" required className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50" />
              {orderState.errors?.address && (
                <p className="mt-1 text-sm text-red-600">{orderState.errors.address[0]}</p>
              )}
            </div>

            {/* --- City Selection (Modified) --- */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium">Ville</label>
              <select
                id="city"
                name="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
              >
                {MOROCCO_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {orderState.errors?.city && (
                <p className="mt-1 text-sm text-red-600">{orderState.errors.city[0]}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Frais de livraison: {selectedCity === 'Casablanca' ? '20 DHS' : '35 DHS'}
              </p>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium">Pays</label>
              <input type="text" id="country" name="country" value="Maroc" readOnly className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 px-4 py-3 text-base shadow-sm" />
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold">Méthode de paiement</h3>
              <div className="mt-4 rounded-md border border-yellow-600 bg-beige-100 p-4">
                <p className="font-medium">Paiement à la livraison</p>
                <p className="text-sm">Payez en espèces à la livraison de votre commande.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isOrderPending || cartCount === 0}
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-yellow-700 px-6 py-3 text-white shadow-sm hover:bg-yellow-800
               disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isOrderPending ? (<Loader2 className="mr-2 h-5 w-5 animate-spin" />) : null}
              {isOrderPending ? 'Traitement...' : `Commander (${finalTotal.toFixed(2)} DHS)`}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}