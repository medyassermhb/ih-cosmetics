'use server'

import { adminDb } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function addProduct(formData: FormData) {
  // 1. SECURITY: Verify Admin Session
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('admin_session')?.value === 'true'
  
  if (!isAdmin) {
    console.error('Unauthorized access attempt')
    throw new Error('Unauthorized')
  }

  try {
    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string)
    const category = formData.get('category') as string
    const gender = formData.get('gender') as string
    const description = formData.get('description') as string
    const imageFile = formData.get('image') as File

    let image_url = ''

    // 2. Upload Image
    if (imageFile && imageFile.size > 0) {
      const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
      
      const { data, error: uploadError } = await adminDb.storage
        .from('product-images')
        .upload(filename, imageFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Supabase Storage Error:', uploadError)
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      const { data: publicUrlData } = adminDb.storage
        .from('product-images')
        .getPublicUrl(filename)
        
      image_url = publicUrlData.publicUrl
    }

    // 3. Insert into DB
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
      console.error('Database Insert Error:', dbError)
      throw new Error(`Database error: ${dbError.message}`)
    }

  } catch (err) {
    // This will show up in your Vercel Function Logs
    console.error('SERVER ACTION ERROR:', err)
    throw err // Re-throw to show error to client
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  redirect('/admin/products')
}