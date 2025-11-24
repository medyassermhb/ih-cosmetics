import { createServer } from '@/lib/supabase-server'
import BoxBuilder from '@/components/box/BoxBuilder'
import { type Product } from '@/types/cart'

export const metadata = {
  title: 'Composez votre Coffret | IH Cosmetics',
  description: 'Choisissez 3 produits pour créer votre coffret personnalisé.',
}

// Forcer le rendu dynamique pour avoir les données à jour
export const revalidate = 0

export default async function BoxPage() {
  const supabase = createServer()

  // Vous pouvez filtrer ici. Par exemple : .eq('category', 'perfume')
  // Pour l'instant, on récupère TOUT pour laisser le choix.
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'perfume') // <-- MODIFIEZ ICI SI VOUS VOULEZ D'AUTRES CATÉGORIES
    .order('name', { ascending: true })

  if (error) {
    console.error('Erreur de chargement:', error)
    return <p className="p-10 text-center text-red-500">Impossible de charger les produits.</p>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white py-12 text-center shadow-sm">
        <h1 className="text-4xl font-bold text-gray-900">Composez votre Coffret</h1>
        <p className="mt-4 text-lg text-gray-600">
          Sélectionnez vos <strong>3 parfums</strong> préférés pour créer un coffret unique.
        </p>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-12">
        <BoxBuilder products={(products as Product[]) || []} />
      </div>
    </div>
  )
}