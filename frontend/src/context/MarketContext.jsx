import { useCallback, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { TOKENS } from "../data/currency"
import { MarketContext } from "./marketContextObject"
import {
  fetchAssetHistory,
  fetchAssetTrades,
  fetchMarkets,
} from "../services/marketApi"

export const MarketProvider = ({ children }) => {
  const [searchParams] = useSearchParams()
  const requestedAsset = searchParams.get("asset")

  const [vsCurrency, setVsCurrency] = useState("INR")
  const [days, setDays] = useState(7)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("crypto")

  const [marketItems, setMarketItems] = useState([])
  const [marketsMeta, setMarketsMeta] = useState({
    loading: true,
    error: "",
    source: "",
    asOf: "",
    stale: false,
  })

  const [selectedSymbol, setSelectedSymbol] = useState(() => {
    if (requestedAsset) {
      return requestedAsset.split("-")[0].toUpperCase()
    }
    return "BTC"
  })

  const [chartState, setChartState] = useState({
    loading: true,
    error: "",
    points: [],
    source: "",
    asOf: "",
    stale: false,
  })

  const [tradesState, setTradesState] = useState({
    loading: true,
    error: "",
    available: false,
    reason: "",
    trades: [],
    source: "",
    asOf: "",
    stale: false,
  })

  // Synchronize initial tab if deep-linked to a forex asset
  useEffect(() => {
    if (!requestedAsset) return
    const key = requestedAsset.split("-")[0].toLowerCase()
    const match = TOKENS.find(
      (t) => t.id.toLowerCase() === key || t.symbol.toLowerCase() === key
    )
    if (match) {
      setSelectedSymbol(match.symbol.toUpperCase())
      setActiveTab(match.type)
    }
  }, [requestedAsset])

  const loadMarkets = useCallback(async (signal, currency) => {
    try {
      setMarketsMeta((prev) => ({ ...prev, loading: true, error: "" }))
      const res = await fetchMarkets(currency.toLowerCase(), signal)
      const combined = [...(res.data?.crypto || []), ...(res.data?.forex || [])]
      setMarketItems(combined)
      setMarketsMeta({
        loading: false,
        error: "",
        source: res.source || "",
        asOf: res.asOf || "",
        stale: Boolean(res.stale),
      })
    } catch (err) {
      if (err.name === "AbortError") return
      setMarketsMeta((prev) => ({
        ...prev,
        loading: false,
        error: err.message || "Unable to fetch market snapshot.",
      }))
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    loadMarkets(controller.signal, vsCurrency)
    const timer = setInterval(() => loadMarkets(controller.signal, vsCurrency), 45_000)
    return () => {
      controller.abort()
      clearInterval(timer)
    }
  }, [loadMarkets, vsCurrency])

  const allAssets = useMemo(() => {
    if (marketItems.length > 0) return marketItems
    return TOKENS.map((t) => ({
      id: t.id,
      symbol: t.symbol,
      name: t.name,
      type: t.type,
      current_price: null,
      price_change_percentage_24h: null,
      source: "unavailable",
    }))
  }, [marketItems])

  const selectedCoin = useMemo(() => {
    return (
      allAssets.find((a) => a.symbol.toUpperCase() === selectedSymbol.toUpperCase()) ||
      allAssets[0]
    )
  }, [allAssets, selectedSymbol])

  const filteredCoins = useMemo(() => {
    return allAssets.filter((coin) => {
      const matchesTab = coin.type === activeTab
      const matchesSearch =
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [allAssets, search, activeTab])

  const loadHistoryAndTrades = useCallback(
    async (assetSymbol, currency, rangeDays, signal) => {
      const assetKey = assetSymbol.toLowerCase()
      setChartState((prev) => ({ ...prev, loading: true, error: "" }))
      setTradesState((prev) => ({ ...prev, loading: true, error: "" }))

      const [histResult, tradesResult] = await Promise.allSettled([
        fetchAssetHistory(assetKey, currency.toLowerCase(), rangeDays, signal),
        fetchAssetTrades(assetKey, currency.toLowerCase(), 20, signal),
      ])

      if (signal?.aborted) return

      if (histResult.status === "fulfilled") {
        const res = histResult.value
        setChartState({
          loading: false,
          error: "",
          points: res.data?.points || [],
          source: res.source || "",
          asOf: res.asOf || "",
          stale: Boolean(res.stale),
        })
      } else if (histResult.reason?.name !== "AbortError") {
        setChartState({
          loading: false,
          error: histResult.reason?.message || "Historical chart unavailable.",
          points: [],
          source: "",
          asOf: "",
          stale: false,
        })
      }

      if (tradesResult.status === "fulfilled") {
        const res = tradesResult.value
        setTradesState({
          loading: false,
          error: "",
          available: Boolean(res.data?.available),
          reason: res.data?.reason || "",
          trades: res.data?.trades || [],
          source: res.source || "",
          asOf: res.asOf || "",
          stale: Boolean(res.stale),
        })
      } else if (tradesResult.reason?.name !== "AbortError") {
        setTradesState({
          loading: false,
          error: tradesResult.reason?.message || "Recent trade stream unavailable.",
          available: false,
          reason: "",
          trades: [],
          source: "",
          asOf: "",
          stale: false,
        })
      }
    },
    []
  )

  useEffect(() => {
    if (!selectedCoin?.symbol) return undefined
    const controller = new AbortController()
    loadHistoryAndTrades(selectedCoin.symbol, vsCurrency, days, controller.signal)
    return () => controller.abort()
  }, [selectedCoin?.symbol, vsCurrency, days, loadHistoryAndTrades])

  const setSelectedCoin = useCallback((coin) => {
    if (coin?.symbol) {
      setSelectedSymbol(coin.symbol.toUpperCase())
    }
  }, [])

  const refreshAll = useCallback(() => {
    loadMarkets(undefined, vsCurrency)
    if (selectedCoin?.symbol) {
      loadHistoryAndTrades(selectedCoin.symbol, vsCurrency, days)
    }
  }, [loadMarkets, loadHistoryAndTrades, selectedCoin?.symbol, vsCurrency, days])

  return (
    <MarketContext.Provider
      value={{
        filteredCoins,
        selectedCoin,
        setSelectedCoin,
        search,
        setSearch,
        activeTab,
        setActiveTab,
        vsCurrency,
        setVsCurrency,
        days,
        setDays,
        price: selectedCoin?.current_price ?? null,
        change: selectedCoin?.price_change_percentage_24h ?? null,
        chartData: chartState.points,
        chartState,
        tradesState,
        marketsMeta,
        refreshAll,
      }}
    >
      {children}
    </MarketContext.Provider>
  )
}
