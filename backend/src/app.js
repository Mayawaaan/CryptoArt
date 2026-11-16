import path from "node:path"
import { fileURLToPath } from "node:url"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit"

import { config } from "./config/env.js"
import { createCloudinaryService } from "./config/cloudinary.js"
import { MemoryCache } from "./utils/cache.js"
import { sendError } from "./utils/envelope.js"
import { UpstreamError } from "./utils/http.js"
import { createCoinGeckoAdapter } from "./adapters/coingeckoAdapter.js"
import { createBinanceAdapter } from "./adapters/binanceAdapter.js"
import { createFrankfurterAdapter } from "./adapters/frankfurterAdapter.js"
import { createDexScreenerAdapter } from "./adapters/dexscreenerAdapter.js"
import { createMarketService } from "./services/marketService.js"
import { createStorageService } from "./services/storageService.js"
import { createDemoService } from "./services/demoService.js"
import { createNftService } from "./services/nftService.js"
import { createDemoAuthMiddleware } from "./middleware/demoAuth.js"
import { createDemoController } from "./controllers/demoController.js"
import { createNftController } from "./controllers/nftController.js"
import { createHealthRouter } from "./routes/healthRoutes.js"
import { createMarketRouter } from "./routes/marketRoutes.js"
import { createForexRouter } from "./routes/forexRoutes.js"
import { createDexRouter } from "./routes/dexRoutes.js"
import { createPlatformRouter } from "./routes/platformRoutes.js"
import { createDemoRouter } from "./routes/demoRoutes.js"
import { createNftRouter } from "./routes/nftRoutes.js"
import { createUploadRouter } from "./routes/uploadRoutes.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function createApp(overrides = {}) {
  const app = express()

  const cache = overrides.cache || new MemoryCache()
  const coingecko =
    overrides.coingecko ||
    createCoinGeckoAdapter({
      apiKey: config.coingeckoApiKey,
      timeoutMs: config.upstreamTimeoutMs,
    })
  const binance =
    overrides.binance ||
    createBinanceAdapter({ timeoutMs: config.upstreamTimeoutMs })
  const frankfurter =
    overrides.frankfurter ||
    createFrankfurterAdapter({ timeoutMs: config.upstreamTimeoutMs })
  const dexscreener =
    overrides.dexscreener ||
    createDexScreenerAdapter({ timeoutMs: config.upstreamTimeoutMs })

  const marketService =
    overrides.marketService ||
    createMarketService({
      cache,
      cacheTtl: config.cacheTtl,
      coingecko,
      binance,
      frankfurter,
      dexscreener,
    })

  const storagePath =
    overrides.storagePath || path.resolve(__dirname, "../data/store.json")
  const storageService = overrides.storageService || createStorageService(storagePath)

  const cloudinaryService =
    overrides.cloudinaryService || createCloudinaryService(config.cloudinary)

  const demoService =
    overrides.demoService ||
    createDemoService(overrides.models || {})

  const nftService =
    overrides.nftService ||
    createNftService({
      models: overrides.models || {},
      cloudinaryService,
    })

  const authMiddleware =
    overrides.authMiddleware ||
    createDemoAuthMiddleware({
      demoService,
      corsOrigins: config.corsOrigins,
      sessionSecret: config.demoSessionSecret,
      isProduction: config.isProduction,
    })

  const demoController = createDemoController({ demoService, authMiddleware })
  const nftController = createNftController({
    nftService,
    demoService,
    cloudinaryService,
  })

  app.use(helmet())
  app.use(
    cors({
      credentials: true,
      origin(origin, callback) {
        if (!origin || config.corsOrigins.includes(origin)) {
          return callback(null, true)
        }
        return callback(
          new UpstreamError("Origin not allowed by CORS policy", {
            status: 403,
            provider: "cors",
          })
        )
      },
    })
  )
  app.use(cookieParser())
  app.use(express.json({ limit: "64kb" }))

  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 160,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      sendError(res, 429, "RATE_LIMIT_EXCEEDED", "Too many requests; please wait and retry.")
    },
  })
  app.use("/api", limiter)
  app.use("/api", authMiddleware.resolveSession)

  app.use(
    "/api",
    createHealthRouter({
      hasCoingeckoKey: Boolean(config.coingeckoApiKey),
      cloudinaryConfigured: cloudinaryService.isConfigured(),
      dbStatusFn: overrides.dbStatusFn,
    })
  )
  app.use("/api", createMarketRouter(marketService))
  app.use("/api", createForexRouter(marketService))
  app.use("/api", createDexRouter(marketService))
  app.use("/api", createPlatformRouter(storageService))
  app.use("/api", createDemoRouter({ demoController, authMiddleware }))
  app.use("/api", createNftRouter({ nftController, authMiddleware }))
  app.use("/api", createUploadRouter({ nftController, authMiddleware }))

  app.use("/api", (_req, res) => {
    sendError(res, 404, "NOT_FOUND", "API endpoint not found.")
  })

  app.use((err, _req, res, _next) => {
    if (res.headersSent) {
      return
    }
    const status = err.status || 500
    const code =
      err.code ||
      (err.provider ? `${err.provider.toUpperCase()}_ERROR` : "INTERNAL_ERROR")
    if (status >= 500) {
      console.error(`[API Error] ${err.message}`)
    }
    sendError(res, status, code, err.message || "Unexpected server error.")
  })

  return app
}
