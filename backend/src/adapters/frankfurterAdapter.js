import { fetchJson } from "../utils/http.js"

const BASE_URL = "https://api.frankfurter.dev/v1"

export function createFrankfurterAdapter({ timeoutMs = 7000, fetchImpl = fetch } = {}) {
  return {
    name: "frankfurter",

    async getLatestRates(base = "INR", symbols = []) {
      const upperBase = base.toUpperCase()
      const filteredSymbols = symbols
        .map((s) => s.toUpperCase())
        .filter((s) => s !== upperBase)

      const params = new URLSearchParams({ base: upperBase })
      if (filteredSymbols.length > 0) {
        params.set("symbols", filteredSymbols.join(","))
      }

      const json = await fetchJson(`${BASE_URL}/latest?${params.toString()}`, {
        provider: "frankfurter",
        timeoutMs,
        fetchImpl,
      })

      return {
        base: json.base,
        date: json.date,
        rates: json.rates || {},
        asOf: json.date ? new Date(`${json.date}T16:00:00.000Z`).toISOString() : new Date().toISOString(),
      }
    },

    async getHistoricalSeries(quoteCurrency, baseCurrency = "INR", days = 30) {
      const quote = quoteCurrency.toUpperCase()
      const base = baseCurrency.toUpperCase()

      if (quote === base) {
        const now = new Date()
        return {
          points: [{ timestamp: now.toISOString(), time: now.toISOString().slice(0, 10), price: 1 }],
          asOf: now.toISOString(),
        }
      }

      const end = new Date()
      const start = new Date(end.getTime() - Math.max(days, 2) * 24 * 60 * 60 * 1000)
      const startStr = start.toISOString().slice(0, 10)
      const endStr = end.toISOString().slice(0, 10)

      const url = `${BASE_URL}/${startStr}..${endStr}?base=${encodeURIComponent(quote)}&symbols=${encodeURIComponent(base)}`
      const json = await fetchJson(url, {
        provider: "frankfurter",
        timeoutMs,
        fetchImpl,
      })

      const ratesObj = json.rates || {}
      const points = Object.entries(ratesObj)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([dateStr, entry]) => ({
          timestamp: new Date(`${dateStr}T16:00:00.000Z`).toISOString(),
          time: dateStr,
          price: Number(entry[base]),
        }))
        .filter((p) => Number.isFinite(p.price))

      return {
        points,
        asOf: points.length > 0 ? points[points.length - 1].timestamp : new Date().toISOString(),
      }
    },
  }
}
