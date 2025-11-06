import Link from 'next/link'
import { LogoutButton } from '@/components/global/LogoutButton'
import { Package, Users, ShoppingCart } from 'lucide-react' // <-- Ajoutez ShoppingCart

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Panneau d'administration</h1>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
        {/* Sidebar Navigation */}
        <nav className="flex flex-col gap-2 md:col-span-1">
          <Link 
            href="/admin/orders" 
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <Package size={16} />
            Commandes
          </Link>
          
          {/* --- NOUVEAU LIEN AJOUTÉ --- */}
          <Link 
            href="/admin/products" 
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <ShoppingCart size={16} />
            Produits
          </Link>
          {/* --- FIN DU NOUVEAU LIEN --- */}

          <Link 
            href="/admin/clients" 
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <Users size={16} />
            Clients
          </Link>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </nav>

        {/* Page Content */}
        <div className="md:col-span-3">
          {children}
        </div>
      </div>
    </div>
  )
}