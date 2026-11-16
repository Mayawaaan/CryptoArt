export class MemoryCache {
  constructor() {
    this.store = new Map()
    this.inflight = new Map()
  }

  async getOrFetch(key, { ttlMs, staleTtlMs = ttlMs * 10, fetcher }) {
    const now = Date.now()
    const cached = this.store.get(key)

    if (cached && now < cached.expiresAt) {
      return {
        data: cached.data,
        source: cached.source,
        asOf: cached.asOf,
        stale: false,
      }
    }

    if (this.inflight.has(key)) {
      return this.inflight.get(key)
    }

    const promise = (async () => {
      try {
        const result = await fetcher()
        const asOf = result.asOf || new Date().toISOString()
        this.store.set(key, {
          data: result.data,
          source: result.source,
          asOf,
          expiresAt: Date.now() + ttlMs,
          staleUntil: Date.now() + staleTtlMs,
        })
        return {
          data: result.data,
          source: result.source,
          asOf,
          stale: false,
        }
      } catch (err) {
        if (cached && Date.now() < cached.staleUntil) {
          return {
            data: cached.data,
            source: cached.source,
            asOf: cached.asOf,
            stale: true,
            staleReason: err.message,
          }
        }
        throw err
      } finally {
        this.inflight.delete(key)
      }
    })()

    this.inflight.set(key, promise)
    return promise
  }

  clear() {
    this.store.clear()
    this.inflight.clear()
  }
}
