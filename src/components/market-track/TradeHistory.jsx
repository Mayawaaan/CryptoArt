import { useEffect, useState } from "react"
import { useMarket } from "../../context/MarketContext"

const TradeHistory = () => {
  const [trades, setTrades] = useState([])
  const { price } = useMarket()

  useEffect(() => {
    const generateTrade = () => {
      const type = Math.random() > 0.5 ? "Buy" : "Sell"
      const tradePrice =
        price * (1 + (Math.random() - 0.5) * 0.002)

      const amount = (Math.random() * 0.5).toFixed(5)
      const total = tradePrice * amount

      const now = new Date()
      const time = now.toLocaleTimeString("en-IN", {
        hour12: false,
      })

      return { time, type, price: tradePrice, amount, total }
    }

    const interval = setInterval(() => {
      setTrades((prev) => {
        const newTrade = generateTrade()
        return [newTrade, ...prev].slice(0, 20)
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [price])

  const formatINR = (num) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num)

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 text-white">

      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-bold text-amber-600">
          Recent Trade History
        </h3>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-y-auto max-h-[350px]">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
            <tr>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, i) => (
              <tr
                key={i}
                className="border-b border-gray-700 hover:bg-gray-700/40 transition"
              >
                <td className="px-6 py-3 text-gray-400">
                  {trade.time}
                </td>
                <td
                  className={`px-6 py-3 font-bold ${
                    trade.type === "Buy"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {trade.type}
                </td>
                <td className="px-6 py-3">
                  {formatINR(trade.price)}
                </td>
                <td className="px-6 py-3">
                  {trade.amount} BTC
                </td>
                <td className="px-6 py-3">
                  {formatINR(trade.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden max-h-[350px] overflow-y-auto p-4 space-y-3">
        {trades.map((trade, i) => (
          <div
            key={i}
            className="bg-gray-900 rounded-lg p-3 border border-gray-700"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">
                {trade.time}
              </span>
              <span
                className={`text-xs font-bold ${
                  trade.type === "Buy"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {trade.type}
              </span>
            </div>

            <div className="mt-2 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Price</span>
                <span>{formatINR(trade.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount</span>
                <span>{trade.amount} BTC</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-gray-400">Total</span>
                <span>{formatINR(trade.total)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default TradeHistory