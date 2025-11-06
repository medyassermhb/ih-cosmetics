import Link from 'next/link'
import { User, Search } from 'lucide-react'
import { createServer } from '@/lib/supabase-server'
import { CartIcon } from './CartIcon'
import { AccountDropdown } from './AccountDropdown'
import Image from 'next/image' // Import the Image component

const Navbar = async () => {
  const supabase = createServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  let userRole: 'client' | 'admin' = 'client'
  let accountHref = '/account/orders'

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile?.role === 'admin') {
      userRole = 'admin'
      accountHref = '/admin/orders'
    }
  }

  const logoUrl = "https://hnrhhlxpnpkatvdagzcq.supabase.co/storage/v1/object/public/product-images/Gemini_Generated_Image_upk0z5upk0z5upk0%201.svg"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-sm">
      <nav className="container mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* Left Links */}
        <div className="flex items-center gap-6">
          {/* --- LOGO UPDATED --- */}
          <Link href="/" className="relative h-8 w-16">
            <Image
              src={logoUrl}
              alt="IH Cosmetics Logo"
              fill
              priority // Load the logo first
              sizes="(max-width: 768px) 50vw, 100vw"
              style={{ objectFit: 'contain' }}
            />
          </Link>
          {/* --- END OF UPDATE --- */}
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-yellow-600">Accueil</Link>
            <Link href="/shop" className="text-sm font-medium text-gray-700 hover:text-yellow-600">Boutique</Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-yellow-600">Contact</Link>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <button aria-label="Rechercher" className="text-gray-600 hover:text-yellow-600">
            <Search size={20} />
          </button>

          {user ? (
            <AccountDropdown userRole={userRole} accountHref={accountHref} />
          ) : (
            <Link href="/login" aria-label="Compte" className="text-gray-600 hover:text-yellow-600">
              <User size={20} />
            </Link>
          )}

          <CartIcon />
        </div>
      </nav>
    </header>
  )
}

export default Navbar