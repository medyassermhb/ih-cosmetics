import { createServer } from '@/lib/supabase-server'
import { type Product } from '@/types/cart'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Gérer les Produits | IH Cosmetics',
}

export default async function AdminProductsPage() {
  const supabase = createServer()
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <p className="text-red-500">Erreur: {error.message}</p>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Tous les produits</h2>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-yellow-700 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-800"
        >
          Ajouter un produit
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Prix</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Catégorie</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Genre</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white">
            {products.map((product: Product) => (
              <tr key={product.id} className="bg-white">
                <td className="px-6 py-4">
                  <Image
                    src={product.image_url ?? '/placeholder.png'}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                    unoptimized
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.price} DHS</td>
                <td className="px-6 py-4 text-sm text-gray-500 capitalize">{product.category}</td>
                <td className="px-6 py-4 text-sm text-gray-500 capitalize">{product.gender}</td>
                <td className="px-6 py-4 text-right text-sm">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="font-medium text-yellow-700 hover:text-yellow-600"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}