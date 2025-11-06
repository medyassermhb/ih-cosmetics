import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/global/Navbar' 
import Footer from '@/components/global/Footer' 
import CartModal from '@/components/cart/CartModal' // <-- Import


const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter', 
})

export const metadata: Metadata = {
  title: 'IH Cosmetics - Organic Moroccan Beauty',
  description: 'High-end, minimalist e-commerce for bio-products.',
}

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
        
        <CartModal /> {/* <-- Add the Cart Modal here */}

        <main className="min-h-screen"> 
          {children}
        </main>
        
        <Footer /> 

      </body>
    </html>
  )
}