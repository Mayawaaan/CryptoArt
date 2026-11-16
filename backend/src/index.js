import { config } from "./config/env.js"
import { connectDatabase, disconnectDatabase } from "./config/db.js"
import { ensureSampleNftsSeeded } from "./scripts/seedNfts.js"
import { createApp } from "./app.js"

async function startServer() {
  if (!config.hasExplicitSessionSecret && config.nodeEnv !== "test") {
    console.warn(
      "[CryptoArt Backend] DEMO_SESSION_SECRET not set; using ephemeral session signing key for this process."
    )
  }

  const dbStatus = await connectDatabase(config.mongodbUri)
  if (dbStatus.connected) {
    console.log(
      `[CryptoArt Backend] MongoDB connected (replicaSet=${dbStatus.replicaSet})`
    )
    try {
      const { inserted } = await ensureSampleNftsSeeded()
      if (inserted > 0) {
        console.log(`[CryptoArt Backend] Auto-seeded ${inserted} initial sample NFT(s).`)
      }
    } catch (seedErr) {
      console.warn(`[CryptoArt Backend] Sample NFT auto-seed skipped: ${seedErr.message}`)
    }
  } else {
    console.warn(
      `[CryptoArt Backend] MongoDB unavailable (${dbStatus.reason}). Market APIs remain active; DB-backed demo/NFT routes will return 503.`
    )
  }

  const app = createApp()
  const server = app.listen(config.port, () => {
    console.log(`CryptoArt API server listening on http://localhost:${config.port}`)
  })

  const shutdown = async (signal) => {
    console.log(`[CryptoArt Backend] Received ${signal}, shutting down gracefully...`)
    server.close(async () => {
      await disconnectDatabase()
      process.exit(0)
    })
  }

  process.on("SIGINT", () => shutdown("SIGINT"))
  process.on("SIGTERM", () => shutdown("SIGTERM"))
}

startServer()
