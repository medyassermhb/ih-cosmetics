'use server'

import { createServer } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- FULL PAGE ACTIONS (Unchanged) ---

export async function login(prevState: any, formData: FormData) {
  const supabase = createServer()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return { error: 'Email ou mot de passe invalide.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  revalidatePath('/', 'layout')
  if (profile?.role === 'admin') {
    redirect('/admin/orders')
  } else {
    redirect('/')
  }
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = createServer()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: "Erreur lors de la création du compte. L'e-mail est peut-être déjà pris." }
  }
  return { 
    success: true, 
    message: "Compte créé ! Veuillez vérifier votre e-mail pour confirmer votre inscription." 
  }
}

export async function logout() {
  const supabase = createServer()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}


// --- NEW INLINE ACTIONS (for Checkout) ---

export async function inlineLogin(prevState: any, formData: FormData) {
  const supabase = createServer()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Email ou mot de passe invalide.' }
  }

  // On success, just return success.
  // The client will handle the page refresh.
  return { success: true }
}

export async function inlineSignup(prevState: any, formData: FormData) {
  const supabase = createServer()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: "Erreur: L'e-mail est peut-être déjà pris." }
  }
  
  return { 
    success: true, 
    message: "Compte créé ! Veuillez vérifier votre e-mail pour confirmer." 
  }
}

export async function inlineLogout(prevState: any, formData: FormData) {
  const supabase = createServer()
  await supabase.auth.signOut()
  return { success: true }
}