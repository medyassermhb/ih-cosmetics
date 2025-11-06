'use client'

import { useActionState, useEffect } from 'react'
import { type Product } from '@/types/cart'
import { createProduct, updateProduct, deleteProduct } from './actions'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

type ProductFormProps = {
  product?: Product // 'product' est optionnel. S'il existe, c'est une modification.
}

type FormState = {
  error?: string
  errors?: {
    name?: string[]
    description?: string[]
    price?: string[]
    image_url?: string[]
    category?: string[]
    gender?: string[]
  }
}

const initialState: FormState = {}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [formState, formAction] = useActionState(
    product ? updateProduct : createProduct,
    initialState
  )

  useEffect(() => {
    if (formState.error && !formState.errors) {
      toast.error(formState.error)
    }
  }, [formState])

  return (
    <div className="space-y-8">
      <form action={formAction} className="space-y-6">
        {/* Si c'est un formulaire de modification, inclure l'ID */}
        {product && <input type="hidden" name="id" value={product.id} />}

        <div>
          <label htmlFor="name" className="block text-sm font-medium">Nom du produit</label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={product?.name || ''}
            required
            className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
          />
          {formState.errors?.name && <p className="mt-1 text-sm text-red-600">{formState.errors.name[0]}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={product?.description || ''}
            required
            className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
          />
          {formState.errors?.description && <p className="mt-1 text-sm text-red-600">{formState.errors.description[0]}</p>}
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="block text-sm font-medium">Prix (DHS)</label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              defaultValue={product?.price || ''}
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
            />
            {formState.errors?.price && <p className="mt-1 text-sm text-red-600">{formState.errors.price[0]}</p>}
          </div>
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium">URL de l'image</label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              defaultValue={product?.image_url || ''}
              required
              placeholder="https://..."
              className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
            />
            {formState.errors?.image_url && <p className="mt-1 text-sm text-red-600">{formState.errors.image_url[0]}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="block text-sm font-medium">Catégorie</label>
            <select
              id="category"
              name="category"
              defaultValue={product?.category || 'perfume'}
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
            >
              <option value="perfume">Parfum</option>
              <option value="gommage">Gommage</option>
              <option value="deodorant">Déodorant</option>
            </select>
            {formState.errors?.category && <p className="mt-1 text-sm text-red-600">{formState.errors.category[0]}</p>}
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium">Genre</label>
            <select
              id="gender"
              name="gender"
              defaultValue={product?.gender || 'unisex'}
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
            >
              <option value="unisex">Unisexe</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
            {formState.errors?.gender && <p className="mt-1 text-sm text-red-600">{formState.errors.gender[0]}</p>}
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="rounded-md border border-transparent bg-yellow-700 px-6 py-2 text-white shadow-sm hover:bg-yellow-800"
          >
            {product ? 'Mettre à jour le produit' : 'Créer le produit'}
          </button>
        </div>
      </form>

      {/* Formulaire de suppression (uniquement pour la modification) */}
      {product && (
        <form 
          action={async (formData: FormData) => {
            if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.")) {
              const result = await deleteProduct(formData);
              if (result?.error) {
                toast.error(result.error);
              } else {
                toast.success("Produit supprimé");
                router.push('/admin/products');
              }
            }
          }}
          className="border-t border-red-300 pt-6"
        >
          <input type="hidden" name="id" value={product.id} />
          <h3 className="text-lg font-medium text-red-700">Zone de danger</h3>
          <p className="mt-1 text-sm text-gray-600">
            La suppression d'un produit est définitive.
          </p>
          <button
            type="submit"
            className="mt-4 rounded-md border border-red-600 px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50"
          >
            Supprimer ce produit
          </button>
        </form>
      )}
    </div>
  )
}