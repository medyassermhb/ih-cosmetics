// src/app/admin/products/[id]/page.tsx
import { createServer } from '@/lib/supabase-server'
import ProductForm from '../ProductForm'
import { type Product } from '@/types/cart'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Modifier le Produit | IH Cosmetics',
}

// Optional: keep it dynamic if you want fresh data every time.
// export const dynamic = 'force-dynamic'
// or: export const revalidate = 0

type EditProductPageProps = {
  // ✅ Next 15/16 (React 19, App Router): params is a Promise in server components
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const supabase = createServer()

  // ✅ Unwrap params before using it
  const { id } = await params

  // (Optional) UUID sanity check to avoid bad queries
  if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
    notFound()
  }

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">Modifier le produit</h2>
      <ProductForm product={product as Product} />
    </div>
  )
}
