import { adminDb } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { 
  FileText, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock 
} from 'lucide-react'

export const metadata = {
  title: 'Commandes | Admin IH',
}

export const dynamic = 'force-dynamic'

// --- HELPERS ---
function formatDate(dateString: string | null) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

function sanitizePhone(phone: string) {
  if (!phone) return ''
  let p = phone.replace(/[^0-9]/g, '')
  if (p.startsWith('0')) p = '212' + p.substring(1)
  if (p.startsWith('212') && p.length === 12) return p
  return ''
}

// Status Configuration (Colors & Icons)
const getStatusConfig = (status: string) => {
  switch (status) {
    case 'received':
      return { label: 'Reçue', icon: Package, className: 'bg-gray-100 text-gray-700 border-gray-200' }
    case 'processing':
      return { label: 'En cours', icon: Clock, className: 'bg-blue-50 text-blue-700 border-blue-200' }
    case 'shipped':
      return { label: 'Expédiée', icon: Truck, className: 'bg-yellow-50 text-yellow-700 border-yellow-200' }
    case 'delivered':
      return { label: 'Livrée', icon: CheckCircle, className: 'bg-green-50 text-green-700 border-green-200' }
    case 'canceled':
      return { label: 'Annulée', icon: XCircle, className: 'bg-red-50 text-red-700 border-red-200' }
    default:
      return { label: status, icon: Package, className: 'bg-gray-100 text-gray-700' }
  }
}

// --- SERVER ACTION (Update Status) ---
async function updateStatusAction(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const status = formData.get('status') as string
  
  await adminDb.from('orders').update({ status }).eq('id', id)
  revalidatePath('/admin')
}

// --- MAIN PAGE COMPONENT ---
export default async function AdminOrdersPage() {
  // Fetch all orders with items and products
  const { data: orders } = await adminDb
    .from('orders')
    .select('*, order_items(*, products(*))')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h2>
        <p className="text-sm text-gray-500">Visualisez et gérez toutes les commandes clients.</p>
      </div>

      <div className="space-y-6">
        {orders?.map((order) => {
          const address = order.shipping_address as any
          const statusConfig = getStatusConfig(order.status)
          const StatusIcon = statusConfig.icon
          
          // --- WhatsApp Logic ---
          let whatsappUrl = null
          const cleanPhone = sanitizePhone(address?.phone)

          if (cleanPhone) {
             const shortId = order.id.substring(0, 8)
             const total = order.total_dhs.toFixed(2)
             
             const productList = order.order_items.map((item: any) => 
               `- ${item.quantity}x ${item.products?.name || 'Produit'}`
             ).join('\n')

             const msg = `Bonjour ${address.name}, nous confirmons votre commande N° ${shortId} :\n\n${productList}\n\nTotal : ${total} DHS.\n\nConfirmez-vous ces informations ? Merci, IH Cosmetics.`
             
             whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
          }
          // ---------------------

          return (
            <div key={order.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
              
              {/* Card Header */}
              <div className="flex flex-col justify-between gap-4 border-b border-gray-100 bg-gray-50/50 px-6 py-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900">#{order.id.substring(0, 8)}</h3>
                    <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusConfig.className}`}>
                      <StatusIcon size={14} />
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{formatDate(order.created_at)}</p>
                </div>
                
                {/* Status Updater */}
                <form action={updateStatusAction} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={order.id} />
                  <select 
                    name="status" 
                    defaultValue={order.status}
                    className="rounded-md border-gray-300 py-1.5 text-sm focus:border-yellow-500 focus:ring-yellow-500"
                  >
                    <option value="received">Reçue</option>
                    <option value="processing">En cours</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                    <option value="canceled">Annulée</option>
                  </select>
                  <button type="submit" className="rounded bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
                    OK
                  </button>
                </form>
              </div>

              {/* Card Body */}
              <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                
                {/* Client Details */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Client
                  </h4>
                  <div className="text-sm">
                    <p className="font-bold text-gray-900">{address.name}</p>
                    <p className="text-gray-600">{address.email}</p>
                    <p className="text-gray-600">{address.phone}</p>
                    <div className="mt-2 rounded bg-gray-50 p-2 text-gray-500 border border-gray-100">
                        {address.address}<br/>
                        {address.city}, Maroc
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-3">
                      {/* WhatsApp Button */}
                      {whatsappUrl ? (
                      <a 
                          href={whatsappUrl}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 rounded-md bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-200"
                      >
                          {/* WhatsApp Icon SVG */}
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-green-600"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                          WhatsApp
                      </a>
                      ) : (
                          <span className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-400">Tél. invalide</span>
                      )}

                      {/* Invoice Link */}
                      <Link 
                          href={`/admin/invoice/${order.id}`}
                          className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                      >
                          <FileText size={16} />
                          Facture
                      </Link>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Détails Panier
                  </h4>
                  <ul className="divide-y divide-gray-100 rounded-md border border-gray-100 bg-gray-50 px-4">
                    {order.order_items.map((item: any) => (
                      <li key={item.id} className="flex justify-between py-2 text-sm">
                        <span className="text-gray-700">
                          <span className="font-bold text-gray-900">{item.quantity}x</span> {item.products?.name || 'Produit supprimé'}
                        </span>
                        <span className="font-medium text-gray-900">{item.unit_price_dhs} DHS</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center justify-end gap-2 text-lg">
                    <span className="text-sm text-gray-500">Total:</span>
                    <span className="font-bold text-gray-900 text-yellow-700">{order.total_dhs.toFixed(2)} DHS</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}