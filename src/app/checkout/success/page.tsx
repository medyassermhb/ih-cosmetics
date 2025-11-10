'use client'

import { useCart } from '@/lib/store/cart-store'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react' // Importer Suspense
import { CheckCircle } from 'lucide-react'

// --- DÉBUT DE LA CORRECTION ---
// Cette fonction enveloppe notre logique
// pour que Suspense puisse la gérer.
function SuccessContent() {
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  // Vider le panier
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
      <Link
        href="/shop"
        className="rounded-md bg-yellow-700 px-6 py-3 text-white shadow-sm hover:bg-yellow-800"
      >
        Continuer vos achats
      </Link>
    </div>
  )
}

// L'exportation par défaut enveloppe maintenant
// le contenu dans une Suspense Boundary.
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <SuccessContent />
    </Suspense>
  )
}
// --- FIN DE LA CORRECTION ---