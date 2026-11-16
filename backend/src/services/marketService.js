import { CRYPTO_ASSETS, FOREX_ASSETS, findAssetByKey } from "../config/assets.js"
import { UpstreamError } from "../utils/http.js"

const SUPPORTED_VS_CURRENCIES = new Set(["inr", "usd", "eur", "gbp"])

export function createMarketService({
  cache,
  cacheTtl,
  coingecko,
  binance,
  frankfurter,
  dexscreener,
}) {
  function validateVsCurrency(raw = "inr") {
    const vs = String(raw || "inr").trim().toLowerCase()
    return SUPPORTED_VS_CURRENCIES.has(vs) ? vs : "inr"
  }

  async function getUsdToQuoteRate(vsCurrency) {
    const upper = vsCurrency.toUpperCase()
    if (upper === "USD") {
      return { rate: 1, source: "usd-base", asOf: new Date().toISOString(), stale: false }
    }

    const fxEnvelope = await getForexRates("USD")
    const rate = Number(fxEnvelope.data.rates[upper])
    if (!Number.isFinite(rate) || rate <= 0) {
      throw new UpstreamError(`Missing FX conversion rate USD->${upper}`, {
        status: 502,
        provider: "frankfurter",
      })
    }
    return {
      rate,
      source: fxEnvelope.source,
      asOf: fxEnvelope.asOf,
      stale: fxEnvelope.stale,
    }
  }

  async function getForexRates(baseCurrency = "INR") {
    const upperBase = String(baseCurrency || "INR").trim().toUpperCase()
    const symbols = FOREX_ASSETS.map((f) => f.symbol)

    return cache.getOrFetch(`fx:latest:${upperBase}`, {
      ttlMs: cacheTtl.fxMs,
      staleTtlMs: cacheTtl.fxMs * 24,
      fetcher: async () => {
        const result = await frankfurter.getLatestRates(upperBase, symbols)
        const quoteRates = {}
        for (const f of FOREX_ASSETS) {
          if (f.symbol === upperBase) {
            quoteRates[f.symbol] = 1
          } else if (result.rates[f.symbol] !== undefined) {
            // Convert: 1 unit of f.symbol in baseCurrency = 1 / rate(baseCurrency -> f.symbol)
            const direct = Number(result.rates[f.symbol])
            quoteRates[f.symbol] = direct > 0 ? Number((1 / direct).toFixed(6)) : null
          }
        }
        return {
          data: {
            base: upperBase,
            date: result.date,
            rates: result.rates,
            unitPriceInBase: quoteRates,
            quoteType: "central_bank_reference",
            attribution:
              "Frankfurter (ECB & central bank reference rates — not executable spot quotes)",
          },
          source: "frankfurter",
          asOf: result.asOf,
        }
      },
    })
  }

  async function getAllMarkets(rawVsCurrency = "inr") {
    const vsCurrency = validateVsCurrency(rawVsCurrency)
    const upperVs = vsCurrency.toUpperCase()

    return cache.getOrFetch(`markets:all:${vsCurrency}`, {
      ttlMs: cacheTtl.marketsMs,
      staleTtlMs: cacheTtl.marketsMs * 30,
      fetcher: async () => {
        const errors = []

        // 1. Fetch FX reference rates in parallel with crypto feed
        const fxPromise = getForexRates(upperVs).catch((err) => {
          errors.push({ provider: "frankfurter", message: err.message })
          return null
        })

        // 2. Try CoinGecko first, fallback to Binance + FX conversion
        let cryptoItems = []
        let cryptoSource = "coingecko"
        let cryptoAsOf = new Date().toISOString()

        try {
          const cgIds = CRYPTO_ASSETS.filter((c) => c.coingeckoId).map((c) => c.coingeckoId)
          const cgList = await coingecko.getMarkets(vsCurrency, cgIds)
          const byCgId = new Map(cgList.map((item) => [item.coingeckoId, item]))

          cryptoItems = CRYPTO_ASSETS.filter((c) => !c.isPrototypePeg).map((asset) => {
            const cg = byCgId.get(asset.coingeckoId)
            return {
              id: asset.id,
              coingeckoId: asset.coingeckoId,
              symbol: asset.symbol,
              name: asset.name,
              type: "crypto",
              current_price: cg ? cg.current_price : null,
              market_cap: cg ? cg.market_cap : null,
              volume: cg ? cg.volume : null,
              price_change_percentage_24h: cg ? cg.price_change_percentage_24h : null,
              sparkline_in_7d: cg ? cg.sparkline_in_7d : null,
              source: "coingecko",
              asOf: cg?.last_updated || cryptoAsOf,
            }
          })
          if (cgList[0]?.last_updated) {
            cryptoAsOf = cgList[0].last_updated
          }
        } catch (cgErr) {
          errors.push({ provider: "coingecko", message: cgErr.message })
          // Fallback to Binance + Frankfurter conversion
          const [fxConversion, tickers] = await Promise.all([
            getUsdToQuoteRate(vsCurrency),
            binance.get24hrTickers(
              CRYPTO_ASSETS.filter((c) => c.binancePair).map((c) => c.binancePair)
            ),
          ])

          const byPair = new Map(tickers.map((t) => [t.pair, t]))
          cryptoSource = upperVs === "USD" ? "binance" : "binance+frankfurter"
          cryptoAsOf = new Date().toISOString()

          cryptoItems = CRYPTO_ASSETS.filter((c) => !c.isPrototypePeg).map((asset) => {
            const ticker = asset.binancePair ? byPair.get(asset.binancePair) : null
            const isUsdt = asset.symbol === "USDT"
            const priceUsd = isUsdt ? 1 : ticker?.lastPriceUsd ?? null
            const convertedPrice =
              priceUsd !== null ? Number((priceUsd * fxConversion.rate).toFixed(4)) : null

            return {
              id: asset.id,
              coingeckoId: asset.coingeckoId,
              symbol: asset.symbol,
              name: asset.name,
              type: "crypto",
              current_price: convertedPrice,
              market_cap: null,
              volume:
                ticker?.quoteVolumeUsd !== undefined
                  ? Math.round(ticker.quoteVolumeUsd * fxConversion.rate)
                  : null,
              price_change_percentage_24h: isUsdt
                ? 0
                : ticker?.priceChangePercent24h ?? null,
              sparkline_in_7d: null,
              source: isUsdt ? "usd-peg+frankfurter" : cryptoSource,
              asOf: cryptoAsOf,
            }
          })
        }

        const fxEnvelope = await fxPromise
        const inrRate =
          upperVs === "INR"
            ? 1
            : fxEnvelope?.data?.unitPriceInBase?.INR ?? null

        // Include prototype INRC peg explicitly marked as prototype reference
        const inrcAsset = {
          id: "inrc",
          symbol: "INRC",
          name: "Crypto Rupee (Prototype Peg)",
          type: "crypto",
          isPrototypePeg: true,
          current_price: inrRate,
          market_cap: null,
          volume: null,
          price_change_percentage_24h: 0,
          sparkline_in_7d: null,
          source: "prototype-inr-peg",
          asOf: fxEnvelope?.asOf || new Date().toISOString(),
        }

        const forexItems = FOREX_ASSETS.map((fx) => {
          const unitPrice = fxEnvelope?.data?.unitPriceInBase?.[fx.symbol] ?? null
          return {
            id: `${fx.symbol}-${upperVs}`,
            symbol: fx.symbol,
            name: `${fx.symbol} / ${upperVs}`,
            fullName: fx.name,
            symbolChar: fx.symbolChar,
            type: "forex",
            quoteType: "central_bank_reference",
            current_price: unitPrice,
            market_cap: null,
            volume: null,
            price_change_percentage_24h: null,
            sparkline_in_7d: null,
            source: fxEnvelope ? "frankfurter" : "unavailable",
            asOf: fxEnvelope?.asOf || null,
          }
        })

        return {
          data: {
            vsCurrency: upperVs,
            crypto: [...cryptoItems, inrcAsset],
            forex: forexItems,
            providers: {
              crypto: cryptoSource,
              forex: fxEnvelope ? "frankfurter" : "unavailable",
            },
            errors: errors.length > 0 ? errors : undefined,
          },
          source: fxEnvelope ? `${cryptoSource}+frankfurter` : cryptoSource,
          asOf: cryptoAsOf,
        }
      },
    })
  }

  async function getAssetDetail(assetKey, rawVsCurrency = "inr") {
    const asset = findAssetByKey(assetKey)
    if (!asset) {
      throw new UpstreamError(`Unknown asset identifier: ${assetKey}`, {
        status: 404,
        provider: "catalog",
      })
    }

    const marketsEnvelope = await getAllMarkets(rawVsCurrency)
    const list =
      asset.type === "crypto"
        ? marketsEnvelope.data.crypto
        : marketsEnvelope.data.forex

    const found = list.find(
      (item) => item.symbol.toLowerCase() === asset.symbol.toLowerCase()
    )

    return {
      data: found || asset,
      source: marketsEnvelope.source,
      asOf: marketsEnvelope.asOf,
      stale: marketsEnvelope.stale,
    }
  }

  async function getAssetHistory(assetKey, rawVsCurrency = "inr", rawDays = 7) {
    const asset = findAssetByKey(assetKey)
    if (!asset) {
      throw new UpstreamError(`Unknown asset identifier: ${assetKey}`, {
        status: 404,
        provider: "catalog",
      })
    }

    const vsCurrency = validateVsCurrency(rawVsCurrency)
    const upperVs = vsCurrency.toUpperCase()
    const days = [1, 7, 14, 30].includes(Number(rawDays)) ? Number(rawDays) : 7

    return cache.getOrFetch(`history:${asset.id}:${vsCurrency}:${days}`, {
      ttlMs: cacheTtl.chartsMs,
      staleTtlMs: cacheTtl.chartsMs * 20,
      fetcher: async () => {
        if (asset.isPrototypePeg) {
          const fxConv = upperVs === "INR" ? { rate: 1, asOf: new Date().toISOString() } : await frankfurter.getHistoricalSeries("INR", upperVs, days)
          if (upperVs === "INR") {
            const now = new Date()
            return {
              data: {
                assetId: asset.id,
                symbol: asset.symbol,
                vsCurrency: upperVs,
                days,
                quoteType: "prototype_inr_peg",
                points: [{ timestamp: now.toISOString(), time: "Peg 1.00", price: 1 }],
              },
              source: "prototype-inr-peg",
              asOf: now.toISOString(),
            }
          }
          return {
            data: {
              assetId: asset.id,
              symbol: asset.symbol,
              vsCurrency: upperVs,
              days,
              quoteType: "prototype_inr_peg",
              points: fxConv.points,
            },
            source: "frankfurter",
            asOf: fxConv.asOf,
          }
        }

        if (asset.type === "forex") {
          const series = await frankfurter.getHistoricalSeries(asset.symbol, upperVs, Math.max(days, 7))
          return {
            data: {
              assetId: asset.id,
              symbol: asset.symbol,
              vsCurrency: upperVs,
              days: Math.max(days, 7),
              quoteType: "central_bank_reference",
              points: series.points,
            },
            source: "frankfurter",
            asOf: series.asOf,
          }
        }

        // Crypto asset: try Binance klines + FX first (very high rate limits) or CoinGecko
        if (asset.binancePair) {
          try {
            const [klines, fxConv] = await Promise.all([
              binance.getKlines(asset.binancePair, days),
              getUsdToQuoteRate(vsCurrency),
            ])
            const points = klines.map((k) => ({
              timestamp: k.timestamp,
              time: k.time,
              price: Number((k.priceUsd * fxConv.rate).toFixed(4)),
            }))
            return {
              data: {
                assetId: asset.id,
                symbol: asset.symbol,
                vsCurrency: upperVs,
                days,
                quoteType: "spot_klines",
                points,
              },
              source: upperVs === "USD" ? "binance" : "binance+frankfurter",
              asOf: points[points.length - 1]?.timestamp || new Date().toISOString(),
            }
          } catch {
            // Fall through to CoinGecko
          }
        }

        if (asset.coingeckoId) {
          const points = await coingecko.getMarketChart(asset.coingeckoId, vsCurrency, days)
          return {
            data: {
              assetId: asset.id,
              symbol: asset.symbol,
              vsCurrency: upperVs,
              days,
              quoteType: "market_chart",
              points,
            },
            source: "coingecko",
            asOf: points[points.length - 1]?.timestamp || new Date().toISOString(),
          }
        }

        throw new UpstreamError(`Historical chart unavailable for ${asset.symbol}`, {
          status: 404,
          provider: "market-service",
        })
      },
    })
  }

  async function getAssetTrades(assetKey, rawVsCurrency = "inr", rawLimit = 20) {
    const asset = findAssetByKey(assetKey)
    if (!asset) {
      throw new UpstreamError(`Unknown asset identifier: ${assetKey}`, {
        status: 404,
        provider: "catalog",
      })
    }

    const vsCurrency = validateVsCurrency(rawVsCurrency)
    const upperVs = vsCurrency.toUpperCase()
    const limit = Math.min(Math.max(Number.parseInt(rawLimit, 10) || 20, 1), 50)

    if (asset.type !== "crypto" || !asset.binancePair) {
      return {
        data: {
          assetId: asset.id,
          symbol: asset.symbol,
          vsCurrency: upperVs,
          available: false,
          reason:
            asset.type === "forex"
              ? "Forex rates come from daily central-bank reference series (Frankfurter); public exchange trade tape is not applicable."
              : `No direct public spot trade stream configured for ${asset.symbol}.`,
          trades: [],
        },
        source: "catalog",
        asOf: new Date().toISOString(),
        stale: false,
      }
    }

    return cache.getOrFetch(`trades:${asset.id}:${vsCurrency}:${limit}`, {
      ttlMs: cacheTtl.tradesMs,
      staleTtlMs: cacheTtl.tradesMs * 8,
      fetcher: async () => {
        const [rawTrades, fxConv] = await Promise.all([
          binance.getRecentTrades(asset.binancePair, limit),
          getUsdToQuoteRate(vsCurrency),
        ])

        const trades = rawTrades
          .slice()
          .reverse()
          .map((t) => ({
            id: t.id,
            timestamp: t.timestamp,
            time: t.time,
            type: t.type,
            price: Number((t.priceUsd * fxConv.rate).toFixed(4)),
            amount: t.amount,
            total: Number((t.totalUsd * fxConv.rate).toFixed(2)),
            symbol: asset.symbol,
          }))

        return {
          data: {
            assetId: asset.id,
            symbol: asset.symbol,
            vsCurrency: upperVs,
            available: true,
            trades,
          },
          source: upperVs === "USD" ? "binance" : "binance+frankfurter",
          asOf: trades[0]?.timestamp || new Date().toISOString(),
        }
      },
    })
  }

  async function searchDexPairs(query) {
    const clean = String(query || "").trim()
    if (!clean || clean.length > 64) {
      throw new UpstreamError("Provide a valid token symbol or contract query (1-64 chars).", {
        status: 400,
        provider: "validation",
      })
    }

    return cache.getOrFetch(`dex:search:${clean.toLowerCase()}`, {
      ttlMs: cacheTtl.dexMs,
      staleTtlMs: cacheTtl.dexMs * 10,
      fetcher: async () => {
        const pairs = await dexscreener.searchPairs(clean)
        return {
          data: {
            query: clean,
            pairs,
          },
          source: "dexscreener",
          asOf: new Date().toISOString(),
        }
      },
    })
  }

  return {
    getAllMarkets,
    getAssetDetail,
    getAssetHistory,
    getAssetTrades,
    getForexRates,
    searchDexPairs,
  }
}
