import { config } from "../config/env.js"
import { connectDatabase, disconnectDatabase } from "../config/db.js"
import { NFT } from "../models/NFT.js"

const SAMPLE_LISTINGS = [
  {
    title: "Meridian Vector #01",
    description: "Rights-cleared geometric architectural study seeded for off-chain CryptoArt marketplace demonstration.",
    category: "Art",
    tags: ["geometry", "monolith", "sample"],
    creatorAccountId: "DEMO-SYSTEM",
    creatorAlias: "CryptoArt Archive",
    ownerAccountId: "DEMO-SYSTEM",
    ownerAlias: "CryptoArt Archive",
    media: {
      publicId: null,
      secureUrl: "/seed-nfts/sample-1.svg",
      width: 800,
      height: 800,
      format: "svg",
      bytes: 512,
      altText: "Geometric dual triangle and concentric circle vector study",
    },
    priceCredits: 1250,
    listingType: "fixed",
    listingStatus: "active",
    isSampleSeed: true,
    onChain: null,
  },
  {
    title: "Rotated Lattice #02",
    description: "Interlocking rotated squares exploring depth and structural balance.",
    category: "Collectibles",
    tags: ["lattice", "minimal", "sample"],
    creatorAccountId: "DEMO-SYSTEM",
    creatorAlias: "CryptoArt Archive",
    ownerAccountId: "DEMO-SYSTEM",
    ownerAlias: "CryptoArt Archive",
    media: {
      publicId: null,
      secureUrl: "/seed-nfts/sample-2.svg",
      width: 800,
      height: 800,
      format: "svg",
      bytes: 480,
      altText: "Concentric rotated squares composition",
    },
    priceCredits: 900,
    listingType: "auction",
    listingStatus: "active",
    highestBidCredits: 0,
    auctionEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isSampleSeed: true,
    onChain: null,
  },
  {
    title: "Harmonic Phase #03",
    description: "Continuous harmonic wave study representing liquidity frequency curves.",
    category: "Music",
    tags: ["audio", "wave", "sample"],
    creatorAccountId: "DEMO-SYSTEM",
    creatorAlias: "CryptoArt Archive",
    ownerAccountId: "DEMO-SYSTEM",
    ownerAlias: "CryptoArt Archive",
    media: {
      publicId: null,
      secureUrl: "/seed-nfts/sample-3.svg",
      width: 800,
      height: 800,
      format: "svg",
      bytes: 420,
      altText: "Three phase-shifted harmonic curves",
    },
    priceCredits: 750,
    listingType: "fixed",
    listingStatus: "active",
    isSampleSeed: true,
    onChain: null,
  },
  {
    title: "Orbit Node Grid #04",
    description: "Three-rail telemetry layout inspired by multi-asset order routing.",
    category: "Gaming",
    tags: ["grid", "nodes", "sample"],
    creatorAccountId: "DEMO-SYSTEM",
    creatorAlias: "CryptoArt Archive",
    ownerAccountId: "DEMO-SYSTEM",
    ownerAlias: "CryptoArt Archive",
    media: {
      publicId: null,
      secureUrl: "/seed-nfts/sample-4.svg",
      width: 800,
      height: 800,
      format: "svg",
      bytes: 490,
      altText: "Three horizontal rails with orbital nodes",
    },
    priceCredits: 1600,
    listingType: "fixed",
    listingStatus: "active",
    isSampleSeed: true,
    onChain: null,
  },
  {
    title: "Orbital Ring Study #05",
    description: "Tri-axis orbital study echoing the CryptoArt emblem geometry.",
    category: "Art",
    tags: ["orbit", "emblem", "sample"],
    creatorAccountId: "DEMO-SYSTEM",
    creatorAlias: "CryptoArt Archive",
    ownerAccountId: "DEMO-SYSTEM",
    ownerAlias: "CryptoArt Archive",
    media: {
      publicId: null,
      secureUrl: "/seed-nfts/sample-5.svg",
      width: 800,
      height: 800,
      format: "svg",
      bytes: 470,
      altText: "Tri-axis intersecting orbital ellipses",
    },
    priceCredits: 2100,
    listingType: "auction",
    listingStatus: "active",
    highestBidCredits: 0,
    auctionEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isSampleSeed: true,
    onChain: null,
  },
  {
    title: "vault.cryptoart.eth",
    description: "Prototype off-chain domain collectible demonstration listing.",
    category: "Domain Names",
    tags: ["domain", "identity", "sample"],
    creatorAccountId: "DEMO-SYSTEM",
    creatorAlias: "CryptoArt Archive",
    ownerAccountId: "DEMO-SYSTEM",
    ownerAlias: "CryptoArt Archive",
    media: {
      publicId: null,
      secureUrl: "/seed-nfts/sample-6.svg",
      width: 800,
      height: 800,
      format: "svg",
      bytes: 460,
      altText: "Square emblem with diamond frame and .ART label",
    },
    priceCredits: 3200,
    listingType: "fixed",
    listingStatus: "active",
    isSampleSeed: true,
    onChain: null,
  },
]

async function runSeed() {
  const conn = await connectDatabase(config.mongodbUri)
  if (!conn.connected) {
    console.error(`Seed aborted: ${conn.reason}`)
    process.exit(1)
  }

  let inserted = 0
  let skipped = 0

  for (const sample of SAMPLE_LISTINGS) {
    const existing = await NFT.findOne({
      title: sample.title,
      creatorAccountId: "DEMO-SYSTEM",
      isSampleSeed: true,
    }).lean()

    if (existing) {
      skipped += 1
      continue
    }

    await NFT.create(sample)
    inserted += 1
  }

  console.log(`CryptoArt sample NFT seed complete: ${inserted} inserted, ${skipped} already present.`)
  await disconnectDatabase()
}

runSeed().catch((err) => {
  console.error("Seed error:", err)
  process.exit(1)
})
