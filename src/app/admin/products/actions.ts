'use server'

import { adminDb } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

// --- ADD PRODUCT ---
export async function addProduct(formData: FormData) {
  // 1. Security Check
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('admin_session')?.value === 'true'

  if (!isAdmin) {
    throw new Error('Unauthorized')
  }

  // 2. Parse Data
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string
  const gender = formData.get('gender') as string
  const description = formData.get('description') as string
  
  // Retrieve the URL we uploaded from the client
  const image_url = formData.get('image_url') as string

  // 3. Insert into DB
  const { error: dbError } = await adminDb
    .from('products')
    .insert({
      name,
      price,
      category,
      gender,
      description,
      image_url // Save the URL directly
    })

  if (dbError) {
    console.error('Database Error:', dbError)
    throw new Error('Database insert failed')
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  redirect('/admin/products')
}

// --- DELETE PRODUCT ---
export async function deleteProduct(formData: FormData) {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('admin_session')?.value === 'true'

  if (!isAdmin) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id') as string
  await adminDb.from('products').delete().eq('id', id)
  
  revalidatePath('/admin/products')
  revalidatePath('/shop')
}