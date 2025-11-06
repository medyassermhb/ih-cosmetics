import { Leaf, Feather, MapPin } from 'lucide-react'

const benefits = [
  {
    icon: <Leaf size={40} className="text-yellow-700" />,
    title: 'Ingrédients Biologiques',
    description: "Tous nos produits proviennent de matériaux naturels et biologiques.",
  },
  {
    icon: <Feather size={40} className="text-yellow-700" />,
    title: 'Fait à la main',
    description: 'Fabriqué en petits lots pour une qualité et un soin supérieurs.',
  },
  {
    icon: <MapPin size={40} className="text-yellow-700" />,
    title: 'Fait au Maroc',
    description: 'Soutenant fièrement les artisans et les traditions locales.',
  },
]

const Benefits = () => {
  return (
    <div className="bg-beige-100 py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {benefits.map((item) => (
            <div key={item.title} className="text-center">
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Benefits