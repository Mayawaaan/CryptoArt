import { useContext, useEffect, useState } from "react"
import { ThemeContext } from "../../context/ThemeContext"
import { CircleArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const PoolCard = ({ title, description, baseApy, lockDays }) => {
  const { theme } = useContext(ThemeContext)
  const navigate = useNavigate()

  const [data, setData] = useState({
    apy: baseApy,
    min: 5000,
    total: 125000000,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const apyMove = prev.apy + (Math.random() - 0.5) * 0.5
        const totalMove =
          prev.total * (1 + (Math.random() - 0.5) * 0.02)

        return {
          ...prev,
          apy: Number(apyMove.toFixed(2)),
          total: Math.floor(totalMove),
        }
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const formatINR = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num)
  }

  const formatCompactINR = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(num)
  }

  // Convert title into URL-safe slug
  const slug = title.toLowerCase().replace(/\s+/g, "-")

  const handleStake = () => {
    navigate(`/stake/${slug}`)
  }

  const handleDetails = () => {
    navigate(`/pool/${slug}`)
  }

  return (
    <div
      className="p-8 rounded-2xl shadow hover:shadow-xl transition flex flex-col"
      style={{ backgroundColor: theme.primary }}
    >

      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h4 className="text-xl font-bold">{title}</h4>
          <p className="text-sm text-slate-500">{description}</p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 uppercase block mb-1">
            APY
          </span>
          <span
            className={`text-2xl font-bold ${
              data.apy >= baseApy
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {data.apy}%
          </span>
        </div>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-3 gap-4 py-6 border-y mb-6"
        style={{ borderColor: theme.background }}
      >
        <div>
          <span className="text-xs text-slate-500 block">Lock</span>
          <span className="font-semibold">
            {lockDays} Days
          </span>
        </div>

        <div>
          <span className="text-xs text-slate-500 block">Min</span>
          <span className="font-semibold">
            {formatINR(data.min)}
          </span>
        </div>

        <div>
          <span className="text-xs text-slate-500 block">Total</span>
          <span className="font-semibold">
            {formatCompactINR(data.total)}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleStake}
          className="group cursor-pointer relative flex items-center gap-2 px-6 py-3 rounded-xl text-amber-400 border border-amber-400 overflow-hidden transition-all duration-300"
        >
          <span className="absolute inset-0 bg-amber-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
          <span className="relative z-10 group-hover:text-black transition-colors duration-300 flex items-center gap-2">
            Stake Now
            <CircleArrowRight size={20} />
          </span>
        </button>

        <button
          onClick={handleDetails}
          className="cursor-pointer group relative flex items-center gap-2 px-6 py-3 rounded-xl text-blue-400 border border-blue-400 overflow-hidden transition-all duration-300"
        >
          <span className="absolute inset-0 bg-blue-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
          <span className="relative z-10 group-hover:text-black transition-colors duration-300 flex items-center gap-2">
            Details
            <CircleArrowRight size={20} />
          </span>
        </button>
      </div>
    </div>
  )
}

export default PoolCard