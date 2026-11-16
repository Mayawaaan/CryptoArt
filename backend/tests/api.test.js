import test from "node:test"
import assert from "node:assert/strict"
import { PassThrough } from "node:stream"
import http from "node:http"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { createApp } from "../src/app.js"
import { MemoryCache } from "../src/utils/cache.js"

function buildMockAdapters({ failCoinGecko = false } = {}) {
  return {
    coingecko: {
      name: "coingecko",
      async getMarkets(vsCurrency) {
        if (failCoinGecko) {
          const err = new Error("CoinGecko rate limited")
          err.status = 429
          throw err
        }
        const mult = vsCurrency === "usd" ? 1 : 84
        return [
          {
            coingeckoId: "bitcoin",
            symbol: "BTC",
            name: "Bitcoin",
            current_price: 80000 * mult,
            market_cap: 1500000000000 * mult,
            volume: 30000000000 * mult,
            price_change_percentage_24h: 2.5,
            sparkline_in_7d: { price: [78000 * mult, 79000 * mult, 80000 * mult] },
            last_updated: "2026-11-16T08:00:00.000Z",
          },
          {
            coingeckoId: "ethereum",
            symbol: "ETH",
            name: "Ethereum",
            current_price: 3000 * mult,
            market_cap: 360000000000 * mult,
            volume: 15000000000 * mult,
            price_change_percentage_24h: -1.1,
            sparkline_in_7d: { price: [3050 * mult, 3010 * mult, 3000 * mult] },
            last_updated: "2026-11-16T08:00:00.000Z",
          },
        ]
      },
      async getMarketChart() {
        return [{ timestamp: "2026-11-16T07:00:00.000Z", time: "2026-11-16", price: 6720000 }]
      },
    },
    binance: {
      name: "binance",
      async get24hrTickers() {
        return [
          {
            pair: "BTCUSDT",
            lastPriceUsd: 80100,
            priceChangePercent24h: 2.1,
            quoteVolumeUsd: 29000000000,
            highPriceUsd: 81000,
            lowPriceUsd: 78500,
          },
        ]
      },
      async getKlines() {
        return [
          { timestamp: "2026-11-16T06:00:00.000Z", time: "11-16 06:00", priceUsd: 79900 },
          { timestamp: "2026-11-16T07:00:00.000Z", time: "11-16 07:00", priceUsd: 80100 },
        ]
      },
      async getRecentTrades() {
        return [
          {
            id: "1001",
            timestamp: "2026-11-16T08:00:00.000Z",
            time: "08:00:00",
            type: "Buy",
            priceUsd: 80100,
            amount: 0.05,
            totalUsd: 4005,
          },
        ]
      },
    },
    frankfurter: {
      name: "frankfurter",
      async getLatestRates(base) {
        if (base === "USD") {
          return {
            base: "USD",
            date: "2026-11-15",
            rates: { INR: 84, EUR: 0.92, GBP: 0.78 },
            asOf: "2026-11-15T16:00:00.000Z",
          }
        }
        return {
          base: "INR",
          date: "2026-11-15",
          rates: { USD: 1 / 84, EUR: 1 / 91, GBP: 1 / 107 },
          asOf: "2026-11-15T16:00:00.000Z",
        }
      },
      async getHistoricalSeries() {
        return {
          points: [{ timestamp: "2026-11-15T16:00:00.000Z", time: "2026-11-15", price: 84 }],
          asOf: "2026-11-15T16:00:00.000Z",
        }
      },
    },
    dexscreener: {
      name: "dexscreener",
      async searchPairs(query) {
        return [
          {
            chainId: "ethereum",
            dexId: "uniswap",
            pairAddress: "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640",
            url: "https://dexscreener.com/ethereum/0x88e6",
            baseToken: { symbol: query.toUpperCase(), name: query },
            quoteToken: { symbol: "USDC", name: "USD Coin" },
            priceUsd: 3000,
            liquidityUsd: 120000000,
            volume24hUsd: 45000000,
          },
        ]
      },
    },
  }
}

async function invokeApp(app, { method = "GET", url, body } = {}) {
  return new Promise((resolve, reject) => {
    const socket = new PassThrough()
    socket.remoteAddress = "127.0.0.1"
    const req = new http.IncomingMessage(socket)
    req.method = method
    req.url = url
    req.headers = {
      host: "localhost:4000",
    }

    let rawBody = ""
    if (body !== undefined) {
      rawBody = JSON.stringify(body)
      req.headers["content-type"] = "application/json"
      req.headers["content-length"] = String(Buffer.byteLength(rawBody))
    }

    const res = new http.ServerResponse(req)
    const chunks = []
    const outSocket = new PassThrough()
    outSocket.remoteAddress = "127.0.0.1"
    outSocket.on("data", (chunk) => chunks.push(chunk))
    res.assignSocket(outSocket)

    res.on("finish", () => {
      const raw = Buffer.concat(chunks).toString("utf8")
      const splitIdx = raw.indexOf("\r\n\r\n")
      const jsonText = splitIdx >= 0 ? raw.slice(splitIdx + 4) : raw
      try {
        resolve({ status: res.statusCode, json: JSON.parse(jsonText) })
      } catch (err) {
        reject(new Error(`Failed to parse response JSON: ${err.message}\nRaw: ${raw}`))
      }
    })

    app(req, res)
    if (rawBody) {
      req.push(rawBody)
    }
    req.push(null)
  })
}

