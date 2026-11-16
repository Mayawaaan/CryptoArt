import { ArrowUpDown } from "lucide-react"

const SwapSwitchButton = ({ onClick }) => (
  <div className="flex justify-center -my-2.5 relative z-10">
    <button
      type="button"
      onClick={onClick}
      aria-label="Swap pay and receive tokens"
      className="cursor-pointer bg-ca-bg border border-ca-border-strong hover:border-ca-accent p-2.5 rounded-full transition-colors duration-200"
    >
      <ArrowUpDown size={16} className="text-ca-accent" />
    </button>
  </div>
)

export default SwapSwitchButton
