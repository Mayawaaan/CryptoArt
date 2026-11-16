import { sendError, sendSuccess } from "../utils/envelope.js"
import {
  validateCreateNftPayload,
  validatePatchNftPayload,
} from "../validators/nftValidator.js"
import { validateUploadedImage } from "../validators/mediaValidator.js"

export function createNftController({ nftService, demoService, cloudinaryService }) {
  function ensureDb(res) {
    if (!demoService.isReady()) {
      sendError(
        res,
        503,
        "DATABASE_UNAVAILABLE",
        "MongoDB is not connected. Configure MONGODB_URI in backend/.env and start MongoDB."
      )
      return false
    }
    return true
  }

  return {
    async list(req, res, next) {
      try {
        if (!ensureDb(res)) return undefined
        const result = await nftService.listNfts({
          search: req.query.search,
          category: req.query.category,
          sort: req.query.sort,
          status: req.query.status || "active",
          page: req.query.page,
          limit: req.query.limit,
        })
        return sendSuccess(res, {
          data: result,
          source: "mongodb-offchain-catalog",
          asOf: new Date().toISOString(),
          stale: false,
        })
      } catch (err) {
        return next(err)
      }
    },

    async getById(req, res, next) {
      try {
        if (!ensureDb(res)) return undefined
        const result = await nftService.getNftById(req.params.id)
        return sendSuccess(res, {
          data: result,
          source: "mongodb-offchain-catalog",
          asOf: new Date().toISOString(),
          stale: false,
        })
      } catch (err) {
        return next(err)
      }
    },

    async listMine(req, res, next) {
      try {
        const result = await nftService.listNfts({
          ownerAccountId: req.demoWallet.accountId,
          status: "all",
          page: req.query.page,
          limit: req.query.limit || 24,
        })
        return sendSuccess(res, {
          data: result,
          source: "mongodb-offchain-catalog",
          asOf: new Date().toISOString(),
          stale: false,
        })
      } catch (err) {
        return next(err)
      }
    },

    async create(req, res, next) {
      try {
        const check = validateCreateNftPayload(req.body)
        if (!check.valid) {
          return sendError(res, 400, check.code, check.message)
        }
        const created = await nftService.createNft(req.demoWallet, check.value)
        return sendSuccess(
          res,
          {
            data: created,
            source: "mongodb-offchain-catalog",
            asOf: new Date().toISOString(),
            stale: false,
          },
          201
        )
      } catch (err) {
        return next(err)
      }
    },

    async patch(req, res, next) {
      try {
        const check = validatePatchNftPayload(req.body)
        if (!check.valid) {
          return sendError(res, 400, check.code, check.message)
        }
        const updated = await nftService.updateNft(req.demoWallet, req.params.id, check.value)
        return sendSuccess(res, {
          data: { nft: updated },
          source: "mongodb-offchain-catalog",
          asOf: new Date().toISOString(),
          stale: false,
        })
      } catch (err) {
        return next(err)
      }
    },

    async remove(req, res, next) {
      try {
        const result = await nftService.deleteNft(req.demoWallet, req.params.id)
        return sendSuccess(res, {
          data: result,
          source: "mongodb-offchain-catalog",
          asOf: new Date().toISOString(),
          stale: false,
        })
      } catch (err) {
        return next(err)
      }
    },

    async purchase(req, res, next) {
      try {
        const idempotencyKey =
          req.body?.idempotencyKey || req.headers["idempotency-key"] || null
        const result = await nftService.purchaseNft(req.demoWallet, req.params.id, {
          idempotencyKey,
        })
        return sendSuccess(res, {
          data: {
            nft: result.nft,
            wallet: {
              accountId: result.wallet.accountId,
              balanceCredits: result.wallet.balanceCredits,
              currency: "DEMO_CREDITS",
            },
            transaction: result.transaction,
            idempotentReplay: result.idempotentReplay,
          },
          source: "cryptoart-demo-ledger",
          asOf: new Date().toISOString(),
          stale: false,
        })
      } catch (err) {
        return next(err)
      }
    },

    async placeBid(req, res, next) {
      try {
        const idempotencyKey =
          req.body?.idempotencyKey || req.headers["idempotency-key"] || null
        const result = await nftService.placeDemoBid(req.demoWallet, req.params.id, {
          amountCredits: req.body?.amountCredits,
          idempotencyKey,
        })
        return sendSuccess(
          res,
          {
            data: {
              nft: result.nft,
              wallet: {
                accountId: result.wallet.accountId,
                balanceCredits: result.wallet.balanceCredits,
                currency: "DEMO_CREDITS",
              },
              transaction: result.transaction,
              idempotentReplay: result.idempotentReplay,
            },
            source: "cryptoart-demo-ledger",
            asOf: new Date().toISOString(),
            stale: false,
          },
          201
        )
      } catch (err) {
        return next(err)
      }
    },

    async uploadMedia(req, res, next) {
      try {
        const check = validateUploadedImage(req.file)
        if (!check.valid) {
          return sendError(res, 400, check.code, check.message)
        }

        const uploaded = await cloudinaryService.uploadImageBuffer(req.file.buffer, {
          folder: `cryptoart/demo/${req.demoWallet.accountId.toLowerCase()}`,
        })

        return sendSuccess(
          res,
          {
            data: {
              publicId: uploaded.publicId,
              secureUrl: uploaded.secureUrl,
              width: uploaded.width || check.width,
              height: uploaded.height || check.height,
              format: uploaded.format || check.format,
              bytes: uploaded.bytes || check.bytes,
            },
            source: "cloudinary",
            asOf: new Date().toISOString(),
            stale: false,
          },
          201
        )
      } catch (err) {
        return next(err)
      }
    },
  }
}
