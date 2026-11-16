import { Router } from "express"
import { sendSuccess } from "../utils/envelope.js"

export function createMarketRouter(marketService) {
  const router = Router()

  router.get("/markets", async (req, res, next) => {
    try {
      const envelope = await marketService.getAllMarkets(req.query.vsCurrency)
      sendSuccess(res, envelope)
    } catch (err) {
      next(err)
    }
  })

  router.get("/markets/:asset", async (req, res, next) => {
    try {
      const envelope = await marketService.getAssetDetail(
        req.params.asset,
        req.query.vsCurrency
      )
      sendSuccess(res, envelope)
    } catch (err) {
      next(err)
    }
  })

  router.get("/markets/:asset/history", async (req, res, next) => {
    try {
      const envelope = await marketService.getAssetHistory(
        req.params.asset,
        req.query.vsCurrency,
        req.query.days
      )
      sendSuccess(res, envelope)
    } catch (err) {
      next(err)
    }
  })

  router.get("/markets/:asset/trades", async (req, res, next) => {
    try {
      const envelope = await marketService.getAssetTrades(
        req.params.asset,
        req.query.vsCurrency,
        req.query.limit
      )
      sendSuccess(res, envelope)
    } catch (err) {
      next(err)
    }
  })

  return router
}
