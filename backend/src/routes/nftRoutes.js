import { Router } from "express"

export function createNftRouter({ nftController, authMiddleware }) {
  const router = Router()
  const { requireDemoSession, requireSameOriginMutation } = authMiddleware

  router.get("/nfts", nftController.list)
  router.get("/nfts/:id", nftController.getById)
  router.post("/nfts", requireSameOriginMutation, requireDemoSession, nftController.create)
  router.patch("/nfts/:id", requireSameOriginMutation, requireDemoSession, nftController.patch)
  router.delete("/nfts/:id", requireSameOriginMutation, requireDemoSession, nftController.remove)
  router.post("/nfts/:id/purchase", requireSameOriginMutation, requireDemoSession, nftController.purchase)
  router.post("/nfts/:id/bids", requireSameOriginMutation, requireDemoSession, nftController.placeBid)
  router.get("/me/nfts", requireDemoSession, nftController.listMine)

  return router
}
