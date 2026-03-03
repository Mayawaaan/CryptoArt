import { useMarket } from "../../context/MarketContext"

const CoinHeader = () => {
  const { selectedCoin, price, change } = useMarket()

  const formatINR = (num) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num)

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* Coin Info */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-amber-600">
            {selectedCoin.name}
          </h1>

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-xl sm:text-2xl font-bold">
              {formatINR(price)}
            </span>

            <span
              className={`px-2 py-1 text-xs sm:text-sm font-semibold rounded ${
                change >= 0
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {change >= 0 ? "+" : ""}
              {change}%
            </span>
          </div>
        </div>

      </div>

    </div>
  )
}

export default CoinHeader