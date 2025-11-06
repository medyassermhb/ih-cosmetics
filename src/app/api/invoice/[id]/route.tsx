// src/app/api/invoice/[id]/route.tsx
import { createServer } from '@/lib/supabase-server'
import { pdf } from '@react-pdf/renderer'
import { InvoiceDocument } from '@/components/invoice/InvoiceDocument'
import { Database } from '@/types/supabase'
// import React from 'react' // facultatif si JSX runtime auto est activé

// Types locaux
type ShippingAddress = { name: string; email: string; phone: string; address: string; city: string }
type Order = Database['public']['Tables']['orders']['Row'] & { shipping_address: ShippingAddress }
type Product = Database['public']['Tables']['products']['Row']
type OrderItem = Database['public']['Tables']['order_items']['Row'] & { products: Product }

export async function GET(
  request: Request,
  ctx: { params: Promise<{ id: string }> } // 👈 params est un Promise
) {
  const supabase = createServer()

  // ✅ Déballer params
  const { id } = await ctx.params
  if (!id) {
    return new Response('Requête invalide : id manquant', { status: 400 })
  }

  // 1) Auth utilisateur
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return new Response('Accès non autorisé', { status: 401 })
  }

  // 2) Récupérer la commande
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (orderError || !order) {
    return new Response('Commande non trouvée', { status: 404 })
  }

  // 3) Vérifier propriétaire OU admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && order.user_id !== user.id) {
    return new Response('Accès non autorisé', { status: 403 })
  }

  // 4) Récupérer les items
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      quantity,
      unit_price_dhs,
      products ( * )
    `)
    .eq('order_id', id)

  if (itemsError || !items) {
    return new Response('Erreur lors de la récupération des articles', { status: 500 })
  }

  // 5) Générer le PDF
  const typedOrder = order as Order
  const typedItems = items as OrderItem[]

  const stream = await pdf(<InvoiceDocument order={typedOrder} items={typedItems} />).toStream()

  // 6) Réponse PDF
  const headers = new Headers()
  headers.set('Content-Type', 'application/pdf')
  headers.set(
    'Content-Disposition',
    `attachment; filename="facture-${order.id.substring(0, 8)}.pdf"`
  )

  return new Response(stream, { headers })
}
