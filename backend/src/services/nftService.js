import { NFT } from "../models/NFT.js"
import { DemoWallet } from "../models/DemoWallet.js"
import { DemoTransaction } from "../models/DemoTransaction.js"
import { DemoBid } from "../models/DemoBid.js"
import { makeDemoTxId } from "./demoService.js"
import { isValidObjectId } from "../validators/nftValidator.js"

const SIMULATED_META = {
  simulated: true,
  disclaimer: "Simulated — No blockchain transaction",
}

export function createNftService({ models = {}, cloudinaryService } = {}) {
  const NftModel = models.NFT || NFT
  const WalletModel = models.DemoWallet || DemoWallet
  const TxModel = models.DemoTransaction || DemoTransaction
  const BidModel = models.DemoBid || DemoBid

  return {
    async listNfts({
      search = "",
      category = "All",
      sort = "newest",
      status = "active",
      ownerAccountId,
      creatorAccountId,
      page = 1,
      limit = 12,
    } = {}) {
      const filter = {}
      if (status && status !== "all") {
        filter.listingStatus = status
      }
      if (category && category !== "All") {
        filter.category = category
      }
      if (ownerAccountId) {
        filter.ownerAccountId = ownerAccountId
      }
      if (creatorAccountId) {
        filter.creatorAccountId = creatorAccountId
      }
      if (search && String(search).trim()) {
        const rx = new RegExp(
          String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i"
        )
        filter.$or = [{ title: rx }, { creatorAlias: rx }, { description: rx }]
      }

      const sortMap = {
        newest: { createdAt: -1 },
        price_asc: { priceCredits: 1 },
        price_desc: { priceCredits: -1 },
      }
      const sortObj = sortMap[sort] || sortMap.newest

      const safePage = Math.max(1, Number.parseInt(page, 10) || 1)
      const safeLimit = Math.min(48, Math.max(1, Number.parseInt(limit, 10) || 12))
      const skip = (safePage - 1) * safeLimit

      const [items, total] = await Promise.all([
        NftModel.find(filter).sort(sortObj).skip(skip).limit(safeLimit).lean(),
        NftModel.countDocuments(filter),
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

    async getNftById(id) {
      if (!isValidObjectId(id)) {
        const err = new Error("Invalid NFT identifier.")
        err.status = 400
        err.code = "INVALID_ID"
        throw err
      }
      const nft = await NftModel.findById(id).lean()
      if (!nft) {
        const err = new Error("NFT listing not found.")
        err.status = 404
        err.code = "NOT_FOUND"
        throw err
      }
      const bids = await BidModel.find({ nftId: nft._id })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean()
      return { nft, bids }
    },

    async createNft(wallet, validatedInput) {
      const doc = await NftModel.create({
        ...validatedInput,
        creatorAccountId: wallet.accountId,
        creatorAlias: wallet.displayAlias,
        ownerAccountId: wallet.accountId,
        ownerAlias: wallet.displayAlias,
        listingStatus: "active",
        isSampleSeed: false,
      })

      const tx = await TxModel.create({
        demoTxId: makeDemoTxId(),
        accountId: wallet.accountId,
        nftId: doc._id,
        type: "mint",
        amountCredits: 0,
        status: "confirmed",
        note: `Created off-chain demo listing "${doc.title}"`,
        metadata: SIMULATED_META,
      })

      return {
        nft: doc.toObject ? doc.toObject() : doc,
        transaction: tx.toObject ? tx.toObject() : tx,
      }
    },

    async updateNft(wallet, nftId, updates) {
      if (!isValidObjectId(nftId)) {
        const err = new Error("Invalid NFT identifier.")
        err.status = 400
        err.code = "INVALID_ID"
        throw err
      }

      const existing = await NftModel.findById(nftId).lean()
      if (!existing) {
        const err = new Error("NFT listing not found.")
        err.status = 404
        err.code = "NOT_FOUND"
        throw err
      }

      if (existing.ownerAccountId !== wallet.accountId) {
        const err = new Error("Only the current owner can modify this listing.")
        err.status = 403
        err.code = "FORBIDDEN"
        throw err
      }

      const updated = await NftModel.findOneAndUpdate(
        { _id: nftId, ownerAccountId: wallet.accountId },
        { $set: updates },
        { new: true }
      ).lean()

      return updated
    },

    async deleteNft(wallet, nftId) {
      if (!isValidObjectId(nftId)) {
        const err = new Error("Invalid NFT identifier.")
        err.status = 400
        err.code = "INVALID_ID"
        throw err
      }

      const existing = await NftModel.findById(nftId).lean()
      if (!existing) {
        const err = new Error("NFT listing not found.")
        err.status = 404
        err.code = "NOT_FOUND"
        throw err
      }

      if (existing.ownerAccountId !== wallet.accountId && existing.creatorAccountId !== wallet.accountId) {
        const err = new Error("Only the creator or current owner can delete this listing.")
        err.status = 403
        err.code = "FORBIDDEN"
        throw err
      }

      if (existing.listingType === "auction" && existing.highestBidderAccountId) {
        const err = new Error("Cannot delete an active auction that already has placed bids.")
        err.status = 409
        err.code = "ACTIVE_BIDS_EXIST"
        throw err
      }

      const deleted = await NftModel.findOneAndDelete({
        _id: nftId,
        ownerAccountId: existing.ownerAccountId,
      }).lean()

      if (deleted?.media?.publicId && cloudinaryService) {
        try {
          await cloudinaryService.deleteImage(deleted.media.publicId)
        } catch (cloudErr) {
          console.error(`[Cloudinary Cleanup Warning] ${cloudErr.message}`)
        }
      }

      return { deletedId: String(nftId), publicIdCleaned: Boolean(deleted?.media?.publicId) }
    },

    async purchaseNft(wallet, nftId, { idempotencyKey } = {}) {
      if (!isValidObjectId(nftId)) {
        const err = new Error("Invalid NFT identifier.")
        err.status = 400
        err.code = "INVALID_ID"
        throw err
      }

      if (idempotencyKey) {
        const priorTx = await TxModel.findOne({
          accountId: wallet.accountId,
          idempotencyKey,
        }).lean()
        if (priorTx) {
          const [latestWallet, nft] = await Promise.all([
            WalletModel.findOne({ accountId: wallet.accountId }).lean(),
            NftModel.findById(nftId).lean(),
          ])
          return {
            nft,
            wallet: latestWallet,
            transaction: priorTx,
            idempotentReplay: true,
          }
        }
      }

      const target = await NftModel.findById(nftId).lean()
      if (!target) {
        const err = new Error("NFT listing not found.")
        err.status = 404
        err.code = "NOT_FOUND"
        throw err
      }
      if (target.listingStatus !== "active") {
        const err = new Error("Listing is no longer active for purchase.")
        err.status = 409
        err.code = "LISTING_UNAVAILABLE"
        throw err
      }
      if (target.listingType !== "fixed") {
        const err = new Error("Auction items must be bid on rather than instant-purchased.")
        err.status = 400
        err.code = "AUCTION_ONLY"
        throw err
      }
      if (target.ownerAccountId === wallet.accountId) {
        const err = new Error("You already own this listing.")
        err.status = 400
        err.code = "CANNOT_BUY_OWN_NFT"
        throw err
      }

      // Check buyer balance upfront for fast clear error before locking listing
      const buyerSnapshot = await WalletModel.findOne({ accountId: wallet.accountId }).lean()
      if (!buyerSnapshot || buyerSnapshot.balanceCredits < target.priceCredits) {
        const err = new Error(
          `Insufficient demo credits. Required ${target.priceCredits}, available ${buyerSnapshot?.balanceCredits ?? 0}.`
        )
        err.status = 400
        err.code = "INSUFFICIENT_DEMO_CREDITS"
        throw err
      }

      // Step 1: Atomically claim listing so concurrent purchases cannot both win
      const lockedListing = await NftModel.findOneAndUpdate(
        {
          _id: nftId,
          listingStatus: "active",
          listingType: "fixed",
          ownerAccountId: { $ne: wallet.accountId },
        },
        {
          $set: {
            listingStatus: "sold",
            ownerAccountId: wallet.accountId,
            ownerAlias: wallet.displayAlias,
          },
        },
        { new: false }
      ).lean()

      if (!lockedListing) {
        const err = new Error("Listing was just purchased or modified by another request.")
        err.status = 409
        err.code = "CONCURRENT_PURCHASE_CONFLICT"
        throw err
      }

      // Step 2: Atomically debit buyer; compensate listing if concurrent debit depleted funds
      const debitedBuyer = await WalletModel.findOneAndUpdate(
        {
          accountId: wallet.accountId,
          balanceCredits: { $gte: lockedListing.priceCredits },
        },
        { $inc: { balanceCredits: -lockedListing.priceCredits } },
        { new: true }
      ).lean()

      if (!debitedBuyer) {
        await NftModel.findOneAndUpdate(
          { _id: nftId, ownerAccountId: wallet.accountId },
          {
            $set: {
              listingStatus: "active",
              ownerAccountId: lockedListing.ownerAccountId,
              ownerAlias: lockedListing.ownerAlias,
            },
          }
        )
        const err = new Error("Insufficient demo credits for purchase.")
        err.status = 400
        err.code = "INSUFFICIENT_DEMO_CREDITS"
        throw err
      }

      // Step 3: Credit seller if seller is a demo wallet account
      const previousOwnerId = lockedListing.ownerAccountId
      if (previousOwnerId && previousOwnerId !== "DEMO-SYSTEM") {
        await WalletModel.findOneAndUpdate(
          { accountId: previousOwnerId },
          { $inc: { balanceCredits: lockedListing.priceCredits } }
        )
        await TxModel.create({
          demoTxId: makeDemoTxId(),
          accountId: previousOwnerId,
          counterpartyAccountId: wallet.accountId,
          nftId: lockedListing._id,
          type: "sell",
          amountCredits: lockedListing.priceCredits,
          status: "confirmed",
          note: `Sold "${lockedListing.title}" to ${wallet.displayAlias}`,
          metadata: SIMULATED_META,
        })
      }

      // Step 4: Record buyer receipt
      const buyerTx = await TxModel.create({
        demoTxId: makeDemoTxId(),
        idempotencyKey: idempotencyKey || null,
        accountId: wallet.accountId,
        counterpartyAccountId: previousOwnerId,
        nftId: lockedListing._id,
        type: "buy",
        amountCredits: lockedListing.priceCredits,
        status: "confirmed",
        note: `Purchased "${lockedListing.title}" for ${lockedListing.priceCredits} demo credits`,
        metadata: SIMULATED_META,
      })

      const finalNft = await NftModel.findById(nftId).lean()

      return {
        nft: finalNft,
        wallet: debitedBuyer,
        transaction: buyerTx.toObject ? buyerTx.toObject() : buyerTx,
        idempotentReplay: false,
      }
    },

    async placeDemoBid(wallet, nftId, { amountCredits, idempotencyKey } = {}) {
      if (!isValidObjectId(nftId)) {
        const err = new Error("Invalid NFT identifier.")
        err.status = 400
        err.code = "INVALID_ID"
        throw err
      }

      const bidAmount = Number(amountCredits)
      if (!Number.isInteger(bidAmount) || bidAmount < 1) {
        const err = new Error("Bid amount must be a whole integer of at least 1 demo credit.")
        err.status = 400
        err.code = "INVALID_BID_AMOUNT"
        throw err
      }

      if (idempotencyKey) {
        const priorTx = await TxModel.findOne({
          accountId: wallet.accountId,
          idempotencyKey,
        }).lean()
        if (priorTx) {
          const [latestWallet, nft] = await Promise.all([
            WalletModel.findOne({ accountId: wallet.accountId }).lean(),
            NftModel.findById(nftId).lean(),
          ])
          return { nft, wallet: latestWallet, transaction: priorTx, idempotentReplay: true }
        }
      }

      const target = await NftModel.findById(nftId).lean()
      if (!target) {
        const err = new Error("NFT auction not found.")
        err.status = 404
        err.code = "NOT_FOUND"
        throw err
      }
      if (target.listingStatus !== "active" || target.listingType !== "auction") {
        const err = new Error("This listing is not an active demo auction.")
        err.status = 400
        err.code = "NOT_AN_ACTIVE_AUCTION"
        throw err
      }
      if (target.ownerAccountId === wallet.accountId) {
        const err = new Error("Owner cannot bid on their own auction.")
        err.status = 400
        err.code = "CANNOT_BID_OWN_NFT"
        throw err
      }

      const minRequired =
        target.highestBidCredits > 0
          ? target.highestBidCredits + 1
          : target.priceCredits
      if (bidAmount < minRequired) {
        const err = new Error(`Bid must be at least ${minRequired} demo credits.`)
        err.status = 400
        err.code = "BID_TOO_LOW"
        throw err
      }

      // Debit bidder atomically
      const debitedBidder = await WalletModel.findOneAndUpdate(
        { accountId: wallet.accountId, balanceCredits: { $gte: bidAmount } },
        { $inc: { balanceCredits: -bidAmount } },
        { new: true }
      ).lean()

      if (!debitedBidder) {
        const err = new Error("Insufficient demo credits to place bid.")
        err.status = 400
        err.code = "INSUFFICIENT_DEMO_CREDITS"
        throw err
      }

      // Atomically claim highest bid only if no higher bid arrived concurrently
      const prevSnapshot = await NftModel.findOneAndUpdate(
        {
          _id: nftId,
          listingStatus: "active",
          listingType: "auction",
          highestBidCredits: { $lt: bidAmount },
        },
        {
          $set: {
            highestBidCredits: bidAmount,
            highestBidderAccountId: wallet.accountId,
          },
        },
        { new: false }
      ).lean()

      if (!prevSnapshot) {
        await WalletModel.findOneAndUpdate(
          { accountId: wallet.accountId },
          { $inc: { balanceCredits: bidAmount } }
        )
        const err = new Error("A higher bid was just accepted; your credits were not charged.")
        err.status = 409
        err.code = "OUTBID_CONFLICT"
        throw err
      }

      // Refund previous highest bidder if any
      if (prevSnapshot.highestBidderAccountId && prevSnapshot.highestBidCredits > 0) {
        await WalletModel.findOneAndUpdate(
          { accountId: prevSnapshot.highestBidderAccountId },
          { $inc: { balanceCredits: prevSnapshot.highestBidCredits } }
        )
        await BidModel.updateMany(
          { nftId: prevSnapshot._id, status: "active" },
          { $set: { status: "outbid" } }
        )
        await TxModel.create({
          demoTxId: makeDemoTxId(),
          accountId: prevSnapshot.highestBidderAccountId,
          nftId: prevSnapshot._id,
          type: "outbid_refund",
          amountCredits: prevSnapshot.highestBidCredits,
          status: "confirmed",
          note: `Outbid refund for "${prevSnapshot.title}"`,
          metadata: SIMULATED_META,
        })
      }

      await BidModel.create({
        nftId: prevSnapshot._id,
        bidderAccountId: wallet.accountId,
        bidderAlias: wallet.displayAlias,
        amountCredits: bidAmount,
        status: "active",
      })

      const tx = await TxModel.create({
        demoTxId: makeDemoTxId(),
        idempotencyKey: idempotencyKey || null,
        accountId: wallet.accountId,
        nftId: prevSnapshot._id,
        type: "bid",
        amountCredits: bidAmount,
        status: "confirmed",
        note: `Placed ${bidAmount} demo credit bid on "${prevSnapshot.title}"`,
        metadata: SIMULATED_META,
      })

      const updatedNft = await NftModel.findById(nftId).lean()

      return {
        nft: updatedNft,
        wallet: debitedBidder,
        transaction: tx.toObject ? tx.toObject() : tx,
        idempotentReplay: false,
      }
    },
  }
}
