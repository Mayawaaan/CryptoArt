import React from "react"
import { RefreshCw } from "lucide-react"
import Tabs from "../ui/Tabs"

const SwapHeader = ({ mode = "swap", onModeChange, onRefresh }) => (
  <div className="flex justify-between items-center mb-4">
    <Tabs
      value={mode}
      onChange={onModeChange}
      layoutId="swap-order-mode"
      ariaLabel="Order mode"
      items={[
        { value: "swap", label: "Swap" },
        { value: "buy", label: "Convert" },
      ]}
    />

    <button
      type="button"
      onClick={onRefresh}
      aria-label="Refresh quote rates"
      className="cursor-pointer p-2 rounded-lg text-ca-text-muted hover:text-ca-accent hover:bg-ca-surface-raised transition-colors"
    >
      <RefreshCw size={15} aria-hidden="true" />
    </button>
  </div>
)

export default SwapHeader
