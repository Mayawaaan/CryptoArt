import mongoose from "mongoose"

const demoWalletSchema = new mongoose.Schema(
  {
    accountId: { type: String, required: true, unique: true, index: true },
    sessionTokenHash: { type: String, required: true, unique: true, index: true },
    displayAlias: { type: String, required: true, trim: true, maxlength: 48 },
    balanceCredits: { type: Number, required: true, min: 0, default: 10000 },
    initialGrantCredits: { type: Number, required: true, default: 10000 },
    status: { type: String, enum: ["active"], default: "active" },
    lastResetAt: { type: Date, default: null },
  },
  { timestamps: true }
)

export const DemoWallet =
  mongoose.models.DemoWallet || mongoose.model("DemoWallet", demoWalletSchema)
