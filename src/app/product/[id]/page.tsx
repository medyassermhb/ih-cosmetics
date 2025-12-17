import { createServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import AddToCartButton from '@/components/products/AddToCartButton'
import ProductExtraInfo from '@/components/products/ProductExtraInfo' // <--- 1. Import this
import { Product } from '@/types/cart'

export const revalidate = 0

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  
  const supabase = createServer()
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  const p = product as Product

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
          
          {/* IMAGE SECTION */}
          <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gray-100 lg:h-[600px]">
            <Image
              src={p.image_url || '/placeholder.png'}
              alt={p.name}
              fill
              className="object-cover object-center"
              unoptimized
            />
          </div>

          {/* DETAILS SECTION */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {p.name}
            </h1>
            
            <div className="mt-4">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-yellow-700">{p.price} DHS</p>
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="capitalize">{p.gender}</span>
                <span>&middot;</span>
                <span className="capitalize">{p.category}</span>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <p className="text-base text-gray-600 leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="mt-8">
              <AddToCartButton product={p} />
            </div>

            {/* <--- 2. Add the Extra Info Component Here */}
            <ProductExtraInfo />

          </div>

        </div>
      </div>
    </div>
  )
}