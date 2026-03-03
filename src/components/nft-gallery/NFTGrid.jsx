// components/nft/NFTGrid.jsx

import NFTCard from "./NFTCard"

const NFTGrid = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-[380px] bg-gray-800 animate-pulse rounded-3xl border border-gray-700"
          />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          No NFTs Found
        </h3>
        <p className="text-gray-400 max-w-md">
          Try adjusting your search or explore a different category.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
      {data.map((nft) => (
        <NFTCard key={nft.id} nft={nft} />
      ))}
    </div>
  )
}

export default NFTGrid