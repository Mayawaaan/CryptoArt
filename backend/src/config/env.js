import path from "node:path"
import crypto from "node:crypto"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const backendEnvPath = path.resolve(__dirname, "../../.env")
dotenv.config({ path: backendEnvPath })

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const rawSessionSecret = process.env.DEMO_SESSION_SECRET?.trim() || ""
const ephemeralDevSecret = rawSessionSecret || crypto.randomBytes(32).toString("hex")

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  port: parsePositiveInt(process.env.PORT, 4000),
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  mongodbUri: process.env.MONGODB_URI?.trim() || "",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME?.trim() || "",
    apiKey: process.env.CLOUDINARY_API_KEY?.trim() || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET?.trim() || "",
  },
  demoSessionSecret: ephemeralDevSecret,
  hasExplicitSessionSecret: Boolean(rawSessionSecret),
  coingeckoApiKey: process.env.COINGECKO_API_KEY?.trim() || "",
  cacheTtl: {
    marketsMs: parsePositiveInt(process.env.MARKET_CACHE_TTL_MS, 45_000),
    chartsMs: parsePositiveInt(process.env.CHART_CACHE_TTL_MS, 120_000),
    tradesMs: parsePositiveInt(process.env.TRADES_CACHE_TTL_MS, 15_000),
    fxMs: parsePositiveInt(process.env.FX_CACHE_TTL_MS, 300_000),
    dexMs: parsePositiveInt(process.env.DEX_CACHE_TTL_MS, 60_000),
  },
  upstreamTimeoutMs: parsePositiveInt(process.env.UPSTREAM_TIMEOUT_MS, 7000),
}
