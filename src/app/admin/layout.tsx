import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, ShoppingCart, LogOut } from 'lucide-react'

// --- SERVER ACTIONS FOR AUTH ---
async function loginAction(formData: FormData) {
  'use server'
  const password = formData.get('password')
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'true', { httpOnly: true, path: '/' })
    redirect('/admin')
  }
}

async function logoutAction() {
  'use server'
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/')
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('admin_session')?.value === 'true'

  // 1. If NOT Logged In -> Show Login Form
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <form action={loginAction} className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold text-yellow-700">IH Admin</h1>
          <input 
            type="password" 
            name="password" 
            placeholder="Mot de passe" 
            className="mb-4 block w-full rounded-md border-gray-300 px-4 py-3 shadow-sm focus:border-yellow-600 focus:ring-yellow-600"
            required 
          />
          <button type="submit" className="w-full rounded-md bg-yellow-700 px-4 py-3 font-bold text-white hover:bg-yellow-800">
            Connexion
          </button>
        </form>
      </div>
    )
  }

  // 2. If Logged In -> Show Dashboard Layout
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center font-bold text-yellow-700">
                IH Admin
              </div>
              <div className="ml-6 flex space-x-8">
                <Link 
                  href="/admin" 
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-yellow-700 hover:text-gray-900"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Commandes
                </Link>
                <Link 
                  href="/admin/products" 
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-yellow-700 hover:text-gray-900"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Produits
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <form action={logoutAction}>
                <button className="text-sm text-gray-500 hover:text-red-600 flex items-center">
                  <LogOut className="mr-1 h-4 w-4" /> Déconnexion
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}