import { fetchJson } from "../utils/http.js"

const BASE_URL = "https://api.coingecko.com/api/v3"

export function createCoinGeckoAdapter({ apiKey = "", timeoutMs = 7000, fetchImpl = fetch } = {}) {
  const headers = apiKey ? { "x-cg-demo-api-key": apiKey } : {}

  return {
    name: "coingecko",

    async getMarkets(vsCurrency = "inr", ids = []) {
      const params = new URLSearchParams({
        vs_currency: vsCurrency.toLowerCase(),
        ids: ids.join(","),
        order: "market_cap_desc",
        per_page: "50",
        page: "1",
        sparkline: "true",
        price_change_percentage: "24h",
      })

      const json = await fetchJson(`${BASE_URL}/coins/markets?${params.toString()}`, {
        provider: "coingecko",
        timeoutMs,
        headers,
        fetchImpl,
      })

      return (Array.isArray(json) ? json : []).map((coin) => ({
        coingeckoId: coin.id,
        symbol: String(coin.symbol || "").toUpperCase(),
        name: coin.name,
        current_price: Number(coin.current_price),
        market_cap: coin.market_cap !== null && coin.market_cap !== undefined ? Number(coin.market_cap) : null,
        volume: coin.total_volume !== null && coin.total_volume !== undefined ? Number(coin.total_volume) : null,
        price_change_percentage_24h:
          coin.price_change_percentage_24h !== null && coin.price_change_percentage_24h !== undefined
            ? Number(coin.price_change_percentage_24h)
            : null,
        sparkline_in_7d: Array.isArray(coin.sparkline_in_7d?.price)
          ? { price: coin.sparkline_in_7d.price }
          : null,
        last_updated: coin.last_updated || new Date().toISOString(),
      }))
    },

    async getMarketChart(coingeckoId, vsCurrency = "inr", days = 7) {
      const params = new URLSearchParams({
        vs_currency: vsCurrency.toLowerCase(),
        days: String(days),
      })

      const json = await fetchJson(
        `${BASE_URL}/coins/${encodeURIComponent(coingeckoId)}/market_chart?${params.toString()}`,
        {
          provider: "coingecko",
          timeoutMs,
          headers,
          fetchImpl,
        }
      )

      const prices = Array.isArray(json.prices) ? json.prices : []
      return prices.map(([ts, price]) => {
        const d = new Date(ts)
        return {
          timestamp: d.toISOString(),
          time: days <= 1 ? d.toLocaleTimeString("en-IN", { hour12: false, hour: "2-digit", minute: "2-digit" }) : d.toISOString().slice(0, 10),
          price: Number(price),
        }
      })
    },
  }
}
