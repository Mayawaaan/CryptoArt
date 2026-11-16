import mongoose from "mongoose"

export const NFT_CATEGORIES = [
  "Art",
  "Collectibles",
  "Music",
  "Gaming",
  "Domain Names",
]

const mediaSchema = new mongoose.Schema(
  {
    publicId: { type: String, default: null },
    secureUrl: { type: String, required: true },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    format: { type: String, default: null },
    bytes: { type: Number, default: null },
    altText: { type: String, default: "" },
  },
  { _id: false }
)

const onChainSchema = new mongoose.Schema(
  {
    chainId: { type: Number, required: true },
    contractAddress: { type: String, required: true },
    tokenId: { type: String, required: true },
    transactionHash: { type: String, required: true },
  },
  { _id: false }
)

const nftSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1200, default: "" },
    category: { type: String, enum: NFT_CATEGORIES, default: "Art", index: true },
    tags: { type: [String], default: [] },
    creatorAccountId: { type: String, required: true, index: true },
    creatorAlias: { type: String, required: true, trim: true },
    ownerAccountId: { type: String, required: true, index: true },
    ownerAlias: { type: String, required: true, trim: true },
    media: { type: mediaSchema, required: true },
    priceCredits: { type: Number, required: true, min: 1 },
    listingType: { type: String, enum: ["fixed", "auction"], default: "fixed" },
    listingStatus: {
      type: String,
      enum: ["active", "sold", "unlisted"],
      default: "active",
      index: true,
    },
    highestBidCredits: { type: Number, default: 0, min: 0 },
    highestBidderAccountId: { type: String, default: null },
    auctionEndsAt: { type: Date, default: null },
    isSampleSeed: { type: Boolean, default: false },
    onChain: { type: onChainSchema, default: null },
  },
  { timestamps: true }
)

nftSchema.index({ title: "text", description: "text", creatorAlias: "text" })

export const NFT = mongoose.models.NFT || mongoose.model("NFT", nftSchema)
