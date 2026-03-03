import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"

const StakePage = () => {
  const { pool } = useParams()
  const navigate = useNavigate()

  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const handleStake = async () => {
    if (!amount || amount <= 0) return alert("Enter valid amount")

    setLoading(true)

    // Simulated staking logic
    setTimeout(() => {
      setLoading(false)
      alert(`Successfully staked ₹${amount} in ${pool}`)
      navigate(-1)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="bg-gray-900 p-10 rounded-2xl w-full max-w-md shadow-xl">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-400 mb-6 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-2xl font-bold mb-2 capitalize">
          Stake in {pool.replace("-", " ")}
        </h1>

        <p className="text-gray-400 mb-6">
          Enter the amount you want to stake in this pool.
        </p>

        <input
          type="number"
          placeholder="Enter amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 mb-6 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button
          onClick={handleStake}
          className="group cursor-pointer relative flex items-center gap-2 px-6 py-3 rounded-xl text-amber-400 border border-amber-400 overflow-hidden transition-all duration-300"
        >
          <span className="absolute inset-0 bg-amber-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
          <span className="relative z-10 group-hover:text-black transition-colors duration-300 flex items-center gap-2">
            {loading ? "Processing..." : "Confirm Stake"}
          </span>
        </button>
      </div>
    </div>
  )
}

export default StakePage