'use server'

import { createServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Schema for profile details
const profileSchema = z.object({
  full_name: z.string().min(2, { message: 'Le nom est requis.' }),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
})

// Schema for password
const passwordSchema = z.object({
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"], // Point error to this field
})

// Action 1: Update Profile Details
export async function updateDetails(prevState: any, formData: FormData) {
  const supabase = createServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié.' }

  const dataToValidate = {
    full_name: formData.get('full_name'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    city: formData.get('city'),
  }

  const validated = profileSchema.safeParse(dataToValidate)
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from('profiles')
    .update(validated.data)
    .eq('id', user.id)
  
  if (error) {
    return { error: 'Erreur lors de la mise à jour du profil.' }
  }

  revalidatePath('/account/details')
  return { success: true, message: 'Profil mis à jour !' }
}

// Action 2: Update Password
export async function updatePassword(prevState: any, formData: FormData) {
  const supabase = createServer()

  const dataToValidate = {
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  }

  const validated = passwordSchema.safeParse(dataToValidate)
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  const { error } = await supabase.auth.updateUser({
    password: validated.data.password
  })

  if (error) {
    return { error: "Erreur lors de la mise à jour du mot de passe." }
  }

  return { success: true, message: 'Mot de passe mis à jour !' }
}