import Link from 'next/link'

const Hero = () => {
  return (
    <div className="relative h-[60vh] min-h-[400px] w-full bg-cover bg-center"
      style={{ backgroundImage: "url('https://hnrhhlxpnpkatvdagzcq.supabase.co/storage/v1/object/public/product-images/ih%20freg.png')" }}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div className="container relative z-10 mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-4">
        <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
          Beauté Naturelle Marocaine
        </h1>
        <p className="mb-8 text-lg text-white/90 md:text-xl">
          Découvrez nos produits bio, faits à la main.
        </p>
        <Link
          href="/shop"
          className="rounded-md bg-yellow-700 px-8 py-3 text-lg font-medium text-white shadow-lg transition-transform hover:scale-105 hover:bg-yellow-800"
        >
          Découvrir
        </Link>
      </div>
    </div>
  )
}

export default Hero