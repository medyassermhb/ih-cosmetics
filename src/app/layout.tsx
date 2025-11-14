import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/global/Navbar'
import Footer from '@/components/global/Footer'
import CartModal from '@/components/cart/CartModal'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter', 
})

// --- START OF UPDATE ---
const siteUrl = process.env.SITE_URL || 'https://ih-cosmetics.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), // Very important!
  title: {
    default: 'IH Cosmetics - Beauté Marocaine Biologique',
    template: '%s | IH Cosmetics',
  },
  description: 'Découvrez notre collection de parfums, gommages, et déodorants bio. Fait à la main au Maroc.',
  
  // Open Graph (OG) tags for social media
  openGraph: {
    title: 'IH Cosmetics - Beauté Marocaine Biologique',
    description: 'Découvrez notre collection de parfums, gommages, et déodorants bio.',
    url: siteUrl,
    siteName: 'IH Cosmetics',
    // You should add a default 'OG image' (1200x630px) to your Supabase storage
    // images: [
    //   {
    //     url: 'https://.../your-og-image.jpg',
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    locale: 'fr_FR',
    type: 'website',
  },
}
// --- END OF UPDATE ---

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans bg-white text-black`}>
        <Toaster position="bottom-center" />
        <Navbar /> 
        <CartModal />
        <main className="min-h-screen"> 
          {children}
        </main>
        <Footer /> 
      </body>
    </html>
  )
}