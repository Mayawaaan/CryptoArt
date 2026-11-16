import { fetchJson } from "../utils/http.js"

const BASE_URL = "https://data-api.binance.vision"

export function createBinanceAdapter({ timeoutMs = 7000, fetchImpl = fetch } = {}) {
  return {
    name: "binance",

    async get24hrTickers(pairs = []) {
      if (!pairs.length) return []
      const encoded = encodeURIComponent(JSON.stringify(pairs))
      const json = await fetchJson(`${BASE_URL}/api/v3/ticker/24hr?symbols=${encoded}`, {
        provider: "binance",
        timeoutMs,
        fetchImpl,
      })

      return (Array.isArray(json) ? json : []).map((row) => ({
        pair: row.symbol,
        lastPriceUsd: Number(row.lastPrice),
        priceChangePercent24h: Number(row.priceChangePercent),
        quoteVolumeUsd: Number(row.quoteVolume),
        highPriceUsd: Number(row.highPrice),
        lowPriceUsd: Number(row.lowPrice),
      }))
    },

    async getKlines(pair, days = 7) {
      const interval = days <= 1 ? "15m" : days <= 7 ? "1h" : "4h"
      const limit = days <= 1 ? 96 : days <= 7 ? 168 : 180

      const params = new URLSearchParams({
        symbol: pair,
        interval,
        limit: String(limit),
      })

      const json = await fetchJson(`${BASE_URL}/api/v3/klines?${params.toString()}`, {
        provider: "binance",
        timeoutMs,
        fetchImpl,
      })

      return (Array.isArray(json) ? json : []).map((kline) => {
        const d = new Date(Number(kline[0]))
        return {
          timestamp: d.toISOString(),
          time:
            days <= 1
              ? d.toLocaleTimeString("en-IN", { hour12: false, hour: "2-digit", minute: "2-digit" })
              : `${d.toISOString().slice(5, 10)} ${d.toISOString().slice(11, 16)}`,
          priceUsd: Number(kline[4]),
        }
      })
    },

    async getRecentTrades(pair, limit = 20) {
      const params = new URLSearchParams({
        symbol: pair,
        limit: String(Math.min(Math.max(limit, 1), 50)),
      })

      const json = await fetchJson(`${BASE_URL}/api/v3/trades?${params.toString()}`, {
        provider: "binance",
        timeoutMs,
        fetchImpl,
      })

      return (Array.isArray(json) ? json : []).map((trade) => ({
        id: String(trade.id),
        timestamp: new Date(Number(trade.time)).toISOString(),
        time: new Date(Number(trade.time)).toLocaleTimeString("en-IN", { hour12: false }),
        type: trade.isBuyerMaker ? "Sell" : "Buy",
        priceUsd: Number(trade.price),
        amount: Number(trade.qty),
        totalUsd: Number(trade.quoteQty),
      }))
    },
  }
}
