'use client'

import { useSearchParams, useRouter } from 'next/navigation'

// Updated filters in French
const filters = [
  { label: 'Tous', value: 'all' },
  { label: 'Parfum', value: 'perfume' },
  { label: 'Gommage', value: 'gommage' },
  { label: 'Déodorant', value: 'deodorant' },
  { label: 'Homme', value: 'male' },
  { label: 'Femme', value: 'female' },
]

const ProductFilter = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const activeFilter = searchParams.get('category') || searchParams.get('gender') || 'all'

  const handleFilterClick = (filterValue: string) => {
    let href = ''
    
    if (filterValue === 'all') {
      href = '/shop'
    } else {
      const queryParam = filterValue === 'male' || filterValue === 'female' 
        ? `gender=${filterValue}` 
        : `category=${filterValue}`
      href = `/shop?${queryParam}`
    }
    
    // Force a full-page reload
    window.location.href = href;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-6">
      {filters.map((filter) => {
        const isActive = filter.value === activeFilter

        return (
          <button
            key={filter.value}
            onClick={() => handleFilterClick(filter.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors
              ${
                isActive
                  ? 'bg-yellow-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}

export default ProductFilter