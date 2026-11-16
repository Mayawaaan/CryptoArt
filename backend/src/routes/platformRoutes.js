import { Router } from "express"
import { sendError, sendSuccess } from "../utils/envelope.js"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ALLOWED_CATEGORIES = new Set([
  "technical",
  "billing",
  "account",
  "security",
  "other",
])

export function createPlatformRouter(storageService) {
  const router = Router()

  router.post("/newsletter", async (req, res, next) => {
    try {
      const email = String(req.body?.email || "").trim()
      if (!EMAIL_REGEX.test(email) || email.length > 200) {
        return sendError(res, 400, "INVALID_EMAIL", "Please provide a valid email address.")
      }

      const result = await storageService.subscribeNewsletter(email)
      return sendSuccess(
        res,
        {
          data: {
            message: result.alreadySubscribed
              ? "Email is already subscribed to CryptoArt updates."
              : "Subscribed to CryptoArt updates.",
            email: result.email,
            subscribedAt: result.subscribedAt,
          },
          source: "cryptoart-storage",
          asOf: new Date().toISOString(),
          stale: false,
        },
        result.alreadySubscribed ? 200 : 201
      )
    } catch (err) {
      return next(err)
    }
  })

  router.post("/support-requests", async (req, res, next) => {
    try {
      const { name, email, category, priority, message, consent } = req.body || {}
      if (!name || String(name).trim().length < 2) {
        return sendError(res, 400, "INVALID_NAME", "Please provide your full name.")
      }
      if (!email || !EMAIL_REGEX.test(String(email).trim())) {
        return sendError(res, 400, "INVALID_EMAIL", "Please provide a valid email address.")
      }
      if (!ALLOWED_CATEGORIES.has(category)) {
        return sendError(res, 400, "INVALID_CATEGORY", "Please choose a valid request category.")
      }
      if (!message || String(message).trim().length < 10) {
        return sendError(res, 400, "INVALID_MESSAGE", "Please describe your issue (at least 10 characters).")
      }
      if (!consent) {
        return sendError(res, 400, "CONSENT_REQUIRED", "Consent to data processing is required.")
      }

      const ticket = await storageService.createSupportRequest({
        name,
        email,
        category,
        priority,
        message,
      })

      return sendSuccess(
        res,
        {
          data: ticket,
          source: "cryptoart-storage",
          asOf: ticket.createdAt,
          stale: false,
        },
        201
      )
    } catch (err) {
      return next(err)
    }
  })

  router.get("/nft/bids", async (_req, res, next) => {
    try {
      const bids = await storageService.listNftBids()
      return sendSuccess(res, {
        data: bids,
        source: "cryptoart-storage",
        asOf: new Date().toISOString(),
        stale: false,
      })
    } catch (err) {
      return next(err)
    }
  })

  router.post("/nft/bids", async (req, res, next) => {
    try {
      const nftId = Number(req.body?.nftId)
      const amountInr = Number(req.body?.amountInr)
      const bidder = req.body?.bidder

      if (!Number.isInteger(nftId) || nftId <= 0) {
        return sendError(res, 400, "INVALID_NFT_ID", "Valid NFT identifier is required.")
      }
      if (!Number.isFinite(amountInr) || amountInr <= 0) {
        return sendError(res, 400, "INVALID_BID_AMOUNT", "Bid amount must be greater than zero.")
      }

      const bid = await storageService.addNftBid({ nftId, amountInr, bidder })
      return sendSuccess(
        res,
        {
          data: bid,
          source: "cryptoart-storage",
          asOf: bid.createdAt,
          stale: false,
        },
        201
      )
    } catch (err) {
      return next(err)
    }
  })

  return router
}
