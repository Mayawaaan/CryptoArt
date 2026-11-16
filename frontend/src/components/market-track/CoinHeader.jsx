import React from "react"
import { RefreshCw } from "lucide-react"
import { useMarket } from "../../hooks/useMarket"
import StatusBadge from "../ui/StatusBadge"
import Tabs from "../ui/Tabs"
import Button from "../ui/Button"

const formatPrice = (num, currency = "INR") => {
  if (num === null || num === undefined || Number.isNaN(Number(num))) return "Unavailable"
  const val = Number(num)
  const locale = currency === "INR" ? "en-IN" : "en-US"
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: Math.abs(val) < 1000 ? 2 : 0,
    maximumFractionDigits: Math.abs(val) < 1000 ? 4 : 2,
  }).format(val)
}

const CoinHeader = () => {
  const {
    selectedCoin,
    price,
    change,
    vsCurrency,
    setVsCurrency,
    days,
    setDays,
    marketsMeta,
    refreshAll,
  } = useMarket()

  const hasChange = change !== null && change !== undefined
  const isPositive = hasChange ? change >= 0 : true

  return (
    <div className="bg-ca-surface p-5 sm:p-6 rounded-2xl border border-ca-border space-y-5">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-ca-text">
              {selectedCoin?.name || "Asset"}
            </h2>
            <StatusBadge tone="neutral">
              {selectedCoin?.symbol} ·{" "}
              {selectedCoin?.type === "forex" ? "Central-Bank Ref" : "Spot"}
            </StatusBadge>
            {selectedCoin?.isPrototypePeg && (
              <StatusBadge tone="accent">Prototype Peg</StatusBadge>
            )}
            {marketsMeta.stale && <StatusBadge tone="warning">Stale Cache</StatusBadge>}
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-2xl sm:text-3xl font-mono tabular-nums font-semibold text-ca-accent">
              {formatPrice(price, vsCurrency)}
            </span>

            {hasChange ? (
              <StatusBadge tone={isPositive ? "positive" : "negative"} className="tabular-nums">
                {isPositive ? "+" : ""}
                {Number(change).toFixed(2)}% (24h)
              </StatusBadge>
            ) : (
              <span className="text-xs font-mono text-ca-text-muted">
                Daily ECB benchmark
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-ca-text-muted">
            <span>Source: {selectedCoin?.source || marketsMeta.source || "unavailable"}</span>
            {marketsMeta.asOf && (
              <span>
                As of{" "}
                {new Date(marketsMeta.asOf).toLocaleTimeString("en-US", { hour12: false })}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Tabs
            value={vsCurrency}
            onChange={setVsCurrency}
            layoutId="track-currency"
            ariaLabel="Quote currency"
            items={[
              { value: "INR", label: "INR" },
              { value: "USD", label: "USD" },
              { value: "EUR", label: "EUR" },
              { value: "GBP", label: "GBP" },
            ]}
          />

          <Tabs
            value={days}
            onChange={setDays}
            layoutId="track-interval"
            ariaLabel="Chart timeframe"
            items={[
              { value: 1, label: "1D" },
              { value: 7, label: "7D" },
              { value: 30, label: "30D" },
            ]}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={refreshAll}
            aria-label="Refresh market data"
          >
            <RefreshCw size={14} aria-hidden="true" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CoinHeader