test("GET /api/health returns provider status envelope", async () => {
  const tmpStore = path.join(os.tmpdir(), `ca-store-${Date.now()}-1.json`)
  const app = createApp({ ...buildMockAdapters(), storagePath: tmpStore })

  const res = await invokeApp(app, { url: "/api/health" })
  assert.equal(res.status, 200)
  assert.equal(res.json.data.status, "ok")
  assert.equal(res.json.source, "cryptoart-backend")
  assert.equal(res.json.stale, false)
})

test("GET /api/markets returns normalized crypto + forex feeds and falls back to Binance if CoinGecko fails", async () => {
  const tmpStore = path.join(os.tmpdir(), `ca-store-${Date.now()}-2.json`)
  const appPrimary = createApp({ ...buildMockAdapters({ failCoinGecko: false }), storagePath: tmpStore })

  const res = await invokeApp(appPrimary, { url: "/api/markets?vsCurrency=inr" })
  assert.equal(res.status, 200)
  assert.equal(res.json.data.vsCurrency, "INR")
  assert.ok(res.json.data.crypto.some((c) => c.symbol === "BTC" && c.current_price === 6720000))
  assert.ok(res.json.data.forex.some((f) => f.symbol === "USD" && f.quoteType === "central_bank_reference"))

  const appFallback = createApp({ ...buildMockAdapters({ failCoinGecko: true }), storagePath: tmpStore })
  const resFb = await invokeApp(appFallback, { url: "/api/markets?vsCurrency=inr" })
  assert.equal(resFb.status, 200)
  assert.equal(resFb.json.data.providers.crypto, "binance+frankfurter")
  const btc = resFb.json.data.crypto.find((c) => c.symbol === "BTC")
  assert.equal(btc.current_price, 80100 * 84)
  assert.equal(btc.market_cap, null)
})

test("GET /api/markets/:asset/history, /trades, and /api/dex/pairs work as documented", async () => {
  const tmpStore = path.join(os.tmpdir(), `ca-store-${Date.now()}-3.json`)
  const app = createApp({ ...buildMockAdapters(), storagePath: tmpStore })

  const histRes = await invokeApp(app, { url: "/api/markets/btc/history?vsCurrency=inr&days=7" })
  assert.equal(histRes.status, 200)
  assert.equal(histRes.json.data.points.length, 2)
  assert.equal(histRes.json.data.points[1].price, 80100 * 84)

  const tradesRes = await invokeApp(app, { url: "/api/markets/btc/trades?vsCurrency=inr" })
  assert.equal(tradesRes.status, 200)
  assert.equal(tradesRes.json.data.available, true)
  assert.equal(tradesRes.json.data.trades[0].price, 80100 * 84)

  const fxTradesRes = await invokeApp(app, { url: "/api/markets/usd/trades?vsCurrency=inr" })
  assert.equal(fxTradesRes.status, 200)
  assert.equal(fxTradesRes.json.data.available, false)

  const dexRes = await invokeApp(app, { url: "/api/dex/pairs?q=eth" })
  assert.equal(dexRes.status, 200)
  assert.equal(dexRes.json.source, "dexscreener")
  assert.equal(dexRes.json.data.pairs[0].baseToken.symbol, "ETH")
})

test("POST /api/newsletter, /api/support-requests, and /api/nft/bids validate and persist", async () => {
  const tmpStore = path.join(os.tmpdir(), `ca-store-${Date.now()}-4.json`)
  const app = createApp({ ...buildMockAdapters(), storagePath: tmpStore })

  const badNews = await invokeApp(app, {
    method: "POST",
    url: "/api/newsletter",
    body: { email: "invalid" },
  })
  assert.equal(badNews.status, 400)

  const goodNews = await invokeApp(app, {
    method: "POST",
    url: "/api/newsletter",
    body: { email: "user@example.com" },
  })
  assert.equal(goodNews.status, 201)

  const supportRes = await invokeApp(app, {
    method: "POST",
    url: "/api/support-requests",
    body: {
      name: "Ayan",
      email: "ayan@example.com",
      category: "technical",
      priority: "High",
      message: "Testing support submission persistence flow.",
      consent: true,
    },
  })
  assert.equal(supportRes.status, 201)
  assert.match(supportRes.json.data.ticketId, /^CA-/)

  const bidRes = await invokeApp(app, {
    method: "POST",
    url: "/api/nft/bids",
    body: { nftId: 1, amountInr: 255000, bidder: "0xTester" },
  })
  assert.equal(bidRes.status, 201)

  const listBids = await invokeApp(app, { url: "/api/nft/bids" })
  assert.equal(listBids.status, 200)
  assert.equal(listBids.json.data.length, 1)
  assert.equal(listBids.json.data[0].amountInr, 255000)

  await fs.unlink(tmpStore).catch(() => {})
})

test("MemoryCache deduplicates inflight calls and falls back to stale data on upstream failure", async () => {
  const cache = new MemoryCache()
  let calls = 0

  const first = await cache.getOrFetch("k1", {
    ttlMs: 1,
    staleTtlMs: 5000,
    fetcher: async () => {
      calls += 1
      return { data: { price: 100 }, source: "test" }
    },
  })
  assert.equal(first.stale, false)
  assert.equal(calls, 1)

  await new Promise((r) => setTimeout(r, 15))

  const staleRes = await cache.getOrFetch("k1", {
    ttlMs: 1,
    staleTtlMs: 5000,
    fetcher: async () => {
      throw new Error("Upstream down")
    },
  })
  assert.equal(staleRes.stale, true)
  assert.equal(staleRes.data.price, 100)
  assert.equal(staleRes.staleReason, "Upstream down")
})
