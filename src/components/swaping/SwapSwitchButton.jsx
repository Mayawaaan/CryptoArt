import { ArrowUpDown } from "lucide-react"

const SwapSwitchButton = ({ onClick }) => (
  <div className="flex justify-center -my-2 relative z-10">
    <button
      onClick={onClick}
      className="bg-black border border-white/10 p-2 rounded-full hover:rotate-180 transition duration-300"
    >
      <ArrowUpDown size={18} className="text-amber-400" />
    </button>
  </div>
)

export default SwapSwitchButton