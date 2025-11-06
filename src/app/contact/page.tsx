import { Mail, Phone, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Contactez-nous | IH Cosmetics',
}

const ContactPage = () => {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-16">
      <h1 className="mb-4 text-center text-4xl font-bold">Contactez-nous</h1>
      <p className="mb-12 text-center text-lg text-gray-600">
        Nous sommes là pour vous aider. Prenez contact avec nous.
      </p>

      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        {/* Formulaire de contact */}
        <div>
          <h2 className="mb-6 text-2xl font-semibold">Envoyer un message</h2>
          <form 
            // action={sendContactMessage} 
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Adresse e-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-3 text-base shadow-sm focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full rounded-md border border-transparent bg-yellow-700 px-6 py-3 text-white shadow-sm hover:bg-yellow-800"
            >
              Envoyer le message
            </button>
          </form>
        </div>

        {/* Informations de contact */}
        <div className="rounded-lg bg-beige-100 p-8">
          <h2 className="mb-6 text-2xl font-semibold">Nos informations</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin size={24} className="mt-1 text-yellow-700" />
              <div>
                <h3 className="font-semibold">Adresse</h3>
                <p className="text-gray-700">
                  123 Rue de la Liberté,
                  <br />
                  Casablanca, Maroc
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone size={24} className="mt-1 text-yellow-700" />
              <div>
                <h3 className="font-semibold">Téléphone</h3>
                <p className="text-gray-700">+212 5 00 00 00 00</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail size={24} className="mt-1 text-yellow-700" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-700">contact@ihcosmetics.ma</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage