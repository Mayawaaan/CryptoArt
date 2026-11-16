import React from "react"
import { ChevronDown } from "lucide-react"

const SwapInputBox = ({
  id,
  label,
  amount,
  onChange,
  token,
  onTokenClick,
  inrValue,
}) => {
  return (
    <div className="bg-ca-bg border border-ca-border rounded-2xl p-4">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="text-xs font-medium text-ca-text-muted">
          {label}
        </label>
        <span className="text-xs font-mono text-ca-text-muted">
          {token.isLive ? "Live Reference" : "Baseline Quote"}
        </span>
      </div>

      <div className="flex justify-between items-center gap-3">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={onChange}
          placeholder="0.00"
          className="bg-transparent text-2xl sm:text-3xl font-mono tabular-nums font-semibold text-ca-text outline-none w-full min-w-0"
        />

        <button
          type="button"
          onClick={onTokenClick}
          className="cursor-pointer shrink-0 flex items-center gap-2 bg-ca-surface border border-ca-border hover:border-ca-accent px-3 py-2 rounded-xl transition-colors"
        >
          {token.icon ? (
            <img src={token.icon} alt={token.symbol} className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-ca-accent-soft text-ca-accent border border-ca-accent-border">
              {token.symbolChar || token.symbol.charAt(0)}
            </div>
          )}
          <span className="font-semibold text-sm text-ca-text">{token.symbol}</span>
          <ChevronDown size={15} className="text-ca-text-muted" aria-hidden="true" />
        </button>
      </div>

      <div className="text-xs font-mono tabular-nums text-ca-text-muted mt-2">{inrValue}</div>
    </div>
  )
}

export default SwapInputBox
