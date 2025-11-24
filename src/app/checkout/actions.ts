'use server'

import { createServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import * as nodemailer from 'nodemailer'

// --- SCHÉMAS DE VALIDATION ---

// 1. Schéma de livraison (CORRIGÉ)
const shippingSchema = z.object({
  email: z.string().email({ message: 'E-mail invalide.' }),
  name: z.string().min(3, { message: 'Le nom est requis' }),
  phone: z.string().min(10, { message: 'Le téléphone est requis' }),
  address: z.string().min(5, { message: "L'adresse est requise" }),
  city: z.string().min(2, { message: 'La ville est requise' }),
  
  // --- CORRECTION ICI ---
  // On utilise refine() pour valider la valeur 'Morocco' avec un message personnalisé
  country: z.string().refine((val) => val === 'Morocco', {
    message: 'Seul le Maroc est disponible',
  }),
  // ---------------------
})

// 2. Schéma du panier
const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  childProductIds: z.array(z.string()).optional(),
  customDescription: z.string().optional()
})

// --- HELPER EMAIL ---
function getEmailHtml(order: any, shipping: any, items: any[], products: any[], totalDHS: number) {
  let itemsHtml = items.map(item => {
    const product = products.find(p => p.id === item.product_id)
    return `
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <img src="${product.image_url}" alt="${product.name}" width="60" style="border-radius: 5px; margin-right: 15px;">
        <div style="flex: 1;">
          <strong style="font-size: 14px;">${product.name}</strong>
          <div style="font-size: 12px; color: #555;">Qté: ${item.quantity}</div>
        </div>
        <div style="font-size: 14px; font-weight: bold;">
          ${(item.unit_price_dhs * item.quantity).toFixed(2)} DHS
        </div>
      </div>
    `
  }).join('')

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
      <h1 style="color: #B8860B; text-align: center;">IH Cosmetics</h1>
      <h2 style="font-size: 24px; color: #333;">Merci pour votre commande !</h2>
      <p>Bonjour ${shipping.name}, votre commande a été reçue.</p>
      <p><strong>Commande N°:</strong> ${order.id.substring(0, 8)}</p>
      
      <div style="border-top: 1px solid #eee; margin-top: 20px; padding-top: 20px;">
        <h3 style="font-size: 18px;">Résumé de la commande</h3>
        ${itemsHtml}
      </div>
      
      <div style="border-top: 1px solid #eee; margin-top: 20px; padding-top: 10px;">
        <div style="display: flex; justify-content: space-between;">
          <span>Sous-total:</span>
          <strong>${totalDHS.toFixed(2)} DHS</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Livraison:</span>
          <strong>Gratuite</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 18px; margin-top: 10px;">
          <strong>Total:</strong>
          <strong>${totalDHS.toFixed(2)} DHS</strong>
        </div>
      </div>
      
      <div style="border-top: 1px solid #eee; margin-top: 20px; padding-top: 20px;">
        <h3 style="font-size: 18px;">Adresse de livraison</h3>
        <p style="margin: 0;">${shipping.name}</p>
        <p style="margin: 0;">${shipping.address}</p>
        <p style="margin: 0;">${shipping.city}, Maroc</p>
        <p style="margin: 0;">${shipping.phone}</p>
      </div>
    </div>
  `
}

// --- ACTION PRINCIPALE : CRÉER COMMANDE ---
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

  const validatedFields = shippingSchema.safeParse(shippingData)

  if (!validatedFields.success) {
    return {
      error: 'Formulaire invalide. Veuillez vérifier vos informations.',
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
    return { error: 'Erreur de données du panier.' }
  }

  // 1. Collecter TOUS les IDs
  let allProductIds: string[] = []
  clientCartItems.forEach(item => {
    if (item.childProductIds && item.childProductIds.length > 0) {
      allProductIds.push(...item.childProductIds)
    } else {
      allProductIds.push(item.productId)
    }
  })

  // 2. Récupérer les vrais produits
  const { data: products, error: productError } = await supabase
    .from('products')
    .select('id, name, price, image_url')
    .in('id', allProductIds)

  if (productError || !products) {
    return { error: 'Erreur lors de la vérification des produits.' }
  }

  // 3. Calculer le total
  let totalDHS = 0
  const orderItemsData = []

  for (const item of clientCartItems) {
    if (item.childProductIds && item.childProductIds.length > 0) {
      // LOGIQUE COFFRET
      let boxPrice = 0
      for (const childId of item.childProductIds) {
        const realProduct = products.find(p => p.id === childId)
        if (!realProduct) return { error: `Produit introuvable dans le coffret` }
        
        boxPrice += realProduct.price
        
        orderItemsData.push({
          product_id: realProduct.id,
          quantity: item.quantity,
          unit_price_dhs: realProduct.price
        })
      }
      totalDHS += boxPrice * item.quantity

    } else {
      // LOGIQUE PRODUIT NORMAL
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

  try {
    // Insérer la commande
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: null, // Invité
        total_dhs: totalDHS,
        shipping_address: validatedFields.data,
        status: 'received',
      })
      .select()
      .single()

    if (orderError || !newOrder) {
      throw new Error(orderError?.message || 'Failed to create order')
    }

    // Lier les items
    const itemsWithOrderId = orderItemsData.map((item) => ({
      ...item,
      order_id: newOrder.id,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId)

    if (itemsError) throw itemsError
    
    // Envoyer l'email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })

    const emailHtml = getEmailHtml(newOrder, validatedFields.data, orderItemsData, products, totalDHS)

    await transporter.sendMail({
      from: `"IH Cosmetics" <${process.env.EMAIL_SERVER_USER}>`,
      to: orderEmail,
      subject: `Confirmation de commande #${newOrder.id.substring(0, 8)}`,
      html: emailHtml,
    })
    
  } catch (error: any) {
    console.error('Transaction Error:', error.message)
    if (error.code === 'EAUTH') {
      console.error('Email sending failed: Invalid Gmail credentials.')
    } else if (error.message.includes('Nodemailer')) {
      console.error('Email sending failed:', error.message)
    } else {
      return { error: `Impossible de passer la commande : ${error.message}` }
    }
  }
  
  const orderTimestamp = new Date().getTime()
  redirect(`/checkout/success?order_id=${orderTimestamp}`)
}

// Dummy exports pour éviter les erreurs d'import
export async function inlineLogin() { return { success: false } }
export async function inlineSignup() { return { success: false } }
export async function inlineLogout() { return { success: false } }