import Link from 'next/link'
import Image from 'next/image' // Import the Image component
import { Instagram } from 'lucide-react'

// Payment Icons
const VisaIcon = () => <span className="font-semibold">VISA</span>
const MastercardIcon = () => <span className="font-semibold">Mastercard</span>
const CodIcon = () => <span className="font-semibold">Paiement à la livraison</span>

const Footer = () => {
  const logoUrl = "https://hnrhhlxpnpkatvdagzcq.supabase.co/storage/v1/object/public/product-images/Gemini_Generated_Image_upk0z5upk0z5upk0%201.svg"

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Logo & Social */}
          <div>
            {/* --- LOGO UPDATED --- */}
            <Link href="/" className="relative mb-2 block h-8 w-16">
              <Image
                src={logoUrl}
                alt="IH Cosmetics Logo"
                fill
                sizes="(max-width: 768px) 50vw, 100vw"
                style={{ objectFit: 'contain', objectPosition: 'left' }}
              />
            </Link>
            {/* --- END OF UPDATE --- */}
            <p className="mt-2 text-sm text-gray-600">
              Beauté Marocaine Biologique.
            </p>
            <div className="mt-4 flex gap-4">
              <a
                href="https://instagram.com/ihfragrance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-yellow-600"
                aria-label="IH Fragrance Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://instagram.com/ihcosmetiquebeauty"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-yellow-600"
                aria-label="IH Cosmetique Instagram"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h4 className="font-semibold">Boutique</h4>
                <ul className="mt-2 space-y-2 text-sm">
                  <li><Link href="/shop?category=perfume" className="text-gray-600 hover:text-yellow-600">Parfums</Link></li>
                  <li><Link href="/shop?category=gommage" className="text-gray-600 hover:text-yellow-600">Gommage</Link></li>
                  <li><Link href="/shop?category=deodorant" className="text-gray-600 hover:text-yellow-600">Déodorants</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">À propos</h4>
                <ul className="mt-2 space-y-2 text-sm">
                  <li><Link href="/contact" className="text-gray-600 hover:text-yellow-600">Contactez-nous</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-yellow-600">À propos d'IH</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Légal</h4>
                <ul className="mt-2 space-y-2 text-sm">
                  <li><Link href="#" className="text-gray-600 hover:text-yellow-600">Politique de confidentialité</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-yellow-600">Conditions d'utilisation</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} IH Cosmetics. Tous droits réservés.
            </p>
            {/* Payment Icons */}
            <div className="flex items-center gap-4 text-gray-600">
              <VisaIcon />
              <MastercardIcon />
              <CodIcon />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer