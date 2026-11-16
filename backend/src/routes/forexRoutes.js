import { Router } from "express"
import { sendSuccess } from "../utils/envelope.js"

export function createForexRouter(marketService) {
  const router = Router()

  router.get("/forex/rates", async (req, res, next) => {
    try {
      const envelope = await marketService.getForexRates(req.query.base)
      sendSuccess(res, envelope)
    } catch (err) {
      next(err)
    }
  })

  return router
}
