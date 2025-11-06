import { createServer } from '@/lib/supabase-server'
import CheckoutForm from './CheckoutForm' // Import the client component

// This is now a Server Component
export default async function CheckoutPage() {
  const supabase = createServer()
  const { data: { user } } = await supabase.auth.getUser()

  // We fetch the user's email on the server
  // and pass it to the client component
  return <CheckoutForm userEmail={user?.email || null} />
}