import mongoose from "mongoose"

const demoPositionSchema = new mongoose.Schema(
  {
    accountId: { type: String, required: true, index: true },
    poolSlug: { type: String, required: true, index: true },
    poolTitle: { type: String, required: true },
    aprPct: { type: Number, required: true },
    lockDays: { type: Number, required: true, default: 0 },
    principalCredits: { type: Number, required: true, min: 1 },
    unlockAt: { type: Date, required: true },
    status: { type: String, enum: ["active", "withdrawn"], default: "active" },
    withdrawnAt: { type: Date, default: null },
  },
  { timestamps: true }
)

export const DemoPosition =
  mongoose.models.DemoPosition ||
  mongoose.model("DemoPosition", demoPositionSchema)
