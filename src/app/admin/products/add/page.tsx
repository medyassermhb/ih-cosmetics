import { addProduct } from '../actions'

export default function AddProductPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Ajouter un produit</h2>
      
      <form action={addProduct} className="space-y-6 bg-white p-6 shadow-sm rounded-lg border">
        
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
          <button type="submit" className="rounded-md bg-yellow-700 px-6 py-2 text-white hover:bg-yellow-800">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  )
}