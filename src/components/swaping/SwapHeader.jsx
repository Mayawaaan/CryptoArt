import { RefreshCw, History } from "lucide-react"

const SwapHeader = () => (
  <div className="flex justify-between items-center mb-6">
    <div className="flex gap-6 text-lg font-semibold">
      <button className="text-white">Swap</button>
      <button className="text-gray-500 hover:text-white transition">
        Buy
      </button>
    </div>

    <div className="flex items-center gap-4 text-gray-400">
      <RefreshCw size={18} className="hover:text-white cursor-pointer" />
      <History size={18} className="hover:text-white cursor-pointer" />
    </div>
  </div>
)

export default SwapHeader