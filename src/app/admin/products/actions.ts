'use server'

import { adminDb } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

// --- 1. ADD PRODUCT (Secured) ---
export async function addProduct(formData: FormData) {
  // A. Security Check
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('admin_session')?.value === 'true'

  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required')
  }

  // B. Parse Data
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string
  const gender = formData.get('gender') as string
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File

  let image_url = ''

  // C. Upload Image
  if (imageFile && imageFile.size > 0) {
    // Sanitize filename to prevent issues
    const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
    
    const { error: uploadError } = await adminDb.storage
      .from('product-images')
      .upload(filename, imageFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error('Image upload failed')
    }

    // Get Public URL
    const { data: publicUrlData } = adminDb.storage
      .from('product-images')
      .getPublicUrl(filename)
      
    image_url = publicUrlData.publicUrl
  }

  // D. Insert into DB
  const { error: dbError } = await adminDb
    .from('products')
    .insert({
      name,
      price,
      category,
      gender,
      description,
      image_url
    })

  if (dbError) {
    console.error('Database Error:', dbError)
    throw new Error('Database insert failed')
  }

  // E. Redirect
  revalidatePath('/admin/products')
  revalidatePath('/shop')
  redirect('/admin/products')
}

// --- 2. DELETE PRODUCT (Restored) ---
export async function deleteProduct(formData: FormData) {
  // Optional: Add the same security check here if you want strict security
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