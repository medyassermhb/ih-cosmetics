'use client'

import { signup } from '@/app/auth/actions'
import Link from 'next/link'
// Import the new hook from 'react'
import { useActionState } from 'react'

const initialState = { error: '', success: false, message: '' }

export default function SignupPage() {
  // Use the new hook
  const [state, formAction] = useActionState(signup, initialState)

  return (
    <div className="container mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-center text-3xl font-bold">Créer un compte</h1>
      
      {state.success ? (
        <div className="rounded-md bg-green-50 p-4 text-green-700">
          <h3 className="font-bold">Vérifiez vos e-mails !</h3>
          <p>{state.message}</p>
        </div>
      ) : (
        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Adresse e-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-md border border-transparent bg-yellow-700 px-6 py-3 text-white shadow-sm hover:bg-yellow-800"
          >
            S'inscrire
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm">
        Déjà un compte ?{' '}
        <Link href="/login" className="font-medium text-yellow-700 hover:text-yellow-600">
          Se connecter
        </Link>
      </p>
    </div>
  )
}