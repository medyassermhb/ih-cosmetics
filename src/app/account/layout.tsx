import { createServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogoutButton } from '@/components/global/LogoutButton'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Mon Compte</h1>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
        {/* --- START OF CHANGES --- */}
        <nav className="flex flex-col gap-2 md:col-span-1">
          <Link 
            href="/account/orders" 
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Mes Commandes
          </Link>
          {/* We remove the "Mes Adresses" link */}
          <Link 
            href="/account/details" // Update the href
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Détails du compte // Remove (Bientôt)
          </Link>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </nav>
        {/* --- END OF CHANGES --- */}

        {/* Page Content */}
        <div className="md:col-span-3">
          {children}
        </div>
      </div>
    </div>
  )
}