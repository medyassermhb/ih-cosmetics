'use server'

import { createServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Helper pour vérifier si l'utilisateur est un admin
async function checkAdmin() {
  const supabase = createServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autorisé')
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') {
    throw new Error('Non autorisé: Accès administrateur requis')
  }
}

// Schéma Zod pour la validation du produit
const productSchema = z.object({
  name: z.string().min(3, "Le nom est requis"),
  description: z.string().min(10, "La description est requise"),
  price: z.coerce.number().min(1, "Le prix doit être supérieur à 0"),
  image_url: z.string().min(1, "L'URL de l'image est requise"),
  category: z.enum(['perfume', 'gommage', 'deodorant']),
  gender: z.enum(['male', 'female', 'unisex']),
})

// Action 1: Créer un produit
export async function createProduct(prevState: any, formData: FormData) {
  try {
    await checkAdmin()
    const supabase = createServer()
    
    const validated = productSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price'),
      image_url: formData.get('image_url'),
      category: formData.get('category'),
      gender: formData.get('gender'),
    })

    if (!validated.success) {
      return { error: 'Formulaire invalide', errors: validated.error.flatten().fieldErrors }
    }

    const { error } = await supabase.from('products').insert(validated.data)
    if (error) throw error

  } catch (error: any) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop') // Mettre à jour la boutique publique
  redirect('/admin/products')
}

// Action 2: Mettre à jour un produit
export async function updateProduct(prevState: any, formData: FormData) {
  try {
    await checkAdmin()
    const supabase = createServer()
    const id = formData.get('id') as string

    const validated = productSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price'),
      image_url: formData.get('image_url'),
      category: formData.get('category'),
      gender: formData.get('gender'),
    })

    if (!validated.success) {
      return { error: 'Formulaire invalide', errors: validated.error.flatten().fieldErrors }
    }

    const { error } = await supabase.from('products').update(validated.data).eq('id', id)
    if (error) throw error

  } catch (error: any) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${formData.get('id')}`)
  revalidatePath('/shop')
  redirect('/admin/products')
}

// Action 3: Supprimer un produit
export async function deleteProduct(formData: FormData) {
  try {
    await checkAdmin()
    const supabase = createServer()
    const id = formData.get('id') as string

    if (!id) throw new Error("ID manquant")

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error

  } catch (error: any) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  // Pas de redirect ici, l'action est appelée depuis le formulaire d'édition
}