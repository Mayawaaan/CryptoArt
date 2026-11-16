import mongoose from "mongoose"

const demoTransactionSchema = new mongoose.Schema(
  {
    demoTxId: { type: String, required: true, unique: true },
    idempotencyKey: { type: String, default: null },
    accountId: { type: String, required: true, index: true },
    counterpartyAccountId: { type: String, default: null },
    nftId: { type: mongoose.Schema.Types.ObjectId, ref: "NFT", default: null },
    type: {
      type: String,
      enum: [
        "credit",
        "buy",
        "sell",
        "bid",
        "outbid_refund",
        "mint",
        "swap",
        "stake",
        "unstake",
        "reset",
      ],
      required: true,
    },
    amountCredits: { type: Number, required: true },
    currency: { type: String, default: "DEMO_CREDITS" },
    status: { type: String, enum: ["confirmed", "rejected"], default: "confirmed" },
    note: { type: String, default: "" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

demoTransactionSchema.index(
  { accountId: 1, idempotencyKey: 1 },
  { unique: true, partialFilterExpression: { idempotencyKey: { $type: "string" } } }
)

export const DemoTransaction =
  mongoose.models.DemoTransaction ||
  mongoose.model("DemoTransaction", demoTransactionSchema)
