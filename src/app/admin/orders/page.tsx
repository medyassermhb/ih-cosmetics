import { createServer } from '@/lib/supabase-server'
import { updateOrderStatus } from './actions'
import { Database } from '@/types/supabase'
import Link from 'next/link'

export const metadata = {
  title: 'Gérer les Commandes | IH Cosmetics',
}

// (Les helpers 'formatDate', 'getStatusBadge', 'translateStatus', 'sanitizePhoneNumber' restent les mêmes)
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
function getStatusBadge(status: string) {
  switch (status) {
    case 'processing': return 'bg-blue-100 text-blue-800'
    case 'shipped': return 'bg-yellow-100 text-yellow-800'
    case 'delivered': return 'bg-green-100 text-green-800'
    case 'canceled': return 'bg-red-100 text-red-800'
    case 'received':
    default: return 'bg-gray-100 text-gray-800'
  }
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

function sanitizePhoneNumber(phone: string): string | null {
  if (!phone) return null
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length === 10 && cleanPhone.startsWith('0')) {
    return '212' + cleanPhone.substring(1);
  }
  if (cleanPhone.startsWith('212') && cleanPhone.length === 12) {
    return cleanPhone;
  }
  return null
}

type ShippingAddress = {
  name: string
  email: string
  phone: string
  address: string
  city: string
}

// ... (tous les imports et helpers restent les mêmes)

export default async function AdminOrdersPage() {
  const supabase = createServer()
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <p className="text-red-500">Erreur: {error.message}</p>
  }

  const typedOrders = orders as (Database['public']['Tables']['orders']['Row'] & {
    shipping_address: ShippingAddress
  })[]

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">Toutes les commandes</h2>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {/* ... (les headers <th> sont les mêmes) ... */}
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Commande</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white">
            {typedOrders.map((order) => {
              const address = order.shipping_address
              const cleanPhone = sanitizePhoneNumber(address.phone)
              let whatsappUrl = null
              if (cleanPhone) {
                const shortOrderId = order.id.substring(0, 8);
                const totalPrice = order.total_dhs.toFixed(2);
                const message = `Bonjour ${address.name}, nous avons bien reçu votre commande (N° ${shortOrderId}) pour un total de ${totalPrice} DHS. Nous aimerions la confirmer avec vous. Merci, IH Cosmetics.`
                const encodedMessage = encodeURIComponent(message);
                whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
              }

              return (
                <tr key={order.id} className="bg-white">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    
                    {/* --- C'EST LE LIEN MIS À JOUR --- */}
                    <Link 
                      href={`/admin/orders/${order.id}`} // Changé de /account à /admin
                      className="text-yellow-700 hover:underline"
                    >
                      #{order.id.substring(0, 8)}
                    </Link>
                    {/* --- FIN DE LA MISE À JOUR --- */}

                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.created_at)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="font-medium text-gray-900">{address.name}</div>
                    <div className="text-gray-500">{address.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{order.total_dhs.toFixed(2)} DHS</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(order.status)}`}
                    >
                      {translateStatus(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <form action={updateOrderStatus} className="flex gap-2">
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
                        className="rounded-md bg-yellow-700 px-3 py-1.5 text-sm text-white hover:bg-yellow-800"
                      >
                        Mettre à jour
                      </button>
                    </form>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {whatsappUrl ? (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-green-600 hover:text-green-500"
                      >
                        WhatsApp
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Tél. invalide</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}