function resolveApiBase() {
  let raw = (import.meta.env.VITE_API_BASE_URL || "/api").trim()
  raw = raw.replace(/^(https?:\/\/)+(https?:?\/\/)/i, "https://")
  raw = raw.replace(/^https\/\//i, "https://").replace(/\/+$/, "")
  if (raw.startsWith("http") && !raw.endsWith("/api")) {
    return `${raw}/api`
  }
  return raw || "/api"
}

const API_BASE = resolveApiBase()

async function requestApi(path, { signal, method = "GET", body } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    signal,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  const json = await response.json().catch(() => null)
  if (!response.ok) {
    const msg = json?.error?.message || `API request failed (${response.status})`
    const err = new Error(msg)
    err.status = response.status
    err.code = json?.error?.code
    throw err
  }

  return json
}

export function fetchMarkets(vsCurrency = "inr", signal) {
  return requestApi(`/markets?vsCurrency=${encodeURIComponent(vsCurrency)}`, { signal })
}

export function fetchAssetHistory(assetId, vsCurrency = "inr", days = 7, signal) {
  return requestApi(
    `/markets/${encodeURIComponent(assetId)}/history?vsCurrency=${encodeURIComponent(
      vsCurrency
    )}&days=${encodeURIComponent(days)}`,
    { signal }
  )
}

export function fetchAssetTrades(assetId, vsCurrency = "inr", limit = 20, signal) {
  return requestApi(
    `/markets/${encodeURIComponent(assetId)}/trades?vsCurrency=${encodeURIComponent(
      vsCurrency
    )}&limit=${encodeURIComponent(limit)}`,
    { signal }
  )
}

export function fetchDexPairs(query, signal) {
  return requestApi(`/dex/pairs?q=${encodeURIComponent(query)}`, { signal })
}

export function fetchNftBids(signal) {
  return requestApi("/nft/bids", { signal })
}

export function submitNftBid(payload, signal) {
  return requestApi("/nft/bids", { method: "POST", body: payload, signal })
}
