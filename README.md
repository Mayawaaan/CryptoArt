# CryptoArt

CryptoArt is a full-stack multi-asset market tracking, creator NFT studio, demo credit simulation, and Web3 prototype application separated cleanly into `frontend/`, `backend/`, and `contracts/`.

> **Prototype & Demo Disclaimer:**
> - **Demo Wallet / Demo Credits (`DEMO_CREDITS`)** are simulated off-chain balances persisted in MongoDB with **zero real-world monetary value** and **no blockchain execution**.
> - **Smart Contracts (`contracts/`)** (`CryptoArtToken`, `CryptoArtStaking`, `CryptoArtSwapPool`, `CryptoArtNFTMarketplace`) are **unaudited prototypes** built strictly for local Hardhat (`31337`) and EVM testnet (`sepolia`, `11155111`) demonstration. Never deploy them to mainnet with real funds.

---

## Directory Architecture

```
CryptoArt/
├── frontend/                  # React 19, Vite 7, Tailwind CSS v4, Motion, GSAP, Lenis, Three.js, Wagmi
│   ├── public/seed-nfts/      # Rights-cleared geometric SVG assets for initial MongoDB seeding
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/          # Preserved CurrencyCoinScene.jsx + redesigned landing sections
│   │   │   └── ui/            # Restraint UI primitives (Dialog, Tabs, DataTable, Button, Toast, Skeleton)
│   │   ├── context/           # ThemeContext, LenisContext, DemoWalletContext, MarketContext
│   │   ├── services/          # marketApi.js, demoApi.js
│   │   └── pages/             # Route views (/market-track, /swap, /stake, /nft-gallery, /nft-gallery/create, /nft-gallery/:id, /collection, /demo-activity, ...)
│   └── .env.example
├── backend/                   # Express 5, Mongoose (MongoDB), Cloudinary SDK, Multer, cookie-parser
│   ├── src/
│   │   ├── config/            # env, MongoDB connector, Cloudinary config
│   │   ├── models/            # NFT, DemoWallet, DemoTransaction, DemoPosition, DemoBid
│   │   ├── middleware/        # HMAC HTTP-only demo session auth & CSRF Origin/Referer policy
│   │   ├── services/          # marketService, storageService, demoService, nftService
│   │   ├── validators/        # MIME + magic-byte media validator, NFT payload sanitization
│   │   └── scripts/           # seedNfts.js (idempotent catalog seeding)
│   ├── tests/                 # Node test runner suite (unit + in-process HTTP + race condition tests)
│   └── .env.example
├── contracts/                 # Hardhat + Solidity 0.8.28 + OpenZeppelin v5 contracts & tests
│   └── .env.example
└── scripts/dev.mjs            # Root coordinator launching backend + frontend concurrently
```

---

## Three-Anchor Design System

All application UI colors, charts, and Three.js 3D materials/lighting derive from **three** user-editable CSS anchors in [`frontend/src/styles/theme.css`](frontend/src/styles/theme.css):

```css
:root {
  --ca-base: #10151E;
  --ca-text: #E9EDF4;
  --ca-accent: #9CAFE6;
}
```

Updating only those three variables cascades automatically across all derived `50..950` scales, Tailwind `@theme` utilities, Recharts series/grids, and `CurrencyCoinScene`.

---

## Environment Configuration

Copy each environment template before launching locally:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp contracts/.env.example contracts/.env
```

### Key Variables (`backend/.env`)
- `MONGODB_URI`: MongoDB connection string (`mongodb://127.0.0.1:27017/cryptoart_demo` or Atlas `mongodb+srv://...`). Works on standalone local MongoDB instances using atomic conditional `$inc` + `findOneAndUpdate` updates without requiring a replica set.
- `DEMO_SESSION_SECRET`: Long random secret for signing the `ca_demo_session` HTTP-only cookie.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Required for creator NFT image uploads via `POST /api/uploads/nft`.
- `COINGECKO_API_KEY` *(optional)*: Server-only CoinGecko Demo key for higher market feed rate limits.

Never place MongoDB URIs, Cloudinary API secrets, session secrets, or private keys in `frontend/.env` (`VITE_*` variables are public in browser bundles).

---

## Install, Seed & Run

```bash
# 1. Install dependencies per package
npm install --prefix frontend
npm install --prefix backend
npm install --prefix contracts

# 2. Seed initial curated NFT listings into MongoDB (idempotent)
npm run seed:nfts

# 3. Start both backend (:4000) and frontend (:5173)
npm run dev
```

### Optional Local Hardhat Chain & Testnet Deployment

```bash
# Terminal A — Start local Hardhat EVM node (chainId 31337)
npm run contracts:node

# Terminal B — Deploy prototype contracts & write frontend/src/contracts/deployments.json
npm run contracts:deploy:local
```

---

## Verification Commands

```bash
npm run lint
npm run build
npm run test:backend
npm run contracts:test
```
