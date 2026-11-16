const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api"

async function requestDemoApi(path, { signal, method = "GET", body, isFormData = false } = {}) {
  const headers = {}
  if (body && !isFormData) {
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    signal,
    credentials: "include",
    headers: Object.keys(headers).length ? headers : undefined,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  })

  const json = await response.json().catch(() => null)
  if (!response.ok) {
    const message = json?.error?.message || `Request failed (${response.status})`
    const err = new Error(message)
    err.status = response.status
    err.code = json?.error?.code || "REQUEST_FAILED"
    throw err
  }

  return json
}

export function createIdempotencyKey(prefix = "demo") {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function fetchBackendHealth(signal) {
  return requestDemoApi("/health", { signal })
}

export function startDemoSession(displayAlias = "Demo Collector") {
  return requestDemoApi("/demo/session", {
    method: "POST",
    body: { displayAlias },
  })
}

export function fetchDemoWallet(signal) {
  return requestDemoApi("/demo/wallet", { signal })
}

export function resetDemoWallet() {
  return requestDemoApi("/demo/reset", {
    method: "POST",
    body: { confirm: true },
  })
}

export function fetchDemoTransactions({ page = 1, limit = 20 } = {}, signal) {
  return requestDemoApi(`/demo/transactions?page=${page}&limit=${limit}`, { signal })
}

export function executeDemoSwap(payload) {
  return requestDemoApi("/demo/swap", {
    method: "POST",
    body: {
      ...payload,
      idempotencyKey: payload.idempotencyKey || createIdempotencyKey("swap"),
    },
  })
}

export function fetchDemoStaking(signal) {
  return requestDemoApi("/demo/staking", { signal })
}

export function stakeDemoCredits(payload) {
  return requestDemoApi("/demo/staking/stake", {
    method: "POST",
    body: {
      ...payload,
      idempotencyKey: payload.idempotencyKey || createIdempotencyKey("stake"),
    },
  })
}

export function unstakeDemoPosition(positionId) {
  return requestDemoApi(`/demo/staking/${encodeURIComponent(positionId)}/unstake`, {
    method: "POST",
    body: {},
  })
}

export function uploadNftMedia(file) {
  const formData = new FormData()
  formData.append("image", file)
  return requestDemoApi("/uploads/nft", {
    method: "POST",
    body: formData,
    isFormData: true,
  })
}

export function fetchNfts(
  { search = "", category = "All", sort = "newest", status = "active", page = 1, limit = 12 } = {},
  signal
) {
  const params = new URLSearchParams()
  if (search) params.set("search", search)
  if (category && category !== "All") params.set("category", category)
  if (sort) params.set("sort", sort)
  if (status) params.set("status", status)
  params.set("page", String(page))
  params.set("limit", String(limit))
  return requestDemoApi(`/nfts?${params.toString()}`, { signal })
}

export function fetchNftDetail(id, signal) {
  return requestDemoApi(`/nfts/${encodeURIComponent(id)}`, { signal })
}

export function createNftListing(payload) {
  return requestDemoApi("/nfts", {
    method: "POST",
    body: payload,
  })
}

export function updateNftListing(id, payload) {
  return requestDemoApi(`/nfts/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: payload,
  })
}

export function deleteNftListing(id) {
  return requestDemoApi(`/nfts/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })
}

export function purchaseDemoNft(id, idempotencyKey) {
  return requestDemoApi(`/nfts/${encodeURIComponent(id)}/purchase`, {
    method: "POST",
    body: {
      idempotencyKey: idempotencyKey || createIdempotencyKey("buy"),
    },
  })
}

export function placeDemoNftBid(id, amountCredits, idempotencyKey) {
  return requestDemoApi(`/nfts/${encodeURIComponent(id)}/bids`, {
    method: "POST",
    body: {
      amountCredits,
      idempotencyKey: idempotencyKey || createIdempotencyKey("bid"),
    },
  })
}

export function fetchMyNfts({ page = 1, limit = 24 } = {}, signal) {
  return requestDemoApi(`/me/nfts?page=${page}&limit=${limit}`, { signal })
}

export function subscribeNewsletterEmail(email) {
  return requestDemoApi("/newsletter", {
    method: "POST",
    body: { email },
  })
}

export function submitSupportTicket(payload) {
  return requestDemoApi("/support-requests", {
    method: "POST",
    body: payload,
  })
}
