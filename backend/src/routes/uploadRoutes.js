import { Router } from "express"
import multer from "multer"
import { sendError } from "../utils/envelope.js"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB strict cap
    files: 1,
  },
})

export function createUploadRouter({ nftController, authMiddleware }) {
  const router = Router()
  const { requireDemoSession, requireSameOriginMutation } = authMiddleware

  router.post(
    "/uploads/nft",
    requireSameOriginMutation,
    requireDemoSession,
    (req, res, next) => {
      upload.single("image")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          return sendError(res, 400, "UPLOAD_ERROR", err.message)
        }
        if (err) {
          return next(err)
        }
        return next()
      })
    },
    nftController.uploadMedia
  )

  return router
}
