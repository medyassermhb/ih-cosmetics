import { adminDb } from '@/lib/supabase-admin'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Trash2 } from 'lucide-react'
import { deleteProduct } from './actions'

export const dynamic = 'force-dynamic'

export default async function AdminProducts() {
  const { data: products } = await adminDb
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mes Produits</h2>
        <Link 
          href="/admin/products/add" 
          className="flex items-center rounded-md bg-yellow-700 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-800"
        >
          <Plus size={16} className="mr-2" /> Ajouter
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <div key={product.id} className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <div className="relative h-48 w-full bg-gray-100">
              <Image
                src={product.image_url || '/placeholder.png'}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category} / {product.gender}</p>
              <p className="mt-2 font-bold text-yellow-700">{product.price} DHS</p>
              
              <form action={deleteProduct} className="mt-4 flex justify-end">
                <input type="hidden" name="id" value={product.id} />
                <button 
                  type="submit" 
                  className="flex items-center text-sm text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} className="mr-1" /> Supprimer
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}