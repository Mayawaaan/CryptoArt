import { fetchJson } from "../utils/http.js"

const BASE_URL = "https://api.dexscreener.com/latest/dex"

export function createDexScreenerAdapter({ timeoutMs = 7000, fetchImpl = fetch } = {}) {
  return {
    name: "dexscreener",

    async searchPairs(query) {
      const json = await fetchJson(`${BASE_URL}/search?q=${encodeURIComponent(query)}`, {
        provider: "dexscreener",
        timeoutMs,
        fetchImpl,
      })

      const pairs = Array.isArray(json.pairs) ? json.pairs : []
      return pairs.slice(0, 12).map((pair) => ({
        chainId: pair.chainId,
        dexId: pair.dexId,
        pairAddress: pair.pairAddress,
        url: pair.url,
        baseToken: {
          symbol: pair.baseToken?.symbol,
          name: pair.baseToken?.name,
          address: pair.baseToken?.address,
        },
        quoteToken: {
          symbol: pair.quoteToken?.symbol,
          name: pair.quoteToken?.name,
          address: pair.quoteToken?.address,
        },
        priceUsd: pair.priceUsd !== undefined && pair.priceUsd !== null ? Number(pair.priceUsd) : null,
        priceNative: pair.priceNative !== undefined && pair.priceNative !== null ? Number(pair.priceNative) : null,
        priceChange24h: pair.priceChange?.h24 !== undefined ? Number(pair.priceChange.h24) : null,
        volume24hUsd: pair.volume?.h24 !== undefined ? Number(pair.volume.h24) : null,
        liquidityUsd: pair.liquidity?.usd !== undefined ? Number(pair.liquidity.usd) : null,
      }))
    },
  }
}
