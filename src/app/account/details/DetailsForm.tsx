'use client'

import { useActionState, useEffect } from 'react'
import { Database } from '@/types/supabase'
import { updateDetails, updatePassword } from './actions'
import toast from 'react-hot-toast'

type Profile = Database['public']['Tables']['profiles']['Row'] & {
  address: string | null
  city: string | null
}

const initialState = { error: undefined, success: false, message: '' }

export default function DetailsForm({ profile }: { profile: Profile }) {
  const [detailsState, detailsAction] = useActionState(updateDetails, initialState)
  const [passwordState, passwordAction] = useActionState(updatePassword, initialState)

  // Show toasts on success/error
  useEffect(() => {
    if (detailsState.success) toast.success(detailsState.message)
    if (detailsState.error) toast.error("Erreur (profil), vérifiez les champs.")
  }, [detailsState])

  useEffect(() => {
    if (passwordState.success) toast.success(passwordState.message)
    if (passwordState.error) toast.error("Erreur (mot de passe), vérifiez les champs.")
  }, [passwordState])

  return (
    <div className="space-y-12">
      {/* Form 1: Profile Details */}
      <form action={detailsAction} className="space-y-6">
        <h2 className="text-2xl font-semibold">Mes informations</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium">Nom complet</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              defaultValue={profile.full_name || ''}
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium">Téléphone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={profile.phone || ''}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium">Adresse</label>
          <input
            type="text"
            id="address"
            name="address"
            defaultValue={profile.address || ''}
            className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium">Ville</label>
          <input
            type="text"
            id="city"
            name="city"
            defaultValue={profile.city || ''}
            className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="rounded-md border border-transparent bg-yellow-700 px-6 py-2 text-white shadow-sm hover:bg-yellow-800"
          >
            Enregistrer les informations
          </button>
        </div>
      </form>

      {/* Form 2: Change Password */}
      <form action={passwordAction} className="space-y-6 border-t pt-8">
        <h2 className="text-2xl font-semibold">Changer le mot de passe</h2>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">Nouveau mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="rounded-md border border-transparent bg-gray-800 px-6 py-2 text-white shadow-sm hover:bg-gray-700"
          >
            Changer le mot de passe
          </button>
        </div>
      </form>
    </div>
  )
}