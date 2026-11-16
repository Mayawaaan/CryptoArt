import { sendError, sendSuccess } from "../utils/envelope.js"

export function createDemoController({ demoService, authMiddleware }) {
  return {
    async startSession(req, res, next) {
      try {
        if (!demoService.isReady()) {
          return sendError(
            res,
            503,
            "DATABASE_UNAVAILABLE",
            "MongoDB is not connected. Configure MONGODB_URI in backend/.env and start MongoDB."
          )
        }

        const result = await demoService.startOrResumeSession(
          req.demoSessionId,
          req.body?.displayAlias
        )
        authMiddleware.issueSessionCookie(res, result.sessionId)

        return sendSuccess(
          res,
          {
            data: {
              accountId: result.wallet.accountId,
              displayAlias: result.wallet.displayAlias,
              balanceCredits: result.wallet.balanceCredits,
              currency: "DEMO_CREDITS",
              simulated: true,
              disclaimer: "Simulated — No blockchain transaction",
              created: result.created,
            },
            source: "cryptoart-demo-ledger",
            asOf: new Date().toISOString(),
            stale: false,
          },
          result.created ? 201 : 200
        )
      } catch (err) {
        return next(err)
      }
    },

    async getWallet(req, res, next) {
      try {
        const wallet = await demoService.getWalletSummary(req.demoWallet)
        return sendSuccess(res, {
          data: {
            accountId: wallet.accountId,
            displayAlias: wallet.displayAlias,
            balanceCredits: wallet.balanceCredits,
            initialGrantCredits: wallet.initialGrantCredits,
            lastResetAt: wallet.lastResetAt,
            currency: "DEMO_CREDITS",
            simulated: true,
          },
          source: "cryptoart-demo-ledger",
          asOf: new Date().toISOString(),
          stale: false,
        })
      } catch (err) {
        return next(err)
      }
    },

    async resetWallet(req, res, next) {
      try {
        const result = await demoService.resetWallet(req.demoWallet, {
          confirm: req.body?.confirm,
        })
        return sendSuccess(res, {
          data: {
            wallet: {
              accountId: result.wallet.accountId,
              displayAlias: result.wallet.displayAlias,
              balanceCredits: result.wallet.balanceCredits,
              lastResetAt: result.wallet.lastResetAt,
              currency: "DEMO_CREDITS",
              simulated: true,
            },
            transaction: result.transaction,
          },
          source: "cryptoart-demo-ledger",
          asOf: new Date().toISOString(),
          stale: false,
        })
      } catch (err) {
        return next(err)
      }
    },

    async listTransactions(req, res, next) {
      try {
        const ledger = await demoService.getTransactions(req.demoWallet.accountId, {
          page: req.query.page,
          limit: req.query.limit,
        })
        return sendSuccess(res, {
          data: ledger,
          source: "cryptoart-demo-ledger",
          asOf: new Date().toISOString(),
          stale: false,
        })
      } catch (err) {
        return next(err)
      }
    },

    async executeSwap(req, res, next) {
      try {
        const result = await demoService.executeDemoSwap(req.demoWallet, {
          paySymbol: req.body?.paySymbol,
          receiveSymbol: req.body?.receiveSymbol,
          payAmount: req.body?.payAmount,
          receiveAmount: req.body?.receiveAmount,
          idempotencyKey: req.body?.idempotencyKey || req.headers["idempotency-key"],
        })
        return sendSuccess(res, {
          data: {
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

    async listStaking(req, res, next) {
      try {
        const positions = await demoService.listStakingPositions(req.demoWallet.accountId)
        return sendSuccess(res, {
          data: { positions },
          source: "cryptoart-demo-ledger",
          asOf: new Date().toISOString(),
          stale: false,
        })
      } catch (err) {
        return next(err)
      }
    },

    async stake(req, res, next) {
      try {
        const result = await demoService.stakeDemoCredits(req.demoWallet, {
          poolSlug: req.body?.poolSlug,
          poolTitle: req.body?.poolTitle,
          aprPct: req.body?.aprPct,
          lockDays: req.body?.lockDays,
          amountCredits: req.body?.amountCredits,
          idempotencyKey: req.body?.idempotencyKey || req.headers["idempotency-key"],
        })
        return sendSuccess(
          res,
          {
            data: {
              wallet: {
                accountId: result.wallet.accountId,
                balanceCredits: result.wallet.balanceCredits,
              },
              position: result.position,
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

    async unstake(req, res, next) {
      try {
        const result = await demoService.unstakeDemoPosition(
          req.demoWallet,
          req.params.positionId
        )
        return sendSuccess(res, {
          data: {
            wallet: {
              accountId: result.wallet.accountId,
              balanceCredits: result.wallet.balanceCredits,
            },
            position: result.position,
            transaction: result.transaction,
          },
          source: "cryptoart-demo-ledger",
          asOf: new Date().toISOString(),
          stale: false,
        })
      } catch (err) {
        return next(err)
      }
    },
  }
}
