import { useMarket } from "../../context/MarketContext"


const TrendingCoins = () => {
  const { filteredCoins, setSelectedCoin, selectedCoin } = useMarket()

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 text-white">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-amber-600 font-bold text-sm">
          Trending Coins
        </h3>
      </div>

      {filteredCoins.map((coin) => (
        <div
          key={coin.symbol}
          onClick={() => setSelectedCoin(coin)}
          className={`p-4 cursor-pointer hover:bg-gray-700 transition ${
            selectedCoin.symbol === coin.symbol
              ? "bg-gray-700"
              : ""
          }`}
        >
          <p className="font-bold">{coin.symbol}</p>
          <p className="text-xs text-gray-400">{coin.name}</p>
        </div>
      ))}
    </div>
  )
}

export default TrendingCoins