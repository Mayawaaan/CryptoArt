export class UpstreamError extends Error {
  constructor(message, { status = 502, provider = "unknown", upstreamStatus = null } = {}) {
    super(message)
    this.name = "UpstreamError"
    this.status = status
    this.provider = provider
    this.upstreamStatus = upstreamStatus
  }
}

export async function fetchJson(
  url,
  { provider = "upstream", timeoutMs = 7000, headers = {}, retries = 1, fetchImpl = fetch } = {}
) {
  let lastErr = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetchImpl(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "CryptoArt-Backend/1.0",
          ...headers,
        },
        signal: controller.signal,
      })

      if (!response.ok) {
        const bodyText = await response.text().catch(() => "")
        const err = new UpstreamError(
          `${provider} returned HTTP ${response.status}${bodyText ? `: ${bodyText.slice(0, 120)}` : ""}`,
          {
            status: response.status === 429 ? 429 : 502,
            provider,
            upstreamStatus: response.status,
          }
        )
        if (response.status >= 500 && attempt < retries) {
          lastErr = err
          continue
        }
        throw err
      }

      return await response.json()
    } catch (err) {
      if (err instanceof UpstreamError) {
        throw err
      }
      lastErr = new UpstreamError(
        err.name === "AbortError"
          ? `${provider} request timed out after ${timeoutMs}ms`
          : `${provider} request failed: ${err.message}`,
        { status: 504, provider }
      )
      if (attempt < retries) continue
      throw lastErr
    } finally {
      clearTimeout(timer)
    }
  }

  throw lastErr
}
