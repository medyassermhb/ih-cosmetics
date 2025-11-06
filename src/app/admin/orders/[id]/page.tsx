// src/app/admin/orders/[id]/page.tsx
import { createServer } from '@/lib/supabase-server'
import { updateOrderStatus } from '../actions' // Action du formulaire
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Database } from '@/types/supabase'

export const metadata = {
  title: 'Détails Commande | Admin',
}

// --- Helpers (copiés depuis la page de liste) ---
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}
function translateStatus(status: string) {
  const translations: { [key: string]: string } = {
    received: 'Reçue',
    processing: 'En cours',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    canceled: 'Annulée',
  }
  return translations[status] || status
}
const statusOptions = ['received', 'processing', 'shipped', 'delivered', 'canceled']
// --- Fin des Helpers ---

// Définir les types
type ShippingAddress = { name: string; email: string; phone: string; address: string; city: string }
type Order = Database['public']['Tables']['orders']['Row'] & { shipping_address: ShippingAddress }
type Product = Database['public']['Tables']['products']['Row']
type OrderItem = (Database['public']['Tables']['order_items']['Row'] & { products: Product })
type Profile = Database['public']['Tables']['profiles']['Row']

export default async function AdminOrderDetailPage(
  { params }: { params: Promise<{ id: string }> } // 👈 params est maintenant un Promise
) {
  const supabase = createServer()

  // 👇 On attend params (sinon params.id est undefined → 22P02 côté Supabase)
  const { id } = await params
  if (!id) notFound()

  // 1. Récupérer la commande
  // (La RLS garantit que seul un admin peut faire cela)
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (orderError || !order) {
    console.error('Error fetching order:', orderError)
    notFound() // Affiche une page 404
  }
  const typedOrder = order as Order

  // 2. Récupérer les articles de la commande
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('quantity, unit_price_dhs, products ( * )')
    .eq('order_id', id)

  if (itemsError) return <p>Erreur lors du chargement des articles.</p>
  const orderItems = items as OrderItem[]

  // 3. Récupérer le profil du client (s'il existe)
  let customerProfile: Profile | null = null
  if (typedOrder.user_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', typedOrder.user_id)
      .single()
    customerProfile = profile
  }

  const address = typedOrder.shipping_address

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-6 inline-block text-sm text-yellow-700 hover:text-yellow-600"
      >
        &larr; Retour à toutes les commandes
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Commande #{id.substring(0, 8)}</h2>
        <span className="text-lg font-medium">
          Total: {typedOrder.total_dhs.toFixed(2)} DHS
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Colonne principale : Articles */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-white">
            <h3 className="border-b px-6 py-4 text-lg font-semibold">Articles</h3>
            <ul className="divide-y divide-gray-200">
              {orderItems.map((item) => (
                <li key={item.products.id} className="flex gap-4 p-4">
                  <Image
                    src={item.products.image_url ?? '/placeholder.png'}
                    alt={item.products.name}
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                    unoptimized
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.products.name}</h4>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x {item.unit_price_dhs.toFixed(2)} DHS
                    </p>
                  </div>
                  <p className="font-semibold">
                    {(item.quantity * item.unit_price_dhs).toFixed(2)} DHS
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Colonne latérale : Infos & Actions */}
        <div className="space-y-6">
          {/* Action : Mettre à jour le statut */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Statut de la commande</h3>
            <form action={updateOrderStatus} className="flex flex-col gap-4">
              <input type="hidden" name="orderId" value={order.id} />
              <select
                name="status"
                defaultValue={order.status}
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {translateStatus(status)}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full rounded-md bg-yellow-700 px-4 py-2 text-white hover:bg-yellow-800"
              >
                Mettre à jour le statut
              </button>
            </form>
          </div>

          {/* Info Client */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Client</h3>
            <p className="font-medium">{address.name}</p>
            <p className="text-sm text-gray-600">{address.email}</p>
            <p className="text-sm text-gray-600">{address.phone}</p>
            {customerProfile && (
              <p className="mt-2 text-xs text-blue-600">
                (Client enregistré - ID: {customerProfile.id.substring(0, 8)})
              </p>
            )}
            {!customerProfile && (
              <p className="mt-2 text-xs text-gray-500">(Commande en tant qu&apos;invité)</p>
            )}
          </div>

          {/* Adresse de livraison */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Adresse de livraison</h3>
            <p className="font-medium">{address.name}</p>
            <p className="text-sm text-gray-600">{address.address}</p>
            <p className="text-sm text-gray-600">{address.city}, Maroc</p>
          </div>
        </div>
      </div>
    </div>
  )
}
