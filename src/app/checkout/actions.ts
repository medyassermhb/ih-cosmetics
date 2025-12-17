'use server'

import { createServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import * as nodemailer from 'nodemailer'

// --- CONFIGURATION ---
const BOX_PRICE_FIXED = 299 
// ---------------------

// 1. Schéma de livraison
const shippingSchema = z.object({
  email: z.string().email({ message: 'E-mail invalide.' }),
  name: z.string().min(3, { message: 'Le nom est requis' }),
  phone: z.string().min(10, { message: 'Le téléphone est requis' }),
  address: z.string().min(5, { message: "L'adresse est requise" }),
  city: z.string().min(2, { message: 'La ville est requise' }),
  country: z.string().refine((val) => ['Maroc', 'Morocco'].includes(val), {
    message: 'Seul le Maroc est disponible',
  }),
})

// 2. Schéma du panier
const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  childProductIds: z.array(z.string()).optional(),
  customDescription: z.string().optional()
})

// Helper pour valider un UUID
function isValidUUID(uuid: string) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return regex.test(uuid)
}

// --- HELPER EMAIL ---
function getEmailHtml(
  order: any, 
  shipping: any, 
  items: any[], 
  products: any[], 
  subTotal: number, 
  shippingFee: number,
  totalDHS: number
) {
  let itemsHtml = items.map(item => {
    const product = products.find(p => p.id === item.product_id)
    const productName = product ? product.name : "Coffret Personnalisé"
    const productImage = product ? product.image_url : "" 
    
    return `
      <div style="display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
        ${productImage ? `<img src="${productImage}" alt="${productName}" width="50" style="border-radius: 5px; margin-right: 15px;">` : ''}
        <div style="flex: 1;">
          <strong style="font-size: 14px;">${productName}</strong>
          <div style="font-size: 12px; color: #555;">Qté: ${item.quantity}</div>
        </div>
        <div style="font-size: 14px; font-weight: bold;">
          ${(item.unit_price_dhs * item.quantity).toFixed(2)} DHS
        </div>
      </div>
    `
  }).join('')

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #B8860B; margin: 0;">IH Cosmetics</h1>
        <p style="color: #777;">Confirmation de commande</p>
      </div>

      <div style="background: white; padding: 20px; border-radius: 8px;">
        <p>Bonjour <strong>${shipping.name}</strong>,</p>
        <p>Nous avons bien reçu votre commande ! Elle est en cours de traitement.</p>
        <p><strong>N° Commande:</strong> ${order.id.substring(0, 8)}</p>
        
        <h3 style="border-bottom: 2px solid #B8860B; padding-bottom: 5px; margin-top: 20px;">Détails</h3>
        ${itemsHtml}
        
        <div style="margin-top: 20px; padding-top: 10px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Sous-total:</span>
            <strong>${subTotal.toFixed(2)} DHS</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: #B8860B;">
            <span>Livraison (${shipping.city}):</span>
            <strong>${shippingFee.toFixed(2)} DHS</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 18px; margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px;">
            <strong>Total à payer:</strong>
            <strong>${totalDHS.toFixed(2)} DHS</strong>
          </div>
        </div>
      </div>
      
      <div style="margin-top: 20px; font-size: 14px; color: #555;">
        <h4 style="margin-bottom: 5px;">Adresse de livraison</h4>
        <p style="margin: 0;">${shipping.address}</p>
        <p style="margin: 0;">${shipping.city}, ${shipping.country}</p>
        <p style="margin: 0;">${shipping.phone}</p>
      </div>
    </div>
  `
}

// --- ACTION PRINCIPALE ---
export async function createOrder(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; errors?: any; success?: boolean }> {
  const supabase = createServer()
  
  const shippingData = {
    email: formData.get('email'),
    name: formData.get('name'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    city: formData.get('city'),
    country: formData.get('country'),
  }

  // 1. Validation du formulaire
  const validatedFields = shippingSchema.safeParse(shippingData)

  if (!validatedFields.success) {
    return {
      error: 'Formulaire incomplet ou invalide.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  
  const orderEmail = validatedFields.data.email
  const cartItemsPayload = formData.get('cartItems') as string
  if (!cartItemsPayload) return { error: 'Votre panier est vide.' }
  
  let clientCartItems: z.infer<typeof cartItemSchema>[]
  try {
    clientCartItems = JSON.parse(cartItemsPayload).map((item: any) =>
      cartItemSchema.parse(item)
    )
  } catch (e) {
    return { error: 'Erreur technique (Panier invalide).' }
  }

  // 2. Calcul des frais de livraison (Serveur)
  const city = validatedFields.data.city.trim()
  const shippingFee = city.toLowerCase() === 'casablanca' ? 20 : 35

  // 3. Récupération des IDs produits (CORRECTION ICI)
  let allProductIds: Set<string> = new Set()
  
  clientCartItems.forEach(item => {
    if (item.childProductIds && item.childProductIds.length > 0) {
      // Pour les coffrets, on prend les IDs des enfants
      item.childProductIds.forEach(id => {
        if (isValidUUID(id)) allProductIds.add(id)
      })
    } else {
      // Pour les produits normaux, on vérifie que c'est un UUID valide
      // Cela évite l'erreur avec les IDs temporaires genre 'coffret-custom-...'
      if (isValidUUID(item.productId)) {
        allProductIds.add(item.productId)
      }
    }
  })

  const idsArray = Array.from(allProductIds)

  if (idsArray.length === 0) {
    // Si aucun produit valide n'est trouvé, c'est peut-être un vieux panier corrompu
    // On ne bloque pas tout, mais on risque de ne pas pouvoir calculer le prix correctement
    // return { error: 'Aucun produit valide trouvé dans le panier.' }
  }

  const { data: products, error: productError } = await supabase
    .from('products')
    .select('id, name, price, image_url')
    .in('id', idsArray)

  if (productError || !products) {
    console.error('Supabase Error:', productError)
    return { error: 'Impossible de vérifier le stock des produits.' }
  }

  // 4. Calcul du Total (Produits + Box)
  let subTotal = 0
  const orderItemsData = []

  for (const item of clientCartItems) {
    if (item.childProductIds && item.childProductIds.length > 0) {
      // --- LOGIQUE COFFRET (Prix Fixe) ---
      subTotal += BOX_PRICE_FIXED * item.quantity
      
      const firstChildId = item.childProductIds[0]
      for (const childId of item.childProductIds) {
        const realProduct = products.find(p => p.id === childId)
        if (realProduct) {
          orderItemsData.push({
            product_id: realProduct.id,
            quantity: item.quantity,
            // Prix attaché au 1er produit pour comptabilité
            unit_price_dhs: (childId === firstChildId) ? BOX_PRICE_FIXED : 0
          })
        }
      }

    } else {
      // --- LOGIQUE STANDARD ---
      const realProduct = products.find(p => p.id === item.productId)
      
      if (realProduct) {
        subTotal += realProduct.price * item.quantity
        orderItemsData.push({
          product_id: realProduct.id,
          quantity: item.quantity,
          unit_price_dhs: realProduct.price
        })
      } else {
        // Si le produit n'est pas trouvé dans la DB (ex: produit supprimé ou ID invalide)
        // On l'ignore silencieusement ou on lance une erreur selon votre préférence.
        // Ici on ignore pour ne pas bloquer si c'est un glitch.
      }
    }
  }

  const finalTotal = subTotal + shippingFee

  try {
    // 5. Création de la commande
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: null,
        total_dhs: finalTotal,
        shipping_address: validatedFields.data,
        status: 'received',
      })
      .select()
      .single()

    if (orderError || !newOrder) {
      console.error('Order Error:', orderError)
      throw new Error('Erreur lors de la création de la commande.')
    }

    // 6. Insertion des items
    if (orderItemsData.length > 0) {
      const itemsWithOrderId = orderItemsData.map((item) => ({
        ...item,
        order_id: newOrder.id,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsWithOrderId)

      if (itemsError) throw itemsError
    }
    
    // 7. Envoi de l'email
    if (process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD) {
        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
        },
        })

        const emailHtml = getEmailHtml(
            newOrder, 
            validatedFields.data, 
            orderItemsData.filter(i => i.unit_price_dhs > 0), 
            products, 
            subTotal, 
            shippingFee, 
            finalTotal
        )

        await transporter.sendMail({
        from: `"IH Cosmetics" <${process.env.EMAIL_SERVER_USER}>`,
        to: orderEmail,
        subject: `Confirmation de commande #${newOrder.id.substring(0, 8)}`,
        html: emailHtml,
        })
    }
    
  } catch (error: any) {
    console.error('Transaction Error:', error.message)
    return { error: `Erreur système: ${error.message}` }
  }
  
  const orderTimestamp = new Date().getTime()
  redirect(`/checkout/success?order_id=${orderTimestamp}`)
}

export async function inlineLogin() { return { success: false } }
export async function inlineSignup() { return { success: false } }
export async function inlineLogout() { return { success: false } }