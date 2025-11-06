'use client'

const Newsletter = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert('Merci pour votre inscription!')
  }

  return (
    <div
      className="relative bg-cover bg-center py-20"
      style={{ backgroundImage: "url('https://source.unsplash.com/random/1600x600/?texture,beige')" }}
    >
      <div className="absolute inset-0 bg-black/10" />
      <div className="container relative z-10 mx-auto max-w-2xl px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold">Rejoignez notre Newsletter</h2>
        <p className="mb-8 text-gray-800">
          Accédez en exclusivité aux nouveautés, offres spéciales et plus encore.
        </p>
        <form onSubmit={handleSubmit} className="flex max-w-lg mx-auto">
          <label htmlFor="email" className="sr-only">Adresse e-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-l-md border-gray-300 px-4 py-3 shadow-sm focus:border-yellow-600 focus:ring-yellow-600"
            placeholder="Entrez votre e-mail"
          />
          <button
            type="submit"
            className="rounded-r-md bg-yellow-700 px-6 py-3 font-medium text-white shadow-sm hover:bg-yellow-800"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  )
}

export default Newsletter