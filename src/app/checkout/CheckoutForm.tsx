'use client'

import { useCart } from '@/lib/store/cart-store'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { useActionState } from 'react'
import { createOrder, inlineLogin, inlineSignup, inlineLogout } from './actions'
import { Loader2, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

// --- START OF FIX ---
// Update initial state types to hold field errors
const loginInitialState = { error: '', success: false }
const signupInitialState = { error: '', message: '', success: false }
const logoutInitialState = { success: false }

type FieldErrors = {
  email?: string[];
  name?: string[];
  phone?: string[];
  address?: string[];
  city?: string[];
  country?: string[];
};

const orderInitialState: { error?: string, errors?: FieldErrors, success?: boolean } = { 
  error: undefined, 
  errors: undefined, 
  success: false 
}
// --- END OF FIX ---

export default function CheckoutForm({ userEmail }: { userEmail: string | null }) {
  const router = useRouter()
  
  const [authView, setAuthView] = useState(userEmail ? 'loggedIn' : 'guest')
  
  const [isLoginPending, startLoginTransition] = useTransition()
  const [isSignupPending, startSignupTransition] = useTransition()
  const [isOrderPending, startOrderTransition] = useTransition()
  const [isLogoutPending, startLogoutTransition] = useTransition()

  const [loginState, loginAction] = useActionState(inlineLogin, loginInitialState)
  const [signupState, signupAction] = useActionState(inlineSignup, signupInitialState)
  const [orderState, orderAction] = useActionState(createOrder, orderInitialState)
  const [logoutState, logoutAction] = useActionState(inlineLogout, logoutInitialState)

  const { items, getCartTotal, getCartCount } = useCart()
  const cartTotal = getCartTotal()
  const cartCount = getCartCount()

  // Effect to handle router refresh on login/logout
  useEffect(() => {
    if (loginState.success || logoutState.success) {
      router.refresh()
    }
  }, [loginState.success, logoutState.success, router])

  // Effect to redirect if cart is empty
  useEffect(() => {
    if (!isOrderPending && cartCount === 0) {
      router.push('/shop')
    }
  }, [cartCount, router, isOrderPending])

  // Effect to show order errors (now only shows generic errors)
  useEffect(() => {
    // Only show a toast if it's a generic error, not a field-specific one
    if (orderState.error && !orderState.errors) {
      toast.error(orderState.error)
    }
  }, [orderState])

  // Effect to show signup success/error
  useEffect(() => {
    if (signupState.success) {
      toast.success(signupState.message)
    } else if (signupState.error) {
      toast.error(signupState.error)
    }
  }, [signupState])

  const cartItemsForAction = items.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
  }))

  // Helper to render the Auth section (no change)
  const renderAuthSection = () => {
    if (authView === 'loggedIn') {
      return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-700">
            Connecté en tant que: <span className="font-medium">{userEmail}</span>
          </p>
          <form action={() => startLogoutTransition(logoutAction)}>
            <button type="submit" disabled={isLogoutPending} className="flex items-center text-sm font-medium text-gray-700 hover:text-yellow-600 disabled:opacity-50">
              {isLogoutPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <LogOut size={16} className="mr-1" />}
              Déconnexion
            </button>
          </form>
        </div>
      )
    }
    return (
      <div>
        <div className="mb-4 flex border-b">
          <button onClick={() => setAuthView('guest')} className={`flex-1 py-2 text-sm font-medium ${authView === 'guest' ? 'border-b-2 border-yellow-700 text-yellow-700' : 'text-gray-500'}`}>
            Continuer en tant qu'invité
          </button>
          <button onClick={() => setAuthView('login')} className={`flex-1 py-2 text-sm font-medium ${authView === 'login' ? 'border-b-2 border-yellow-700 text-yellow-700' : 'text-gray-500'}`}>
            Se connecter
          </button>
          <button onClick={() => setAuthView('signup')} className={`flex-1 py-2 text-sm font-medium ${authView === 'signup' ? 'border-b-2 border-yellow-700 text-yellow-700' : 'text-gray-500'}`}>
            S'inscrire
          </button>
        </div>
        {authView === 'login' && (
          <form action={() => startLoginTransition(loginAction)} className="space-y-4">
            <input type="email" name="email" placeholder="E-mail" required className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50" />
            <input type="password" name="password" placeholder="Mot de passe" required className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50" />
            {loginState.error && <p className="text-sm text-red-600">{loginState.error}</p>}
            <button type="submit" disabled={isLoginPending} className="flex w-full items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50">
              {isLoginPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Se connecter
            </button>
          </form>
        )}
        {authView === 'signup' && (
          <form action={() => startSignupTransition(signupAction)} className="space-y-4">
            <input type="email" name="email" placeholder="E-mail" required className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50" />
            <input type="password" name="password" placeholder="Mot de passe (min. 6 caractères)" required className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50" />
            <button type="submit" disabled={isSignupPending} className="flex w-full items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50">
              {isSignupPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer un compte
            </button>
          </form>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">Paiement</h1>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Order Summary (no change) */}
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
          <div className="mt-6 border-t pt-6">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{cartTotal.toFixed(2)} DHS</span>
            </div>
          </div>
        </div>

        {/* Shipping Form Side */}
        <div>
          <div className="mb-6 rounded-lg border bg-white p-4">
            <h2 className="mb-3 text-lg font-medium">Compte</h2>
            {renderAuthSection()}
          </div>

          <h2 className="mb-6 text-2xl font-semibold">Informations de livraison</h2>
          <form
            action={(formData) => {
              startOrderTransition(() => orderAction(formData))
            }}
            className="space-y-6"
          >
            <input
              type="hidden"
              name="cartItems"
              value={JSON.stringify(cartItemsForAction)}
            />

            {/* --- START OF FORM FIXES --- */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={userEmail || ''}
                readOnly={!!userEmail}
                disabled={!!userEmail}
                required
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50 disabled:bg-gray-100 disabled:text-gray-500"
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
            <div>
              <label htmlFor="city" className="block text-sm font-medium">Ville</label>
              <input type="text" id="city" name="city" required className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50" />
              {orderState.errors?.city && (
                <p className="mt-1 text-sm text-red-600">{orderState.errors.city[0]}</p>
              )}
            </div>
            {/* --- END OF FORM FIXES --- */}
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium">Pays</label>
              <input type="text" id="country" name="country" value="Morocco" readOnly className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm" />
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
              {isOrderPending ? 'Traitement...' : 'Passer la commande'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}