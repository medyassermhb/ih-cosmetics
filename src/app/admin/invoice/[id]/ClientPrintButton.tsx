'use client'

import { Download } from 'lucide-react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { InvoicePDF } from '@/components/invoice/InvoicePDF'
import { useEffect, useState } from 'react'

export default function ClientPrintButton({ order }: { order: any }) {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])

  if (!isMounted) {
    return (
      <button disabled className="flex items-center gap-2 rounded bg-gray-400 px-4 py-2 text-sm font-bold text-white">
        Chargement...
      </button>
    )
  }

  // --- LOGIQUE DE NOMMAGE ---
  const address = order.shipping_address || {}
  
  // 1. Nettoyer le nom (minuscules, tirets au lieu d'espaces)
  const cleanName = (address.name || 'client')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Remplace les caractères spéciaux par des tirets
  
  // 2. ID court
  const shortId = order.id.substring(0, 8)

  // 3. Nom final : facture-jean-dupont-f686e19f.pdf
  const filename = `facture-${cleanName}-${shortId}.pdf`
  // --------------------------

  return (
    <PDFDownloadLink
      document={<InvoicePDF order={order} />}
      fileName={filename} // <-- On utilise le nouveau nom ici
      className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
    >
      {({ loading }) => (
        <>
          <Download size={16} />
          {loading ? 'Génération...' : 'Télécharger PDF'}
        </>
      )}
    </PDFDownloadLink>
  )
}