import React from "react"

const SwapDetails = ({ payToken, receiveToken, roundTo6, asOf, executionLabel = "Demo Wallet (1 CR fee)" }) => (
  <div className="bg-ca-bg border border-ca-border rounded-xl p-3.5 mt-4 text-xs text-ca-text-muted space-y-1.5 font-mono tabular-nums">
    <div className="flex justify-between">
      <span>Reference Rate</span>
      <span className="text-ca-text-secondary">
        1 {payToken.symbol} = {roundTo6(payToken.price / receiveToken.price)} {receiveToken.symbol}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Simulated Slippage</span>
      <span className="text-ca-text-secondary">0.50%</span>
    </div>

    <div className="flex justify-between">
      <span>Execution Ledger</span>
      <span className="text-ca-accent">{executionLabel}</span>
    </div>

    {asOf && (
      <div className="flex justify-between">
        <span>Quote Timestamp</span>
        <span className="text-ca-text-secondary">
          {new Date(asOf).toLocaleTimeString("en-US", { hour12: false })}
        </span>
      </div>
    )}
  </div>
)

export default SwapDetails
