'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { addProduct } from '../actions'
import { Loader2 } from 'lucide-react'

// Initialize Supabase Client for Client-side Upload
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AddProductPage() {
  const [loading, setLoading] = useState(false)
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const imageFile = formData.get('image') as File
    
    try {
      let image_url = ''

      // 1. Upload Image Directly to Supabase (Bypasses Vercel 4.5MB Limit)
      if (imageFile && imageFile.size > 0) {
        // Sanitize filename
        const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filename, imageFile)

        if (error) throw new Error(`Upload failed: ${error.message}`)

        // Get Public URL
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filename)
          
        image_url = publicUrlData.publicUrl
      }

      // 2. Append the URL to FormData and remove the raw file
      // We pass the URL string to the server action instead of the file
      formData.set('image_url', image_url)
      formData.delete('image') // Don't send the file to Vercel!

      // 3. Call Server Action
      await addProduct(formData)

    } catch (error) {
      console.error(error)
      alert("Erreur lors de l'ajout du produit. Vérifiez la console.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Ajouter un produit</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow-sm rounded-lg border">
        
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Image du produit</label>
          <input 
            type="file" 
            name="image" 
            accept="image/*"
            required
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-yellow-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-yellow-700 hover:file:bg-yellow-100"
          />
        </div>

        {/* Other Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input name="name" type="text" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prix (DHS)</label>
            <input name="price" type="number" step="0.01" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Catégorie</label>
            <select name="category" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500">
              <option value="perfume">Parfum</option>
              <option value="gommage">Gommage</option>
              <option value="deodorant">Déodorant</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Genre</label>
            <select name="gender" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500">
              <option value="unisex">Unisexe</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" rows={4} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"></textarea>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="rounded-md bg-yellow-700 px-6 py-2 text-white hover:bg-yellow-800 disabled:opacity-50 flex items-center"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  )
}