import { Router } from "express"
import { sendSuccess } from "../utils/envelope.js"

export function createDexRouter(marketService) {
  const router = Router()

  router.get("/dex/pairs", async (req, res, next) => {
    try {
      const envelope = await marketService.searchDexPairs(req.query.q)
      sendSuccess(res, envelope)
    } catch (err) {
      next(err)
    }
  })

  return router
}
