import { adminDb } from '@/lib/supabase-admin'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Printer } from 'lucide-react'

// --- Composant Client pour le bouton d'impression ---
// On le met ici pour simplifier, c'est un petit trick Next.js
import ClientPrintButton from './ClientPrintButton' 

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Sécurité : Vérifier le cookie Admin
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('admin_session')?.value === 'true'

  if (!isAdmin) {
    redirect('/admin')
  }

  // 2. Récupérer l'ID
  const { id } = await params

  // 3. Récupérer la commande
  const { data: order, error } = await adminDb
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('id', id)
    .single()

  if (error || !order) {
    notFound()
  }

  const address = order.shipping_address as any
  const date = new Date(order.created_at).toLocaleDateString('fr-FR')

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans text-black print:bg-white print:p-0">
      {/* Boutons de navigation (Cachés à l'impression) */}
      <div className="mx-auto mb-8 flex max-w-[210mm] justify-between print:hidden">
        <Link href="/admin" className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300">
          &larr; Retour
        </Link>
        <ClientPrintButton order={order} />      
        </div>

      {/* La Feuille A4 */}
      <div className="mx-auto max-w-[210mm] bg-white p-12 shadow-lg print:max-w-none print:shadow-none">
        
        {/* En-tête */}
        <div className="flex justify-between border-b pb-8">
          <div>
            <h1 className="text-3xl font-bold text-yellow-700">IH Cosmetics</h1>
            <p className="text-sm text-gray-500">Beauté Marocaine Biologique</p>
            <p className="mt-2 text-sm">Casablanca, Maroc</p>
            <p className="text-sm">contact@ihcosmetics.ma</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold uppercase text-gray-400">Facture</h2>
            <p className="mt-2">N° {order.id.substring(0, 8)}</p>
            <p>Date: {date}</p>
          </div>
        </div>

        {/* Infos Client */}
        <div className="mt-8 mb-12">
          <h3 className="mb-2 text-sm font-bold uppercase text-gray-500">Facturé à :</h3>
          <p className="font-bold">{address.name}</p>
          <p>{address.address}</p>
          <p>{address.city}, Maroc</p>
          <p>{address.phone}</p>
          <p>{address.email}</p>
        </div>

        {/* Table des produits */}
        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300 bg-gray-50">
              <th className="py-3 text-left text-sm font-bold uppercase text-gray-600">Description</th>
              <th className="py-3 text-right text-sm font-bold uppercase text-gray-600">Qté</th>
              <th className="py-3 text-right text-sm font-bold uppercase text-gray-600">Prix U.</th>
              <th className="py-3 text-right text-sm font-bold uppercase text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items.map((item: any) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-4">{item.products.name}</td>
                <td className="py-4 text-right">{item.quantity}</td>
                <td className="py-4 text-right">{item.unit_price_dhs.toFixed(2)}</td>
                <td className="py-4 text-right font-bold">
                  {(item.quantity * item.unit_price_dhs).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totaux */}
        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="flex justify-between border-b py-2">
              <span>Sous-total</span>
              <span>{order.total_dhs.toFixed(2)} DHS</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span>Livraison</span>
              <span>Gratuite</span>
            </div>
            <div className="flex justify-between py-4 text-xl font-bold">
              <span>Total</span>
              <span>{order.total_dhs.toFixed(2)} DHS</span>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div className="mt-12 border-t pt-8 text-center text-sm text-gray-500">
          <p>Merci pour votre confiance.</p>
        </div>

      </div>
    </div>
  )
}