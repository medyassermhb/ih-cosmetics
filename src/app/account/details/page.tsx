import { createServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Database } from '@/types/supabase'
import DetailsForm from './DetailsForm' // We will create this next

export const metadata = {
  title: 'Détails du compte | IH Cosmetics',
}

// Re-type the profile to include our new fields
type Profile = Database['public']['Tables']['profiles']['Row'] & {
  address: string | null
  city: string | null
}

export default async function AccountDetailsPage() {
  const supabase = createServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
  }

  // We pass the server-fetched data to the client component
  return (
    <DetailsForm profile={profile as Profile} />
  )
}