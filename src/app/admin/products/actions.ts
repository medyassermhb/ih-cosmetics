'use server'

import { adminDb } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string
  const gender = formData.get('gender') as string
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File

  let image_url = ''

  // 1. Upload Image
  if (imageFile && imageFile.size > 0) {
    const filename = `${Date.now()}-${imageFile.name}`
    const { data, error } = await adminDb.storage
      .from('product-images')
      .upload(filename, imageFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      throw new Error('Image upload failed')
    }

    // Get Public URL
    const { data: publicUrlData } = adminDb.storage
      .from('product-images')
      .getPublicUrl(filename)
      
    image_url = publicUrlData.publicUrl
  }

  // 2. Insert into DB
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

  if (dbError) console.error(dbError)

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  redirect('/admin/products')
}

export async function deleteProduct(formData: FormData) {
  const id = formData.get('id') as string
  await adminDb.from('products').delete().eq('id', id)
  revalidatePath('/admin/products')
  revalidatePath('/shop')
}