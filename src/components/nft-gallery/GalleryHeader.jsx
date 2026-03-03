// components/nft/GalleryHeader.jsx

const GalleryHeader = ({ search, setSearch }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">

      {/* Left Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Explore Collections
        </h1>

        <p className="text-gray-400 max-w-lg">
          Discover, collect, and sell extraordinary NFTs.
        </p>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-96">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none transition-all"
        />

        {/* Optional subtle glow effect */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none focus-within:shadow-[0_0_15px_rgba(217,119,6,0.25)]"></div>
      </div>

    </div>
  )
}

export default GalleryHeader