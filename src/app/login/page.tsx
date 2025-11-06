'use client'

import { login } from '@/app/auth/actions'
import Link from 'next/link'
import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation' // <-- 1. Import this

const initialState = { error: '' }

export default function LoginPage() {
  const [state, formAction] = useActionState(login, initialState)
  
  // --- START OF CHANGES ---
  // 2. Get the 'redirectTo' param from the URL
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo')
  // --- END OF CHANGES ---

  return (
    <div className="container mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-center text-3xl font-bold">Se connecter</h1>
      <form action={formAction} className="space-y-6">
        {/* --- START OF CHANGES --- */}
        {/* 3. Add the hidden field to the form */}
        <input type="hidden" name="redirectTo" value={redirectTo || ''} />
        {/* --- END OF CHANGES --- */}

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
            autoComplete="current-password"
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
          Se connecter
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        Pas encore de compte ?{' '}
        <Link href="/signup" className="font-medium text-yellow-700 hover:text-yellow-600">
          S'inscrire
        </Link>
      </p>
    </div>
  )
}