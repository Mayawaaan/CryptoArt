import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { useNavigate } from "react-router-dom"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { RefreshCw, ArrowUpRight } from "lucide-react"
import { useTheme } from "../../hooks/useThemeTokens"
import { fetchMarkets } from "../../services/marketApi"
import SectionHeader from "../ui/SectionHeader"
import Tabs from "../ui/Tabs"
import StatusBadge from "../ui/StatusBadge"
import Button from "../ui/Button"
import { SkeletonTable } from "../ui/Skeleton"

gsap.registerPlugin(ScrollTrigger)

const FEATURED_SYMBOLS = new Set(["BTC", "ETH", "SOL", "USD", "EUR", "GBP"])

const formatMarketPrice = (value, currency = "INR") => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "Unavailable"
  const num = Number(value)
  const locale = currency === "INR" ? "en-IN" : "en-US"
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: Math.abs(num) < 1000 ? 2 : 0,
    maximumFractionDigits: Math.abs(num) < 1000 ? 4 : 2,
  }).format(num)
}

const formatCompactMetric = (value, currency = "INR") => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--"
  const locale = currency === "INR" ? "en-IN" : "en-US"
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(Number(value))
}

const MarketSection = () => {
  const [assets, setAssets] = useState([])
  const [meta, setMeta] = useState({ source: "", asOf: "", stale: false })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [vsCurrency, setVsCurrency] = useState("INR")

  const navigate = useNavigate()
  const containerRef = useRef(null)
  const { tokens } = useTheme()

  const loadSnapshot = useCallback(async (signal, currency) => {
    try {
      setLoading(true)
      setError("")
      const res = await fetchMarkets(currency.toLowerCase(), signal)
      const combined = [...(res.data?.crypto || []), ...(res.data?.forex || [])]
      const featured = combined.filter((item) => FEATURED_SYMBOLS.has(item.symbol))
      setAssets(featured)
      setMeta({
        source: res.source || "unknown",
        asOf: res.asOf || "",
        stale: Boolean(res.stale),
      })
    } catch (err) {
      if (err.name === "AbortError") return
      setError(err.message || "Market service unavailable.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    loadSnapshot(controller.signal, vsCurrency)
    const interval = setInterval(() => {
      loadSnapshot(controller.signal, vsCurrency)
    }, 60_000)

    return () => {
      controller.abort()
      clearInterval(interval)
    }
  }, [loadSnapshot, vsCurrency])

  useLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) return undefined

    const ctx = gsap.context(() => {
      gsap.from(".home-market-frame", {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 82%",
          once: true,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="bg-ca-bg py-16 lg:py-24 px-4 sm:px-6 text-ca-text">
      <div className="container mx-auto space-y-8">
        <SectionHeader
          eyebrow="Market Snapshot"
          title={`Crypto & FX Feeds (${vsCurrency})`}
          description="Live spot prices alongside ECB central-bank reference benchmarks."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Tabs
                value={vsCurrency}
                onChange={setVsCurrency}
                layoutId="home-vs-currency"
                ariaLabel="Quote currency"
                items={[
                  { value: "INR", label: "INR" },
                  { value: "USD", label: "USD" },
                  { value: "EUR", label: "EUR" },
                  { value: "GBP", label: "GBP" },
                ]}
              />
              {meta.asOf && (
                <StatusBadge tone={meta.stale ? "warning" : "neutral"}>
                  {meta.stale ? "Stale" : "Live"} ·{" "}
                  {new Date(meta.asOf).toLocaleTimeString("en-US", { hour12: false })}
                </StatusBadge>
              )}
            </div>
          }
        />

        <div className="home-market-frame">
          {error && assets.length === 0 ? (
            <div className="bg-ca-surface border border-ca-border rounded-2xl p-8 text-center space-y-4">
              <p className="text-ca-text font-semibold">Live market feed unavailable</p>
              <p className="text-sm text-ca-text-muted max-w-md mx-auto">{error}</p>
              <Button variant="primary" size="sm" onClick={() => loadSnapshot(undefined, vsCurrency)}>
                <RefreshCw size={14} aria-hidden="true" />
                Retry Feed
              </Button>
            </div>
          ) : loading && assets.length === 0 ? (
            <div className="bg-ca-surface border border-ca-border rounded-2xl p-6">
              <SkeletonTable rows={6} />
            </div>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                {assets.map((asset) => {
                  const changePct = asset.price_change_percentage_24h
                  const hasChange = changePct !== null && changePct !== undefined
                  const isPositive = hasChange ? changePct >= 0 : true
                  const spark = asset.sparkline_in_7d?.price
                  return (
                    <button
                      type="button"
                      key={asset.id}
                      onClick={() => navigate(`/market-track?asset=${encodeURIComponent(asset.id)}`)}
                      className="cursor-pointer text-left bg-ca-surface border border-ca-border hover:border-ca-accent p-5 rounded-2xl space-y-4 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-xs font-mono uppercase tracking-wider text-ca-text-muted">
                            {asset.symbol} · {asset.type === "forex" ? "ECB Ref" : "Spot"}
                          </p>
                          <h3 className="text-base font-semibold text-ca-text mt-0.5">
                            {asset.name}
                          </h3>
                        </div>
                        <ArrowUpRight size={16} className="text-ca-text-muted shrink-0" aria-hidden="true" />
                      </div>

                      <div className="flex items-baseline justify-between border-b border-ca-divider pb-3">
                        <p className="text-lg font-mono tabular-nums font-semibold text-ca-text">
                          {formatMarketPrice(asset.current_price, vsCurrency)}
                        </p>
                        {hasChange ? (
                          <span
                            className={`text-xs font-mono tabular-nums font-semibold ${
                              isPositive ? "text-ca-positive" : "text-ca-negative"
                            }`}
                          >
                            {isPositive ? "+" : ""}
                            {changePct.toFixed(2)}%
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-ca-text-muted">Ref. Rate</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono tabular-nums text-ca-text-secondary">
                        <span>Vol: {formatCompactMetric(asset.volume, vsCurrency)}</span>
                        <span>Cap: {formatCompactMetric(asset.market_cap, vsCurrency)}</span>
                      </div>

                      {Array.isArray(spark) && spark.length > 1 && (
                        <div className="h-12 w-full min-w-0">
                          <ResponsiveContainer width="100%" height={48} minWidth={120}>
                            <LineChart data={spark.map((p) => ({ price: p }))}>
                              <Line
                                type="monotone"
                                dataKey="price"
                                stroke={isPositive ? tokens.chartSeries1 : tokens.chartSeries3}
                                dot={false}
                                strokeWidth={1.75}
                                isAnimationActive={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block bg-ca-surface rounded-2xl border border-ca-border overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-ca-bg text-[11px] uppercase tracking-wider text-ca-text-muted border-b border-ca-border">
                    <tr>
                      <th className="px-6 py-3.5 font-semibold">Asset</th>
                      <th className="px-6 py-3.5 font-semibold">7D Trend</th>
                      <th className="px-6 py-3.5 font-semibold text-right">Price ({vsCurrency})</th>
                      <th className="px-6 py-3.5 font-semibold text-right">24h Change</th>
                      <th className="px-6 py-3.5 font-semibold text-right">24h Volume</th>
                      <th className="px-6 py-3.5 font-semibold text-right">Market Cap</th>
                      <th className="px-6 py-3.5 font-semibold text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ca-divider">
                    {assets.map((asset) => {
                      const changePct = asset.price_change_percentage_24h
                      const hasChange = changePct !== null && changePct !== undefined
                      const isPositive = hasChange ? changePct >= 0 : true
                      const spark = asset.sparkline_in_7d?.price
                      return (
                        <tr
                          key={asset.id}
                          onClick={() =>
                            navigate(`/market-track?asset=${encodeURIComponent(asset.id)}`)
                          }
                          className="cursor-pointer hover:bg-ca-surface-raised transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-ca-text group-hover:text-ca-accent transition-colors">
                              {asset.name}
                            </p>
                            <p className="text-xs font-mono text-ca-text-muted">
                              {asset.symbol} · {asset.type === "forex" ? "ECB Ref" : "Spot"}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            {Array.isArray(spark) && spark.length > 1 ? (
                              <div className="h-9 w-28">
                                <ResponsiveContainer width={112} height={36}>
                                  <LineChart data={spark.map((p) => ({ price: p }))}>
                                    <Line
                                      type="monotone"
                                      dataKey="price"
                                      stroke={isPositive ? tokens.chartSeries1 : tokens.chartSeries3}
                                      dot={false}
                                      strokeWidth={1.75}
                                      isAnimationActive={false}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            ) : (
                              <span className="text-xs font-mono text-ca-text-muted">--</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right font-mono tabular-nums text-sm font-semibold text-ca-text">
                            {formatMarketPrice(asset.current_price, vsCurrency)}
                          </td>
                          <td className="px-6 py-4 text-right font-mono tabular-nums text-xs font-semibold">
                            {hasChange ? (
                              <span className={isPositive ? "text-ca-positive" : "text-ca-negative"}>
                                {isPositive ? "+" : ""}
                                {changePct.toFixed(2)}%
                              </span>
                            ) : (
                              <span className="text-ca-text-muted">Benchmark</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right font-mono tabular-nums text-xs text-ca-text-secondary">
                            {formatCompactMetric(asset.volume, vsCurrency)}
                          </td>
                          <td className="px-6 py-4 text-right font-mono tabular-nums text-xs text-ca-text-secondary">
                            {formatCompactMetric(asset.market_cap, vsCurrency)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <ArrowUpRight
                              size={16}
                              className="inline text-ca-text-muted group-hover:text-ca-accent transition-colors"
                              aria-hidden="true"
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-start">
          <Button variant="secondary" onClick={() => navigate("/market-track")}>
            View Full Market Terminal
            <ArrowUpRight size={15} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default MarketSection
