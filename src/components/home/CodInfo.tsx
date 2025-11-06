import { Truck } from 'lucide-react'

const CodInfo = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto max-w-3xl px-4 text-center">
        <Truck size={48} className="mx-auto mb-6 text-yellow-700" />
        <h2 className="mb-4 text-3xl font-bold">Paiement à la livraison</h2>
        <p className="text-lg text-gray-700">
          Nous offrons le paiement à la livraison pour toutes les commandes à travers le Maroc. 
          Achetez en toute confiance et payez uniquement lorsque vous recevez vos produits. 
          Simple, sécurisé et pratique.
        </p>
      </div>
    </div>
  )
}

export default CodInfo