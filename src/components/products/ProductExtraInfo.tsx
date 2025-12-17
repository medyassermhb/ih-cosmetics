'use client'

import { useState } from 'react'
import { Truck, RotateCcw, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react'

export default function ProductExtraInfo() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const sections = [
    {
      id: 'delivery',
      title: 'Livraison & Expédition',
      icon: <Truck className="h-5 w-5 text-yellow-700" />,
      content: (
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Partenaire Logistique :</strong> Livraison assurée par <strong>ForceLog</strong>.
          </p>
          <p>
            <strong>Délais :</strong> Réception sous <strong>48h maximum</strong> (2 jours) après expédition.
          </p>
          <ul className="list-inside list-disc">
            <li><strong>Casablanca :</strong> 20 DHS</li>
            <li><strong>Autres villes :</strong> 35 DHS</li>
          </ul>
          <p className="text-xs italic text-gray-400 mt-2">
            *Paiement à la livraison disponible.
          </p>
        </div>
      ),
    },
    {
      id: 'returns',
      title: 'Retours & Échanges',
      icon: <RotateCcw className="h-5 w-5 text-yellow-700" />,
      content: (
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            Satisfait ou remboursé sous <strong>7 jours</strong>.
          </p>
          <p>
            Si le produit ne vous convient pas, contactez-nous sur WhatsApp. 
            Le produit doit être non utilisé et dans son emballage d'origine.
          </p>
        </div>
      ),
    },
    {
      id: 'authenticity',
      title: 'Authenticité Garantie',
      icon: <ShieldCheck className="h-5 w-5 text-yellow-700" />,
      content: (
        <p className="text-sm text-gray-600">
          Produits <strong>100% originaux</strong>. Nous sommes revendeurs officiels. 
          Méfiez-vous des contrefaçons.
        </p>
      ),
    },
  ]

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="rounded-lg border border-gray-100 bg-gray-50/50">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between px-4 py-4 text-left focus:outline-none hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {section.icon}
                <span className="font-medium text-gray-900">{section.title}</span>
              </div>
              {openSection === section.id ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openSection === section.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-4 pb-4 pt-0">{section.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}