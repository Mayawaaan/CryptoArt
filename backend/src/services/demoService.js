import crypto from "node:crypto"
import { hashSessionId } from "../middleware/demoAuth.js"
import { DemoWallet } from "../models/DemoWallet.js"
import { DemoTransaction } from "../models/DemoTransaction.js"
import { DemoPosition } from "../models/DemoPosition.js"
import { getDatabaseStatus } from "../config/db.js"
import { config } from "../config/env.js"

export const INITIAL_DEMO_CREDITS = 10_000

const SIMULATED_META = {
  simulated: true,
  disclaimer: "Simulated — No blockchain transaction",
}

function makeDemoAccountId() {
  return `DEMO-${crypto.randomBytes(6).toString("hex").toUpperCase()}`
}

export function makeDemoTxId() {
  return `DEMO-TX-${crypto.randomBytes(8).toString("hex").toUpperCase()}`
}

export function createDemoService(models = {}) {
  const WalletModel = models.DemoWallet || DemoWallet
  const TxModel = models.DemoTransaction || DemoTransaction
  const PositionModel = models.DemoPosition || DemoPosition
  const isDbReady = models.isDbReady || (() => getDatabaseStatus(config.mongodbUri).connected)

  return {
    isReady() {
      return isDbReady()
    },

    async findWalletBySessionId(sessionId) {
      if (!sessionId || !isDbReady()) return null
      const sessionTokenHash = hashSessionId(sessionId)
      return WalletModel.findOne({ sessionTokenHash }).lean()
    },

    async startOrResumeSession(existingSessionId, requestedAlias) {
      if (existingSessionId) {
        const existing = await this.findWalletBySessionId(existingSessionId)
        if (existing) {
          return {
            sessionId: existingSessionId,
            wallet: existing,
            created: false,
          }
        }
      }

      const sessionId = crypto.randomBytes(24).toString("hex")
      const sessionTokenHash = hashSessionId(sessionId)
      const accountId = makeDemoAccountId()
      const displayAlias =
        String(requestedAlias || "")
          .replace(/[<>]/g, "")
          .trim()
          .slice(0, 48) || `Trader-${accountId.slice(-4)}`

      const walletDoc = await WalletModel.create({
        accountId,
        sessionTokenHash,
        displayAlias,
        balanceCredits: INITIAL_DEMO_CREDITS,
        initialGrantCredits: INITIAL_DEMO_CREDITS,
      })

      await TxModel.create({
        demoTxId: makeDemoTxId(),
        accountId,
        type: "credit",
        amountCredits: INITIAL_DEMO_CREDITS,
        status: "confirmed",
        note: "Initial simulated demo credits allocated",
        metadata: SIMULATED_META,
      })

      return {
        sessionId,
        wallet: walletDoc.toObject ? walletDoc.toObject() : walletDoc,
        created: true,
      }
    },

    async getWalletSummary(wallet) {
      return WalletModel.findOne({ accountId: wallet.accountId }).lean()
    },

    async resetWallet(wallet, { confirm } = {}) {
      if (confirm !== true) {
        const err = new Error("Reset confirmation flag { confirm: true } is required.")
        err.status = 400
        err.code = "CONFIRMATION_REQUIRED"
        throw err
      }

      const updated = await WalletModel.findOneAndUpdate(
        { accountId: wallet.accountId },
        {
          $set: {
            balanceCredits: INITIAL_DEMO_CREDITS,
            lastResetAt: new Date(),
          },
        },
        { new: true }
      ).lean()

      await PositionModel.updateMany(
        { accountId: wallet.accountId, status: "active" },
        { $set: { status: "withdrawn", withdrawnAt: new Date() } }
      )

      const tx = await TxModel.create({
        demoTxId: makeDemoTxId(),
        accountId: wallet.accountId,
        type: "reset",
        amountCredits: INITIAL_DEMO_CREDITS,
        status: "confirmed",
        note: "Demo wallet reset to initial 10,000 simulated credits",
        metadata: SIMULATED_META,
      })

      return {
        wallet: updated,
        transaction: tx.toObject ? tx.toObject() : tx,
      }
    },

    async getTransactions(accountId, { page = 1, limit = 20 } = {}) {
      const safePage = Math.max(1, Number.parseInt(page, 10) || 1)
      const safeLimit = Math.min(50, Math.max(1, Number.parseInt(limit, 10) || 20))
      const skip = (safePage - 1) * safeLimit

      const [items, total] = await Promise.all([
        TxModel.find({ accountId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(safeLimit)
          .lean(),
        TxModel.countDocuments({ accountId }),
      ])

      return {
        items,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          totalPages: Math.max(1, Math.ceil(total / safeLimit)),
        },
      }
    },

    async executeDemoSwap(wallet, { paySymbol, receiveSymbol, payAmount, receiveAmount, idempotencyKey }) {
      const cleanPay = String(paySymbol || "").trim().toUpperCase()
      const cleanRecv = String(receiveSymbol || "").trim().toUpperCase()
      const parsedPay = Number(payAmount)
      const parsedRecv = Number(receiveAmount)

      if (!cleanPay || !cleanRecv || cleanPay === cleanRecv) {
        const err = new Error("Choose two distinct assets for a simulated swap.")
        err.status = 400
        err.code = "INVALID_PAIR"
        throw err
      }
      if (!Number.isFinite(parsedPay) || parsedPay <= 0 || !Number.isFinite(parsedRecv) || parsedRecv <= 0) {
        const err = new Error("Swap amounts must be greater than zero.")
        err.status = 400
        err.code = "INVALID_AMOUNT"
        throw err
      }

      if (idempotencyKey) {
        const existingTx = await TxModel.findOne({
          accountId: wallet.accountId,
          idempotencyKey,
        }).lean()
        if (existingTx) {
          const latestWallet = await WalletModel.findOne({ accountId: wallet.accountId }).lean()
          return { wallet: latestWallet, transaction: existingTx, idempotentReplay: true }
        }
      }

      const feeCredits = 1
      const updatedWallet = await WalletModel.findOneAndUpdate(
        { accountId: wallet.accountId, balanceCredits: { $gte: feeCredits } },
        { $inc: { balanceCredits: -feeCredits } },
        { new: true }
      ).lean()

      if (!updatedWallet) {
        const err = new Error("Insufficient demo credits for simulated swap fee (1 credit).")
        err.status = 400
        err.code = "INSUFFICIENT_DEMO_CREDITS"
        throw err
      }

      const tx = await TxModel.create({
        demoTxId: makeDemoTxId(),
        idempotencyKey: idempotencyKey || null,
        accountId: wallet.accountId,
        type: "swap",
        amountCredits: feeCredits,
        status: "confirmed",
        note: `Simulated conversion ${parsedPay} ${cleanPay} → ${parsedRecv} ${cleanRecv} (1 credit demo fee)`,
        metadata: {
          ...SIMULATED_META,
          paySymbol: cleanPay,
          receiveSymbol: cleanRecv,
          payAmount: parsedPay,
          receiveAmount: parsedRecv,
        },
      })

      return {
        wallet: updatedWallet,
        transaction: tx.toObject ? tx.toObject() : tx,
        idempotentReplay: false,
      }
    },

    async listStakingPositions(accountId) {
      return PositionModel.find({ accountId })
        .sort({ createdAt: -1 })
        .lean()
    },

    async stakeDemoCredits(wallet, { poolSlug, poolTitle, aprPct, lockDays, amountCredits, idempotencyKey }) {
      const amount = Number(amountCredits)
      if (!Number.isInteger(amount) || amount < 1 || amount > 1_000_000) {
        const err = new Error("Stake amount must be a whole integer of at least 1 demo credit.")
        err.status = 400
        err.code = "INVALID_AMOUNT"
        throw err
      }

      if (idempotencyKey) {
        const existingTx = await TxModel.findOne({
          accountId: wallet.accountId,
          idempotencyKey,
        }).lean()
        if (existingTx) {
          const latestWallet = await WalletModel.findOne({ accountId: wallet.accountId }).lean()
          const positions = await this.listStakingPositions(wallet.accountId)
          return { wallet: latestWallet, positions, transaction: existingTx, idempotentReplay: true }
        }
      }

      const updatedWallet = await WalletModel.findOneAndUpdate(
        { accountId: wallet.accountId, balanceCredits: { $gte: amount } },
        { $inc: { balanceCredits: -amount } },
        { new: true }
      ).lean()

      if (!updatedWallet) {
        const err = new Error("Insufficient demo credits to open staking position.")
        err.status = 400
        err.code = "INSUFFICIENT_DEMO_CREDITS"
        throw err
      }

      const lockDaysNum = Math.max(0, Number(lockDays) || 0)
      const unlockAt = new Date(Date.now() + lockDaysNum * 24 * 60 * 60 * 1000)

      let position
      try {
        position = await PositionModel.create({
          accountId: wallet.accountId,
          poolSlug: String(poolSlug || "core-native-pool"),
          poolTitle: String(poolTitle || "Demo Pool"),
          aprPct: Number(aprPct) || 5,
          lockDays: lockDaysNum,
          principalCredits: amount,
          unlockAt,
          status: "active",
        })
      } catch (err) {
        await WalletModel.findOneAndUpdate(
          { accountId: wallet.accountId },
          { $inc: { balanceCredits: amount } }
        )
        throw err
      }

      const tx = await TxModel.create({
        demoTxId: makeDemoTxId(),
        idempotencyKey: idempotencyKey || null,
        accountId: wallet.accountId,
        type: "stake",
        amountCredits: amount,
        status: "confirmed",
        note: `Simulated stake of ${amount} demo credits in ${poolTitle}`,
        metadata: {
          ...SIMULATED_META,
          poolSlug,
          aprPct,
          lockDays: lockDaysNum,
        },
      })

      return {
        wallet: updatedWallet,
        position: position.toObject ? position.toObject() : position,
        transaction: tx.toObject ? tx.toObject() : tx,
        idempotentReplay: false,
      }
    },

    async unstakeDemoPosition(wallet, positionId) {
      const pos = await PositionModel.findOne({
        _id: positionId,
        accountId: wallet.accountId,
        status: "active",
      }).lean()

      if (!pos) {
        const err = new Error("Active staking position not found.")
        err.status = 404
        err.code = "POSITION_NOT_FOUND"
        throw err
      }

      // Enforce lock schedule unless lockDays === 0
      if (pos.lockDays > 0 && new Date(pos.unlockAt).getTime() > Date.now()) {
        const err = new Error(
          `Position is locked until ${new Date(pos.unlockAt).toISOString().slice(0, 10)}.`
        )
        err.status = 400
        err.code = "POSITION_LOCKED"
        throw err
      }

      const closed = await PositionModel.findOneAndUpdate(
        { _id: positionId, accountId: wallet.accountId, status: "active" },
        { $set: { status: "withdrawn", withdrawnAt: new Date() } },
        { new: true }
      ).lean()

      if (!closed) {
        const err = new Error("Position already withdrawn.")
        err.status = 409
        err.code = "ALREADY_WITHDRAWN"
        throw err
      }

      const elapsedMs = Math.max(0, Date.now() - new Date(pos.createdAt || Date.now()).getTime())
      const elapsedDays = Math.max(1, elapsedMs / (24 * 60 * 60 * 1000))
      const projectedYield = Math.floor((pos.principalCredits * (pos.aprPct / 100) * elapsedDays) / 365)
      const totalReturn = pos.principalCredits + projectedYield

      const updatedWallet = await WalletModel.findOneAndUpdate(
        { accountId: wallet.accountId },
        { $inc: { balanceCredits: totalReturn } },
        { new: true }
      ).lean()

      const tx = await TxModel.create({
        demoTxId: makeDemoTxId(),
        accountId: wallet.accountId,
        type: "unstake",
        amountCredits: totalReturn,
        status: "confirmed",
        note: `Simulated unstake (${pos.principalCredits} principal + ${projectedYield} projected reward) from ${pos.poolTitle}`,
        metadata: {
          ...SIMULATED_META,
          principalCredits: pos.principalCredits,
          projectedYield,
        },
      })

      return {
        wallet: updatedWallet,
        position: closed,
        transaction: tx.toObject ? tx.toObject() : tx,
      }
    },
  }
}
