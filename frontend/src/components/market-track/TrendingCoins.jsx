import React from "react"
import { useMarket } from "../../hooks/useMarket"

const TrendingCoins = () => {
  const { filteredCoins, setSelectedCoin, selectedCoin, vsCurrency } = useMarket()

  const formatMiniPrice = (num) => {
    if (num === null || num === undefined || Number.isNaN(Number(num))) return "--"
    const locale = vsCurrency === "INR" ? "en-IN" : "en-US"
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: vsCurrency,
      minimumFractionDigits: Math.abs(num) < 1000 ? 2 : 0,
      maximumFractionDigits: Math.abs(num) < 1000 ? 3 : 2,
    }).format(Number(num))
  }

  return (
    <div className="bg-ca-surface rounded-2xl border border-ca-border text-ca-text overflow-hidden">
      <div className="px-4 py-3 border-b border-ca-border bg-ca-bg">
        <h3 className="text-ca-text-muted font-mono font-semibold text-xs uppercase tracking-wider">
          Assets ({filteredCoins.length})
        </h3>
      </div>

      {filteredCoins.length === 0 ? (
        <p className="p-4 text-xs text-ca-text-muted">No matching assets found.</p>
      ) : (
        <div className="divide-y divide-ca-divider">
          {filteredCoins.map((coin) => {
            const isSelected = selectedCoin?.symbol === coin.symbol
            return (
              <button
                type="button"
                key={coin.symbol}
                onClick={() => setSelectedCoin(coin)}
                className={`w-full text-left px-4 py-3 cursor-pointer transition-colors flex items-center justify-between gap-2 border-l-2 ${
                  isSelected
                    ? "bg-ca-accent-soft border-ca-accent"
                    : "border-transparent hover:bg-ca-surface-raised"
                }`}
              >
                <div className="min-w-0">
                  <p className={`font-semibold text-sm ${isSelected ? "text-ca-accent" : "text-ca-text"}`}>
                    {coin.symbol}
                  </p>
                  <p className="text-xs text-ca-text-muted truncate">{coin.name}</p>
                </div>
                <span className="text-xs font-mono tabular-nums text-ca-text-secondary shrink-0">
                  {formatMiniPrice(coin.current_price)}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TrendingCoins
