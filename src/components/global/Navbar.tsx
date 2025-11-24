'use client' // <- Re-converti en Client Component

import Link from 'next/link'
import { ShoppingBag, User, Search } from 'lucide-react'
import { useCart } from '@/lib/store/cart-store' // <- Nous réutilisons useCart ici

const Navbar = () => {
  const { openModal, getCartCount } = useCart()
  const cartCount = getCartCount()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-sm">
      <nav className="container mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* Gauche : Logo & Liens */}
        <div className="flex items-center gap-6">
          <Link href="/" className="relative h-8 w-16">
            <Image
              src="https://hnrhhlxpnpkatvdagzcq.supabase.co/storage/v1/object/public/product-images/Gemini_Generated_Image_upk0z5upk0z5upk0%201.svg"
              alt="IH Cosmetics Logo"
              fill
              priority
              sizes="(max-width: 768px) 50vw, 100vw"
              style={{ objectFit: 'contain' }}
            />
          </Link>
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-yellow-600">
              Accueil
            </Link>
            <Link href="/shop" className="text-sm font-medium text-gray-700 hover:text-yellow-600">
              Boutique
            </Link>
            <Link href="/box" className="text-sm font-medium text-gray-700 hover:text-yellow-600">
              Coffret
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-yellow-600">
              Contact
            </Link>
          </div>
        </div>

        {/* Droite : Icônes (pas d'icône de compte) */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Rechercher"
            className="text-gray-600 hover:text-yellow-600"
          >
            <Search size={20} />
          </button>
          
          {/* L'icône 'CartIcon' est maintenant gérée directement ici */}
          <button
            onClick={openModal}
            aria-label="Ouvrir le panier"
            className="flex items-center gap-1 text-gray-600 hover:text-yellow-600"
          >
            <ShoppingBag size={20} />
            <span className="text-sm font-medium">({cartCount})</span>
          </button>
        </div>
      </nav>
    </header>
  )
}

// Nous devons importer Image ici
import Image from 'next/image'
export default Navbar