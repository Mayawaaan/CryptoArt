import { useContext, useEffect, useState } from "react"
import { ThemeContext } from "../../context/ThemeContext"

const StatsCards = () => {
  const { theme } = useContext(ThemeContext)

  const [stats, setStats] = useState({
    totalStaked: 4285000,
    rewards: 142012,
    avgApy: 14.8,
    change: 2.4,
  })

  const [showModal, setShowModal] = useState(false)
  const [isClaimed, setIsClaimed] = useState(false)

useEffect(() => {
  const interval = setInterval(() => {
    setStats((prev) => {

      const stakedMove =
        prev.totalStaked * (1 + (Math.random() - 0.5) * 0.02)

      const apyMove =
        prev.avgApy + (Math.random() - 0.5) * 0.4

      const changeMove =
        (Math.random() - 0.5) * 6

      let rewardsMove

      if (isClaimed) {
        // During claim pause → keep at minimum 1
        rewardsMove = Math.max(prev.rewards, 1)
      } else {
        // Grow but never allow below 1
        const growth =
          prev.rewards + (80 + (Math.random() - 0.5) * 5)

        rewardsMove = Math.max(growth, 1)
      }

      return {
        totalStaked: Math.floor(stakedMove),
        rewards: Math.floor(rewardsMove),
        avgApy: Number(apyMove.toFixed(2)),
        change: Number(changeMove.toFixed(2)),
      }
    })
  }, 5000)

  return () => clearInterval(interval)
}, [isClaimed])

  const formatINR = (num) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num)

const handleClaim = () => {
  setShowModal(true)
  setIsClaimed(true)

  setStats((prev) => ({
    ...prev,
    rewards: 1, // Minimum allowed value
  }))

  setTimeout(() => {
    setIsClaimed(false)
  }, 5000)
}

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Staked */}
        <div
          className="p-6 rounded-2xl shadow"
          style={{ backgroundColor: theme.primary }}
        >
          <span className="text-slate-500 font-medium">
            Total Staked Balance
          </span>

          <div className="flex items-baseline gap-2 mt-3">
            <h2 className="text-3xl sm:text-4xl font-bold">
              {formatINR(stats.totalStaked)}
            </h2>

            <span
              className={`text-sm font-semibold ${
                stats.change >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {stats.change >= 0 ? "+" : ""}
              {stats.change}%
            </span>
          </div>

          <p className="text-sm text-slate-400 mt-2">
            ≈ 12.45 ETH + 4.5 BTC
          </p>
        </div>

        {/* Estimated Rewards */}
        <div
          className="p-6 rounded-2xl shadow"
          style={{ backgroundColor: theme.primary }}
        >
          <span className="text-slate-500 font-medium">
            Estimated Rewards
          </span>

          <h2
            className="text-3xl sm:text-4xl font-bold mt-3"
            style={{ color: theme.accent }}
          >
            {formatINR(stats.rewards)}
          </h2>

          <button
            onClick={handleClaim}
            className="mt-4 w-full py-2 rounded-lg font-bold transition hover:opacity-90"
            style={{
              backgroundColor: theme.accent + "20",
              color: theme.accent,
            }}
          >
            Claim All Rewards
          </button>
        </div>

        {/* Average APY */}
        <div
          className="p-6 rounded-2xl shadow"
          style={{ backgroundColor: theme.primary }}
        >
          <span className="text-slate-500 font-medium">
            Average APY
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold mt-3">
            {stats.avgApy}%
          </h2>

          <div className="w-full bg-slate-200 h-2 rounded-full mt-6 overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                backgroundColor: theme.accent,
                width: `${Math.min(stats.avgApy, 30)}%`,
              }}
            />
          </div>
        </div>

      </div>

      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div
            className="rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
            style={{ backgroundColor: theme.primary }}
          >
            <h2 className="text-xl font-bold text-white">
              Rewards Claimed 🎉
            </h2>

            <p className="text-slate-400 text-sm mt-3">
              Your staking rewards have been successfully added to your wallet.
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full py-2 rounded-lg font-semibold"
              style={{
                backgroundColor: theme.accent,
                color: "#000",
              }}
            >
              Close
            </button>
          </div>

        </div>
      )}
    </>
  )
}

export default StatsCards