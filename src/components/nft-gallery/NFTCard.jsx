// components/nft/NFTCard.jsx

const NFTCard = ({ nft }) => {
  return (
    <div className="group bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 hover:shadow-2xl hover:shadow-amber-600/10 transition-all duration-300 flex flex-col">

      <div className="relative aspect-square overflow-hidden">
        <img
          src={nft.image}
          alt={nft.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white">
          {nft.timeLeft}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">

        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-white truncate pr-2">
              {nft.title}
            </h3>

            <button
              onClick={() => nft.toggleLike(nft.id)}
              className={`transition-colors text-lg ${
                nft.liked
                  ? "text-red-500"
                  : "text-gray-500 hover:text-red-500"
              }`}
            >
              ♥
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <img
              src={nft.avatar}
              alt={nft.creator}
              className="w-6 h-6 rounded-full border border-gray-600"
            />
            <span className="text-sm text-gray-400 truncate">
              {nft.creator}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-end pt-4 border-t border-gray-700">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">
              Current Bid
            </p>
            <p className="font-bold text-lg text-amber-600">
              ₹{nft.bid.toLocaleString()}
            </p>
          </div>

          <button className="bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-amber-500 transition-all">
            Place Bid
          </button>
        </div>
      </div>
    </div>
  )
}

export default NFTCard