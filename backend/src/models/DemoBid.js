import mongoose from "mongoose"

const demoBidSchema = new mongoose.Schema(
  {
    nftId: { type: mongoose.Schema.Types.ObjectId, ref: "NFT", required: true, index: true },
    bidderAccountId: { type: String, required: true, index: true },
    bidderAlias: { type: String, required: true },
    amountCredits: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ["active", "outbid", "won"], default: "active" },
  },
  { timestamps: true }
)

export const DemoBid =
  mongoose.models.DemoBid || mongoose.model("DemoBid", demoBidSchema)
