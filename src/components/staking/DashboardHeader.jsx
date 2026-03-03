import { useContext, useEffect, useState } from "react"
import { ThemeContext } from "../../context/ThemeContext"

const DashboardHeader = () => {
  const { theme } = useContext(ThemeContext)
  const [stats, setStats] = useState({
    tvl: 1284930122,      // ₹128+ Cr
    volume: 12400000,    // ₹1.24 Cr
    volumeChange: 2.4,
  })

  // simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        const tvlMove = prev.tvl * (1 + (Math.random() - 0.5) * 0.1)
        const volumeMove = prev.volume * (1 + (Math.random() - 0.5) * 0.5)
        const change = (Math.random() - 0.5) * 6

        return {
          tvl: Math.floor(tvlMove),
          volume: Math.floor(volumeMove),
          volumeChange: change,
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Full Indian format (₹1,28,49,30,122)
  const formatINR = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num)
  }

  // Compact Indian format (₹128.49Cr)
  const formatCompactINR = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(num)
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Staking Dashboard</h1>
        <p className="text-slate-500">
          Maximize your returns by locking your assets in high-yield pools.
        </p>
      </div>

      <div className="flex gap-8">
        {/* TVL */}
        <div className="text-right">
          <span className="text-xs uppercase text-slate-500 block mb-1">
            Total Value Locked
          </span>
          <span
            className="text-xl font-bold"
            style={{ color: theme.accent }}
          >
            {formatCompactINR(stats.tvl)}
          </span>
        </div>

        {/* Volume */}
        <div className="text-right">
          <span className="text-xs uppercase text-slate-500 block mb-1">
            24h Volume
          </span>
          <span className="text-xl font-bold">
            {formatCompactINR(stats.volume)}
          </span>
          <span
            className={`text-sm ml-2 font-medium ${
              stats.volumeChange >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {stats.volumeChange >= 0 ? "+" : ""}
            {stats.volumeChange.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader