import Link from 'next/link'

const GenderSplit = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {/* For Women */}
      <div
        className="relative flex h-[400px] items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://hnrhhlxpnpkatvdagzcq.supabase.co/storage/v1/object/public/product-images/ih%20freg.png')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Pour Elle</h2>
          <Link
            href="/shop?gender=female"
            className="rounded-md border border-white px-6 py-2 font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            Voir la sélection
          </Link>
        </div>
      </div>

      {/* For Men */}
      <div
        className="relative flex h-[400px] items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://hnrhhlxpnpkatvdagzcq.supabase.co/storage/v1/object/public/product-images/ih%20freg.png')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Pour Lui</h2>
          <Link
            href="/shop?gender=male"
            className="rounded-md border border-white px-6 py-2 font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            Voir la sélection
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GenderSplit