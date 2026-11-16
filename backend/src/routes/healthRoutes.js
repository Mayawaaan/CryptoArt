import { Router } from "express"
import { sendSuccess } from "../utils/envelope.js"
import { getDatabaseStatus } from "../config/db.js"
import { config } from "../config/env.js"

export function createHealthRouter({
  hasCoingeckoKey,
  cloudinaryConfigured = false,
  dbStatusFn,
}) {
  const router = Router()

  router.get("/health", (_req, res) => {
    const db = dbStatusFn ? dbStatusFn() : getDatabaseStatus(config.mongodbUri)

    sendSuccess(res, {
      data: {
        status: "ok",
        uptimeSeconds: Math.round(process.uptime()),
        providers: {
          coingecko: hasCoingeckoKey ? "demo-key-configured" : "keyless-public",
          binance: "public-market-data",
          frankfurter: "public-ecb-reference",
          dexscreener: "public-dex-api",
        },
        database: db,
        cloudinary: {
          configured: Boolean(cloudinaryConfigured),
        },
      },
      source: "cryptoart-backend",
      asOf: new Date().toISOString(),
      stale: false,
    })
  })

  return router
}
