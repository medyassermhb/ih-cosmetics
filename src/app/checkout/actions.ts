'use server'

import { createServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import * as nodemailer from 'nodemailer'

// ... (imports et schémas inchangés)

// Mettre à jour le schéma pour accepter childProductIds
const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  childProductIds: z.array(z.string()).optional(), // <-- NOUVEAU
  customDescription: z.string().optional()         // <-- NOUVEAU
})

export async function createOrder(prevState: any, formData: FormData): Promise<any> {
  const supabase = createServer()
  
  // ... (Récupération shippingData et validation shippingSchema inchangées) ...
  // Copiez le code de validation shipping existant ici...
  const shippingData = {
    email: formData.get('email'),
    name: formData.get('name'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    city: formData.get('city'),
    country: formData.get('country'),
  }
  const validatedFields = shippingSchema.safeParse(shippingData)
  if (!validatedFields.success) {
    return { error: 'Formulaire invalide', errors: validatedFields.error.flatten().fieldErrors }
  }
  const orderEmail = validatedFields.data.email

  // --- NOUVELLE LOGIQUE DE VALIDATION DES PRIX ---
  const cartItemsPayload = formData.get('cartItems') as string
  if (!cartItemsPayload) return { error: 'Panier vide' }

  let clientCartItems: z.infer<typeof cartItemSchema>[]
  try {
    clientCartItems = JSON.parse(cartItemsPayload)
  } catch (e) { return { error: 'Erreur panier' } }

  // 1. Collecter TOUS les IDs (produits normaux + contenus des coffrets)
  let allProductIds: string[] = []
  clientCartItems.forEach(item => {
    if (item.childProductIds && item.childProductIds.length > 0) {
      // C'est un coffret : on vérifie les produits à l'intérieur
      allProductIds.push(...item.childProductIds)
    } else {
      // C'est un produit normal
      allProductIds.push(item.productId)
    }
  })

  // 2. Récupérer les vrais prix depuis la BDD
  const { data: products, error: pError } = await supabase
    .from('products')
    .select('id, price, name, image_url')
    .in('id', allProductIds)

  if (pError || !products) return { error: 'Erreur produits' }

  // 3. Calculer le total et préparer les items
  let totalDHS = 0
  const orderItemsData = []

  for (const item of clientCartItems) {
    if (item.childProductIds && item.childProductIds.length > 0) {
      // --- C'EST UN COFFRET ---
      // On doit recréer le prix du coffret en additionnant ses composants
      let boxPrice = 0
      
      // On ajoute CHAQUE sous-produit comme une ligne de commande individuelle
      // pour que le stock et les stats soient corrects
      for (const childId of item.childProductIds) {
        const realProduct = products.find(p => p.id === childId)
        if (!realProduct) return { error: `Produit introuvable dans le coffret` }
        
        boxPrice += realProduct.price
        
        // On ajoute l'article individuel à la commande
        orderItemsData.push({
          product_id: realProduct.id,
          quantity: item.quantity, // Si j'ai pris 2 coffrets, j'ai pris 2x ce parfum
          unit_price_dhs: realProduct.price
        })
      }
      totalDHS += boxPrice * item.quantity

    } else {
      // --- C'EST UN PRODUIT NORMAL ---
      const realProduct = products.find(p => p.id === item.productId)
      if (!realProduct) return { error: `Produit ${item.productId} introuvable` }
      
      totalDHS += realProduct.price * item.quantity
      orderItemsData.push({
        product_id: realProduct.id,
        quantity: item.quantity,
        unit_price_dhs: realProduct.price
      })
    }
  }
  // --- FIN DE LA NOUVELLE LOGIQUE ---

  // ... (Le reste : Insertion Order, Order Items, Email, Redirect est inchangé) ...
  // Copiez le reste de votre fonction createOrder ici (try/catch insert...)
  
  try {
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: null,
        total_dhs: totalDHS,
        shipping_address: validatedFields.data,
        status: 'received',
      })
      .select()
      .single()

    if (orderError || !newOrder) throw new Error('Failed to create order')

    const itemsWithOrderId = orderItemsData.map((item) => ({
      ...item,
      order_id: newOrder.id,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId)

    if (itemsError) throw itemsError
    
    // Send Email Logic (Keep your Nodemailer code here)
    // ...

  } catch (error: any) {
    console.error(error)
    return { error: error.message }
  }
  
  const orderTimestamp = new Date().getTime()
  redirect(`/checkout/success?order_id=${orderTimestamp}`)
}