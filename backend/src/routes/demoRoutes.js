import { Router } from "express"

export function createDemoRouter({ demoController, authMiddleware }) {
  const router = Router()
  const { requireDemoSession, requireSameOriginMutation } = authMiddleware

  router.post("/demo/session", requireSameOriginMutation, demoController.startSession)
  router.get("/demo/wallet", requireDemoSession, demoController.getWallet)
  router.post("/demo/reset", requireSameOriginMutation, requireDemoSession, demoController.resetWallet)
  router.get("/demo/transactions", requireDemoSession, demoController.listTransactions)
  router.post("/demo/swap", requireSameOriginMutation, requireDemoSession, demoController.executeSwap)
  router.get("/demo/staking", requireDemoSession, demoController.listStaking)
  router.post("/demo/staking/stake", requireSameOriginMutation, requireDemoSession, demoController.stake)
  router.post(
    "/demo/staking/:positionId/unstake",
    requireSameOriginMutation,
    requireDemoSession,
    demoController.unstake
  )

  return router
}
