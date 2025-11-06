import ProductForm from '../ProductForm'

export const metadata = {
  title: 'Nouveau Produit | IH Cosmetics',
}

export default function NewProductPage() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">Ajouter un nouveau produit</h2>
      <ProductForm />
    </div>
  )
}