import { createServer } from '@/lib/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Database } from '@/types/supabase'

export const metadata = {
  title: 'Mes Commandes | IH Cosmetics',
}

// Helper to format the date
function formatDate(dateString: string | null) {
  // Si dateString est null ou undefined, retourne un texte par défaut
  if (!dateString) {
    return 'Date inconnue';
  }
  
  // Sinon, formate la date
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Helper to style the status badge
function getStatusBadge(status: string) {
  switch (status) {
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    case 'shipped':
      return 'bg-yellow-100 text-yellow-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'canceled':
      return 'bg-red-100 text-red-800'
    case 'received':
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Helper to translate status
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

type Order = Database['public']['Tables']['orders']['Row']

export default async function MyOrdersPage() {
  const supabase = createServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // RLS (Row Level Security) automatically ensures
  // we can only fetch orders where user_id === auth.uid()
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return <p className="text-red-500">Erreur lors du chargement des commandes.</p>
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">Historique des commandes</h2>
      {orders.length === 0 ? (
        <p>Vous n'avez pas encore passé de commande.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order: Order) => (
            <div key={order.id} className="rounded-lg border p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">Commande #{order.id.substring(0, 8)}</h3>
                  <p className="text-sm text-gray-500">
                    Date : {formatDate(order.created_at)}
                  </p>
                </div>
                <div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {translateStatus(order.status)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{order.total_dhs.toFixed(2)} DHS</p>
                </div>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="font-medium text-yellow-700 hover:text-yellow-600"
                >
                  Voir les détails
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}