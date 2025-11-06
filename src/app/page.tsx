import { createServer } from '@/lib/supabase-server'
import { type Product } from '@/types/cart'

// Import our new homepage components (we'll create these next)
import Hero from '@/components/home/Hero'
import FeaturedCollection from '@/components/home/FeaturedCollection'
import GenderSplit from '@/components/home/GenderSplit'
import Benefits from '@/components/home/Benefits'
import CodInfo from '@/components/home/CodInfo'
import Newsletter from '@/components/home/Newsletter'

// We want fresh data, but we can cache it for a short time.
// This tells Next.js to re-fetch the data every 60 seconds.
export const revalidate = 60

const HomePage = async () => {
  const supabase = createServer()

  // Fetch 6 featured products (e.g., the newest ones)
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .limit(6)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching featured products:', error)
  }

  // Cast to Product[] to satisfy our component
  const featuredProducts = (products as Product[]) || []

  return (
    <div>
      <Hero />
      <FeaturedCollection products={featuredProducts} />
      <GenderSplit />
      <Benefits />
      <CodInfo />
      <Newsletter />
    </div>
  )
}

export default HomePage