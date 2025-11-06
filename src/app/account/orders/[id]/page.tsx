// src/app/account/orders/[id]/page.tsx
import { createServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Download } from 'lucide-react'

// FORCER LE RENDU DYNAMIQUE (correction du bug précédent)
export const revalidate = 0

export const metadata = {
  title: 'Détails de la commande | IH Cosmetics',
}

type OrderDetailPageProps = {
  params: Promise<{ id: string }> // 👈 params est désormais un Promise
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
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

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const supabase = createServer()

  // ✅ Déballer params (sinon params.id est undefined → 22P02 côté Supabase)
  const { id } = await params
  if (!id) redirect('/account/orders')

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !order) {
    console.error('Error fetching order:', error)
    return <p>Commande non trouvée ou accès non autorisé.</p>
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      quantity,
      unit_price_dhs,
      products (
        id,
        name,
        image_url
      )
    `)
    .eq('order_id', id)

  if (itemsError) {
    return <p>Erreur lors du chargement des articles de la commande.</p>
  }

  const orderItems = (items ?? []) as Array<{
    quantity: number
    unit_price_dhs: number
    products: { id: string; name: string; image_url: string | null }
  }>

  const address = order.shipping_address as {
    name: string
    phone: string
    address: string
    city: string
  }

  return (
    <div>
      <Link
        href="/account/orders"
        className="mb-6 inline-block text-sm text-yellow-700 hover:text-yellow-600"
      >
        &larr; Retour à la liste des commandes
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Détails de la commande #{id.substring(0, 8)}</h2>
        <span className="font-medium">Status: {translateStatus(order.status)}</span>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Order Items */}
        <div className="md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold">Articles</h3>
          <ul className="divide-y divide-gray-200 rounded-lg border">
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

        {/* Summary & Address */}
        <div>
          {/* Total */}
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="mb-4 text-lg font-semibold">Résumé</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{order.total_dhs.toFixed(2)} DHS</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>Gratuite</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>Total</span>
                <span>{order.total_dhs.toFixed(2)} DHS</span>
              </div>
            </div>
          </div>

          {/* --- Bouton de téléchargement facture --- */}
          <div className="mt-6">
            <Link
              href={`/api/invoice/${order.id}`}
              target="_blank"
              className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <Download size={20} className="mr-2" />
              Télécharger la facture
            </Link>
          </div>

          {/* Adresse */}
          <div className="mt-6">
            <h3 className="mb-4 text-lg font-semibold">Adresse de livraison</h3>
            <div className="rounded-lg border p-4">
              <p className="font-medium">{address.name}</p>
              <p>{address.address}</p>
              <p>{address.city}</p>
              <p>{address.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
