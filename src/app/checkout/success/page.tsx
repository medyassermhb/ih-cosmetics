'use client'

import { useCart } from '@/lib/store/cart-store'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
// Import our new component
import { DynamicAccountLink } from '@/components/global/DynamicAccountLink'

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  // Clear the cart when this page loads
  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
      <CheckCircle size={64} className="mx-auto mb-6 text-green-500" />
      <h1 className="mb-4 text-3xl font-bold">Merci pour votre commande !</h1>
      <p className="mb-6 text-lg text-gray-700">
        Votre commande (N° {orderId}) a été reçue et est en cours de traitement.
      </p>
      <p className="mb-8">
        Vous recevrez bientôt un e-mail de confirmation.
      </p>

      {/* --- THIS IS THE FIX --- */}
      <DynamicAccountLink />
      {/* ----------------------- */}

      <Link
        href="/shop"
        className="rounded-md bg-gray-100 px-6 py-3 text-gray-700 hover:bg-gray-200"
      >
        Continuer vos achats
      </Link>
    </div>
  )
}