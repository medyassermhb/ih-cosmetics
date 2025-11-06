'use server'

import { createServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

// Helper function to check admin role
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

export async function updateOrderStatus(formData: FormData) {
  try {
    await checkAdmin() // Secure the action
    
    const supabase = createServer()
    const orderId = formData.get('orderId') as string
    const newStatus = formData.get('status') as string

    if (!orderId || !newStatus) {
      throw new Error('ID de commande ou statut manquant')
    }

    // --- THIS IS THE FIXED LINE ---
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (error) throw error

    // Re-validate the path so the new status shows up
    revalidatePath('/admin/orders')
    revalidatePath(`/account/orders/${orderId}`) // Re-validate customer page too
    
    return { success: true, message: 'Statut mis à jour !' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}