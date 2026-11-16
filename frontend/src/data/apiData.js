const endpoints = [
  {
    method: "GET",
    path: "/api/health",
    description: "Check backend readiness, MongoDB connection status, Cloudinary availability, and market adapters.",
  },
  {
    method: "GET",
    path: "/api/markets?vsCurrency=inr",
    description:
      "Retrieve normalized crypto market snapshots (CoinGecko with Binance fallback) and central-bank FX reference rates (Frankfurter).",
  },
  {
    method: "GET",
    path: "/api/markets/:asset/history?vsCurrency=inr&days=7",
    description:
      "Fetch historical price series (Binance klines / CoinGecko chart for crypto; Frankfurter series for forex).",
  },
  {
    method: "GET",
    path: "/api/markets/:asset/trades?vsCurrency=inr&limit=20",
    description: "Retrieve recent public exchange spot trades converted into the requested quote currency.",
  },
  {
    method: "GET",
    path: "/api/forex/rates?base=INR",
    description: "Get Frankfurter central-bank reference exchange rates.",
  },
  {
    method: "GET",
    path: "/api/dex/pairs?q=ETH",
    description: "Query live on-chain DEX pair liquidity, volume, and pricing via DEX Screener.",
  },
  {
    method: "POST",
    path: "/api/demo/session",
    description: "Initialize an HTTP-only signed Demo Wallet session credited with 10,000 simulated Demo Credits.",
  },
  {
    method: "GET / POST",
    path: "/api/demo/wallet | /api/demo/reset",
    description: "Inspect the active simulated Demo Wallet balance or reset balance to 10,000 Demo Credits.",
  },
  {
    method: "GET / POST",
    path: "/api/demo/swap | /api/demo/staking | /api/demo/transactions",
    description: "Execute simulated swaps, stake/unstake demo vaults, and read paginated simulated ledger transactions.",
  },
  {
    method: "POST",
    path: "/api/uploads/nft",
    description: "Validate MIME/magic bytes (JPEG/PNG/WebP <= 5MB) and stream media uploads to Cloudinary.",
  },
  {
    method: "GET / POST / PATCH / DELETE",
    path: "/api/nfts | /api/nfts/:id",
    description: "Query paginated MongoDB NFT listings, create artworks, edit prices/status, or remove owned listings with Cloudinary cleanup.",
  },
  {
    method: "POST",
    path: "/api/nfts/:id/purchase | /api/nfts/:id/bids",
    description: "Atomically purchase fixed-price NFTs or place competitive auction bids (with outbid refund) using Demo Credits.",
  },
  {
    method: "GET",
    path: "/api/me/nfts",
    description: "List NFTs owned or created by the active Demo Wallet session.",
  },
  {
    method: "POST",
    path: "/api/newsletter | /api/support-requests",
    description: "Persist newsletter subscriptions and support tickets.",
  },
]

export default endpoints
