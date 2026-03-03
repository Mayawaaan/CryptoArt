import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

const PoolDetails = () => {
  const { pool } = useParams()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-400 mb-8 hover:text-white transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="max-w-4xl mx-auto bg-gray-900 p-10 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-4 capitalize">
          {pool.replace("-", " ")} Pool
        </h1>

        <p className="text-gray-400 mb-8">
          This staking pool allows users to earn rewards based on locked duration and APY performance.
        </p>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-gray-800 p-6 rounded-xl">
            <h4 className="text-gray-400 text-sm mb-2">Base APY</h4>
            <p className="text-xl font-bold text-green-400">14.8%</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h4 className="text-gray-400 text-sm mb-2">Lock Period</h4>
            <p className="text-xl font-bold">30 Days</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h4 className="text-gray-400 text-sm mb-2">Minimum Stake</h4>
            <p className="text-xl font-bold">₹5,000</p>
          </div>

        </div>

        <div className="mt-10 bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">About This Pool</h3>
          <p className="text-gray-400 leading-relaxed">
            This pool is designed for medium-term investors seeking stable APY returns.
            Rewards are calculated daily and distributed proportionally based on your
            staked amount and lock duration.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PoolDetails