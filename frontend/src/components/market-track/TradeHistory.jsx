import React from "react"
import { useMarket } from "../../hooks/useMarket"
import StatusBadge from "../ui/StatusBadge"
import { SkeletonTable } from "../ui/Skeleton"

const formatTradeValue = (num, currency = "INR") => {
  if (num === null || num === undefined || Number.isNaN(Number(num))) return "--"
  const val = Number(num)
  const locale = currency === "INR" ? "en-IN" : "en-US"
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: Math.abs(val) < 1000 ? 2 : 0,
    maximumFractionDigits: Math.abs(val) < 1000 ? 4 : 2,
  }).format(val)
}

const TradeHistory = () => {
  const { selectedCoin, tradesState, vsCurrency } = useMarket()

  return (
    <div className="bg-ca-surface rounded-2xl border border-ca-border text-ca-text overflow-hidden">
      <div className="px-5 py-4 border-b border-ca-border flex flex-wrap items-center justify-between gap-2 bg-ca-bg">
        <h3 className="font-semibold text-sm text-ca-text">
          Recent Spot Executions — {selectedCoin?.symbol}
        </h3>
        {tradesState.source && (
          <StatusBadge tone={tradesState.stale ? "warning" : "neutral"}>
            {tradesState.source}
            {tradesState.stale ? " · Stale" : ""}
          </StatusBadge>
        )}
      </div>

      {tradesState.loading && tradesState.trades.length === 0 ? (
        <div className="p-5">
          <SkeletonTable rows={4} />
        </div>
      ) : tradesState.error ? (
        <div className="p-6 text-sm text-ca-text-muted">{tradesState.error}</div>
      ) : !tradesState.available ? (
        <div className="p-6 text-sm text-ca-text-muted">
          {tradesState.reason || "Public spot trade feed unavailable for this asset."}
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-y-auto max-h-[340px]">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="text-[11px] text-ca-text-muted uppercase tracking-wider border-b border-ca-border bg-ca-bg sticky top-0">
                <tr>
                  <th className="px-5 py-3">Time</th>
                  <th className="px-5 py-3">Side</th>
                  <th className="px-5 py-3 text-right">Price ({vsCurrency})</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ca-divider font-mono tabular-nums text-xs">
                {tradesState.trades.map((trade) => {
                  const isBuy = trade.type === "Buy"
                  return (
                    <tr key={trade.id} className="hover:bg-ca-surface-raised transition-colors">
                      <td className="px-5 py-3 text-ca-text-muted">{trade.time}</td>
                      <td
                        className={`px-5 py-3 font-semibold ${
                          isBuy ? "text-ca-positive" : "text-ca-negative"
                        }`}
                      >
                        {isBuy ? "BUY" : "SELL"}
                      </td>
                      <td className="px-5 py-3 text-right text-ca-text">
                        {formatTradeValue(trade.price, vsCurrency)}
                      </td>
                      <td className="px-5 py-3 text-right text-ca-text-secondary">
                        {trade.amount} {trade.symbol}
                      </td>
                      <td className="px-5 py-3 text-right text-ca-text">
                        {formatTradeValue(trade.total, vsCurrency)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden max-h-[340px] overflow-y-auto p-4 space-y-2.5">
            {tradesState.trades.map((trade) => {
              const isBuy = trade.type === "Buy"
              return (
                <div
                  key={trade.id}
                  className="bg-ca-bg rounded-xl p-3.5 border border-ca-border text-xs font-mono tabular-nums space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-ca-text-muted">{trade.time}</span>
                    <span
                      className={`font-semibold ${
                        isBuy ? "text-ca-positive" : "text-ca-negative"
                      }`}
                    >
                      {isBuy ? "BUY" : "SELL"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ca-text-muted">Price</span>
                    <span className="text-ca-text">{formatTradeValue(trade.price, vsCurrency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ca-text-muted">Amount</span>
                    <span className="text-ca-text-secondary">
                      {trade.amount} {trade.symbol}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default TradeHistory
