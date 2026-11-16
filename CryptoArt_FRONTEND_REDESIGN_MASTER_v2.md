CRYPTOART — FRONTEND REDESIGN + SEPARATED BACKEND MASTER PROMPT
For Gemini Antigravity / agentic coding assistant — execute in the already-extracted CryptoArt repository.
YOUR ROLE AND GOAL
Act as the lead product designer, senior React engineer, and full-stack integration architect for CryptoArt. You have permission to implement changes in the currently opened workspace. This is an existing application, not a greenfield starter. Read the repository and its existing CryptoArt_MASTER.md first. Then implement a substantial, coherent redesign of all user-facing pages while keeping the existing Three.js currency coin scene, owner-selected colors, live market services, and functioning Web3 functionality intact.

The result should resemble a credible modern financial-product workspace combined with a curated digital-art marketplace: confident typography, intentional whitespace, disciplined hierarchy, excellent data density, restrained interaction design, and meaningful motion. No unnecessary emojis, confetti, gratuitous icon grids, neon, futuristic noise, or decorative Web3 clichés. Preserve brand identity unless the user supplies a new approved logo.

This document overrides any older master prompt where preservation, colors, folder separation, or demo-wallet behavior conflict. Do not provide concepts only: edit files, wire endpoints, run tests, and report what actually works. No mainnet transactions, real money, private-key custody, or unsupported performance/security claims.
1. CODEBASE REALITY — CONFIRM BEFORE EDITING
The uploaded CryptoArt.zip contains these actual components. Reinspect the local workspace before work because it might differ:
- Root React app: React 19, Vite 7, Tailwind v4, React Router 7, React Three Fiber/Three.js, GSAP, lenis, Recharts, wagmi, viem, TanStack Query.
- Existing backend at server/src/app.js (Express 5), market adapters for CoinGecko, Binance, DEX Screener and Frankfurter, and /api routes for market/FX/DEX/newsletter/support/NFT bids. It currently stores some content in server/data/store.json, not MongoDB.
- Existing contracts workspace at contracts/, Hardhat and Solidity: CryptoArtToken.sol, CryptoArtStaking.sol, CryptoArtSwapPool.sol, CryptoArtNFTMarketplace.sol. Treat these as existing unaudited local/testnet prototypes, not as missing functionality.
- Protected 3D scene: src/components/home/CurrencyCoinScene.jsx (309 lines in the inspected ZIP); used by src/components/home/HeroSection.jsx.
- Theme owner controls: src/styles/theme.css defines --ca-base, --ca-text, and --ca-accent; src/utils/themeTokens.js and src/context/ThemeContext.jsx derive other tokens, including scene tokens.
- Existing Lenis/GSAP integration: src/context/LenisContext.jsx.
- Existing wallet modal: src/components/wallet/WalletModal.jsx uses real injected EVM wallet connectors via src/web3/wagmiConfig.js. There is no independent demo wallet yet.
- NFT gallery src/pages/NFTGallery.jsx still initializes from src/data/nftData.js, then reads off-chain demo bids from API. It also includes on-chain auction functionality for a few predefined tokens. Do not confuse static gallery IDs, Mongo IDs, and on-chain token IDs.
- Existing routes in src/app/router.jsx: /, /swap, /stake, /market-track, /nft-gallery, /about-us, /affiliate-program, /api, /fees, /trading-fee, /help-center, /submit-request, /user-guide, /security, /privacy-policy, /cookie-policy, /terms-of-service, /stake/:pool, /pool/:pool.
- Existing market feeds and charting should stay functional; if offline, show honest errors, stale-data indicators, and source timestamps.
Before writing code, inspect file tree, package manifests, current branch and uncommitted changes. Capture baseline lint, build, backend tests and contracts tests; distinguish existing failures from introduced ones. Avoid extracting the ZIP again or resetting the repository.
2. MANDATORY REPO SEPARATION
Separate concerns physically while preserving the current application and contract history. Target structure:
CryptoArt/
  frontend/
    src/                # moved current React source, including untouched 3D scene
    public/
    index.html
    vite.config.js
    package.json
    .env.example
  backend/
    src/
      app.js
      index.js
      config/
      adapters/         # existing market adapters, preserved
      routes/
      controllers/
      models/
      services/
      middleware/
      validators/
      utils/
    tests/
    package.json
    .env.example
  contracts/            # preserve Hardhat workspace and Solidity contracts
  scripts/              # optional root-level dev coordination
  package.json          # root scripts/workspaces, not an extra app
  README.md
  .gitignore
Move existing src, public, frontend config, and React package assets into frontend/; move existing server/ content into backend/. Keep contracts/ and .git/ in the root. Fix imports, development commands, lockfiles, Vite /api proxy, CORS, backend storage paths, root scripts, Hardhat deployment output paths, deployments.json consumption, environment loading, test locations, and documentation. Do not duplicate the backend or rewrite existing adapters/contracts merely because folders move. Preserve the backend's API base path, responses, caching and error conventions for compatibility. If moving any files creates a risk, perform incremental moves with intermediate builds.

Maintain distinct environment files: frontend/.env.example contains public VITE_* URLs/chain IDs; backend/.env.example contains server secrets, DB and Cloudinary credentials; contracts/.env.example contains local/testnet deployment configuration. No sensitive credential may appear in frontend assets or be committed. Keep a root npm run dev convenience script to start frontend and backend and clear scripts for each independently. Preserve existing local Hardhat/testnet workflows.
3. FROZEN 3D SCENE — ABSOLUTE PRESERVATION
frontend/src/components/home/CurrencyCoinScene.jsx is READ-ONLY. After the folder move, keep the exact source content intact; use a before/after hash or Git diff to verify no code changes. Never regenerate or replace this component; never touch its geometry, rings, materials, textures, environment, camera, shaders, pointer/drag behavior, rotation speed, transitions, currency symbols, scene token consumption, canvas properties, or performance tuning. Do not recolor it. Do not swap it for stock 3D art.

Redesign HeroSection.jsx around the existing imported component: responsive typography and CTAs on one side, preserved coin canvas on the other. Modify only the wrapper/DOM layout, and keep the Canvas pointer input unobstructed. If an issue appears inside the scene, document it rather than quietly modifying it. Do not add additional 3D visual effects to compete with the coin.
4. COLORS ARE OWNED BY THE USER — DO NOT REDESIGN THE PALETTE
Preserve the exact existing anchor values in frontend/src/styles/theme.css (moved from src/styles/theme.css):
:root {
  --ca-base: #10151E;
  --ca-text: #E9EDF4;
  --ca-accent: #9CAFE6;
}
These are placeholders/current values, not creative permission. The owner will change them personally. Do not suggest or commit a new palette. Keep the current derived families (--ca-base-*, --ca-text-*, --ca-accent-*) and semantic tokens. Use semantic Tailwind utilities and existing token plumbing; do not introduce page-level hex/RGB literals for surfaces, typography, charts, forms, buttons, animations, or SVGs. Do not remove the existing link from tokens to the frozen 3D scene. Do not build a theme selector unless one already exists and is working.

When contrast is insufficient for a specific owner-selected palette, flag the issue without silently replacing their chosen anchors. Functional positive/negative/warning indications must remain accessible, with labels/shapes that do not depend on color alone.
5. VISUAL SYSTEM — REDESIGN EVERY ROUTE
A major redesign is required. Do not simply change border radius and spacing on existing cards. Define a consistent frontend product system that applies to all existing sections: typography, responsive grids, page titles, article widths, UI density, CTA hierarchy, tables, charts, tabs, menus, buttons, fields, confirmation dialogs, loading/empty/error states, status feedback, and footer.

Identity: modern, precise, credible, subtle, minimal, premium. Editorial hero treatment; clear functional product UI beneath. No emoji in UI text, nav, buttons, cards, metrics, placeholders, toasts, or loaders. Keep only functional, semantically needed Lucide icons (for example close, search, menu, wallet, external link, copy). Avoid fake testimonials, fabricated users/TVL/trading volume, false liquidity, nonsensical live prices, guarantee language, and claims of audited security.

Typography: use one deliberate display/body family combination or one well-selected type family with clear scale, weights, and tabular numerals for market data; optimize hierarchy and readability. Avoid tiny labels, excessive monospace marketing copy, oversize decorative headings in data-dense interfaces, and inconsistent font usage. Make WCAG-conscious focus states and legible labels.

Navigation: redesign Navbar.jsx, mobile navigation, active states, dropdown interactions, wallet entry, footer, and route transitions. Preserve existing URLs or add backward-compatible redirects. Ensure mobile keyboard accessibility and usable tap targets. The primary top-right CTA should be a working Connect / Try Demo wallet action, not a dead button.

Homepage /: redesign HeroSection.jsx, MarketSection.jsx, CorePlatformFeature.jsx, InfoSection.jsx, and footer integration. Keep the coin as hero's signature visual. Lead with a genuine value proposition; use a primary CTA Explore Markets to /market-track and a secondary CTA Browse NFTs to /nft-gallery, or justify an equally functional pairing. Below: a concise sourced market snapshot (visible source + freshness), a structured feature overview with route CTAs, a real MongoDB-backed NFT preview, and a final Try Demo Wallet CTA. No meaningless carousels, stat explosions or long icon-heavy sections.

Market /market-track: preserve the market context, existing API provider adapters, asset selection, chart timeframes and conversions. Improve price hierarchy, precision/formatting, labels, responsive layout, chart tooltips, source/time metadata, loading/retry states. Label stale/benchmark rates accurately. Never present simulated or failed API data as a real-time feed.

Swap /swap: clean trading terminal, prominent input/output selectors, quote breakdown, clear rate/fee/impact status, keyboard-friendly token modal, reverse action, and a working primary CTA. Preserve existing real-chain local/testnet logic; demo mode may simulate swap with server-side balances and a clearly labeled demonstration receipt. Never promise liquidity or display an actual execution route where none exists.

Stake /stake and /stake/:pool, /pool/:pool: clean pool comparison and details, distinguish simulated reward projections from live contract positions, show position balances/history, coherent deposit and withdrawal flows. Wire demo mode to server data. Do not fabricate APYs or omit constraints.

NFT gallery /nft-gallery: redesign card density, image treatment, filters, category chips/tabs, search, sorting, pagination, auction/fixed price labels, creator info, hover state and real CTAs. Add Create NFT, NFT Details, My Collection and Demo Activity as explicit reachable flows (new routes may be added, old routes remain valid). Good image hierarchy, visible listing state, real timestamps and clear owner/creator distinctions. Integrate DB-backed catalog instead of static nftData.js; retain the existing testnet on-chain auction path as a separate clearly labeled mode. Never assume Mongo _id equals token ID.

Other pages: redesign all About, Affiliate, API, Help, Support, Fees, Trading Fee, Security, User Guide, Terms, Privacy and Cookies pages into cohesive, readable, trustworthy layouts. Preserve factual/legal text and functionality; do not invent compliance certifications, policies or protocols.

Component architecture: extract reusable primitives only where appropriate: Button, PageHeader, SectionHeader, Input, Select, Dialog, Tabs, Status, Skeleton, Toast, EmptyState, DataTable. Audit all buttons and links for real actions. Support dark/light theme behavior only insofar as current tokens support it; owner controls actual colors. Provide responsive mobile, tablet, laptop and large desktop layouts; avoid horizontal overflow.
6. MOTION SPECIFICATION — MOTION/FRAMER + GSAP + LENIS
Use the current Motion for React package (npm install motion, import from motion/react; successor to Framer Motion) for UI state animations, nav/menu entrances, modal presence via AnimatePresence, tabs, cards, toggles and measured microinteractions. Do not create two parallel Framer/Motion versions. Use GSAP + @gsap/react + ScrollTrigger for a small number of deliberate section reveals, hero text choreography, and section transitions. Use the existing Lenis provider for smooth page scroll, integrated with ScrollTrigger and exactly one GSAP ticker registration. Inspect/clean any redundant legacy @studio-freight/lenis dependency after verifying it is not used.

Assign one animation owner per target element: Motion for React handles state/layout; GSAP handles scroll timelines; Lenis handles scrolling; CSS handles simple hover color changes. Do not put GSAP and Motion transforms on the same element. Avoid motion on dense changing data and on the protected Canvas. Respect reduced-motion preference, native scrolling in dialogs/touch, touch gestures and focus management. Use useGSAP/scoped cleanup, teardown listeners and ScrollTriggers in React StrictMode, and prevent memory leaks across route changes. Keep motion subtle and responsive: roughly 150–450 ms UI interactions, scroll reveals only when they add context. Do not use giant scroll hijacks or glowing animated decoration.
7. EXTEND THE EXISTING BACKEND WITH MONGODB + CLOUDINARY
backend/ is the relocated existing Express server. Do not replace its working market routes, market adapters, response envelopes or unit tests. Add a MongoDB/Mongoose persistence layer and authenticated Cloudinary media pipeline for a functional off-chain NFT prototype, while preserving the on-chain contracts separately.

Add backend-only environment variables:
PORT=4000
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/cryptoart_demo
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
DEMO_SESSION_SECRET=
COINGECKO_API_KEY=
Treat these as development examples, never working credentials. Supply complete .env.example, setup instructions, startup connection checks, graceful shutdown, allowed CORS origins, request validation, error codes, upload/body limits, sensible rate limiting, and protected access to mutations. Do not expose MONGODB_URI, Cloudinary API secret, or session secret in VITE_* values, browser bundles or error messages. Keep existing /api/markets, /api/forex, /api/dex, /api/newsletter, /api/support-requests, /api/nft/bids compatible; migrate file-backed content only if it improves the architecture, using an explicit migration/rollback plan.

Proposed Mongoose models (adjust to actual requirements and document):
- NFT: Mongo _id, title, description, collection/category/tags, artist/creator account, current owner account, media { publicId, secureUrl, width, height, format, bytes }, price in precise minor units / Decimal128, denomination, listing type (fixed/`auction`), listing status, created/updated timestamps; optional on-chain {chainId, contractAddress, tokenId, transactionHash} if legitimately minted. Never infer on-chain ownership from DB alone.
- DemoWallet: server-owned demo account ID, display alias, one or more simulated balances stored as integers/Decimal128, timestamps and session association; no mnemonic, private key, or public-chain custody.
- DemoTransaction: idempotencyKey, wallet references, NFT reference if relevant, type (credit, buy, sell, bid, transfer, swap, stake, unstake as implemented), amount and currency, status, timestamps and audit metadata.
- DemoPosition / DemoBid if existing stake/auction UI requires persisted positions and bid history. Use uniqueness indexes and references; avoid needless models.
Cloudinary workflow: Only a permitted authenticated creator/session may upload. Validate actual MIME/file content (not extension alone), byte size, and image dimensions; accept reasonable JPEG/PNG/WebP formats. Upload via backend Node SDK upload_stream or a backend-authorized signed direct-upload flow. Persist secure HTTPS URL and public_id in Mongo; the frontend never sees the secret. Provide progress, preview, failure and retry states. Handle partial failures and orphaned assets, authorized deletion, image optimization/delivery, alt text, graceful fallback and safe cleanup.

Required NFT endpoints (may use /api/v1 with backward-compatible aliases, but document exact final routes):
GET    /api/health
GET    /api/nfts?search=&category=&sort=&page=&limit=
GET    /api/nfts/:id
POST   /api/nfts                 create an off-chain demo NFT/listing
PATCH  /api/nfts/:id             creator/owner-authorized metadata change
DELETE /api/nfts/:id             authorized delete/unlist + safe Cloudinary cleanup
POST   /api/nfts/:id/purchase    authenticated demo purchase (atomic)
GET    /api/me/nfts              demo-owned collection
POST   /api/uploads/nft          authorized image upload, Cloudinary-backed
GET    /api/demo/wallet          current demo account/balances
POST   /api/demo/session         establish server-bound demo session
POST   /api/demo/reset           explicit sandbox reset, with confirmation
GET    /api/demo/transactions    paginated simulated ledger
If auction flow is supported, add authorized bid endpoints and validate an actual listing/auction status. Return structured, consistent JSON; do not silently convert old frontend request schemas. Validate IDs and pagination. Seed a few clearly labeled sample NFTs via an idempotent seed script with rights-cleared locally owned images, or let a creator upload them through Cloudinary; do not pass random remote photos off as actual minted tokens. After migration, use a proper API client/React Query and wire all NFT UI paths to real API responses. Static nftData.js must not remain the primary catalog source.
8. DEMO WALLET — REAL DEMONSTRATION, ZERO REAL FUNDS
A demo wallet is a backend-persisted simulation, not an Ethereum wallet, and must never be presented as actual on-chain custody. Keep existing Wagmi wallet connect flow intact for supported Hardhat/Sepolia testnets. Add a distinct first-class Try Demo Wallet option in the existing wallet modal and navigation. Do not spoof window.ethereum, inject fake 0x accounts into Wagmi, or label demo ledger entries as blockchain hashes.

Demo wallet capabilities:
1. Start demo session with a server-generated opaque ID / secure HTTP-only session cookie, appropriate CSRF/origin protections, and safe session lifetime. Use one anonymous session-bound demo account, with a clear DEMO label in every affected transaction screen.
2. Initialize a finite sample balance (example: 10,000 demo credits, not real ETH, BTC or INR) only once per session/account, from the backend. No client-side balance authority or invisible unlimited faucet. Allow explicit Reset Demo with confirmation if practical.
3. Show demo account identifier (use DEMO-..., not a valid EVM address), balances, activity, collection, and mode switch to real wallet where applicable.
4. A user can Create NFT (Cloudinary upload + Mongo metadata) and Buy an NFT using demo credits: show confirmation, verify available balance and listing availability on the backend, atomically debit buyer/credit seller or system wallet, transfer off-chain ownership, mark listing sold, and write transaction history. Duplicate submissions must not charge twice; reject concurrent double-purchases.
5. Optional demo bidding, swaps and staking must likewise have server-side checked operations and honest projected results. Do not show success without an accepted backend mutation. Unsupported features must say Demo only / not enabled, rather than pretend to transact.
6. If MongoDB multi-document transactions are used, configure a replica set (MongoDB Atlas is fine) and explain the requirement. Use optimistic checks/unique indexes/idempotency keys as needed. If transactional support is unavailable, do not silently fall back to unsafe multi-write balance updates.
7. Every demo receipt uses a demo transaction ID and explicit Simulated — No blockchain transaction copy. Keep real on-chain testnet transactions in their own clearly separated status flows.
Critical mode separation: DEMO = MongoDB off-chain ledger; TESTNET = actual transaction on configured local chain/Sepolia; UNAVAILABLE = disabled/blocked. Wallet balances, token prices and ownership must never cross these modes implicitly. Expose mode prominently in trading, stake and NFT purchase screens.
9. END-TO-END USER FLOWS THAT MUST WORK
- Landing > Explore Markets > functioning market track page with source/freshness.
- Landing > Browse NFTs > Mongo-backed catalog > filter/search > item detail.
- Navbar > Try Demo Wallet > server session > balance and transaction list.
- Demo creator > Create NFT > upload preview > backend validation > Cloudinary asset > Mongo record > visible gallery listing.
- Demo collector > NFT detail > Buy with Demo Credits > confirmation > atomic backend mutation > updated owner, buyer/seller balances and receipt > My Collection.
- Navbar > Connect Real Wallet > existing Wagmi connector > supported Hardhat/Sepolia flow, not demo account.
- Swap and staking pages > clearly labeled demo or testnet actions that work only when backend or contracts support them.
- Existing legal/support/help pages and links continue to resolve and function.
Each CTA must link to a valid route or trigger a real action; if an integration is not implemented, show the user a truthful disabled/unavailable state, not a fake success.
10. ENGINEERING QUALITY, PERFORMANCE AND SECURITY
Use React conventions already present and TanStack Query for API state; introduce Zustand only if state complexity truly warrants it. Avoid Redux migration. Keep route-level splitting, browser history fallback, robust error/loading/retry states, focus handling, semantic headings, accessible dialogs, keyboard controls, responsive images, skeletons and meaningful empty states. Preserve existing market metadata envelopes {data, source, asOf, stale}.

Protect demo mutation endpoints from unauthenticated or cross-session changes. Validate everything server-side, restrict uploads, sanitize filenames and metadata, and return safe errors. Use HTTP-only session cookies with appropriate Secure/`SameSite` settings and CORS credentials where required. Ensure no public API can delete another user's files or modify somebody else's listings. Treat Solidity contracts as unaudited testnet prototypes; no mainnet deployment, custody, real purchase promises or invented audit claims. Do not leak private keys or APIs to the frontend.

Clean React useEffect teardown, motion cleanup, GSAP ScrollTrigger context, a single Lenis driver, and WebGL Canvas interaction. Profile performance on midrange mobile; avoid expensive scroll effects and pointless network polling. Honor reduced motion, avoid WebGL overlay interaction conflicts, and do not modify the frozen CurrencyCoinScene.jsx.
11. PHASED IMPLEMENTATION (EXECUTE, DO NOT STOP AT ROADMAP)
Phase 0 — baseline: Inspect repo + older master, list routes/features, git status, snapshot protected scene hash and theme anchors; run baseline build/lint/server tests/contracts tests.

Phase 1 — separation: Move to frontend/, backend/, preserve contracts/; repair scripts/proxy/env/paths/imports and verify frontend/backend builds and tests again. Do not change behavior yet.

Phase 2 — UI foundations: Introduce/standardize typography, spacing, components, navigation, CTA patterns, empty/loading/error states, responsive layouts; leave the theme anchors untouched.

Phase 3 — all-page redesign: Rebuild layouts for homepage, market, swap, stake/pool, NFT, wallet, content, policy, and support pages. Keep the coin scene unchanged. Install/use Motion for React while integrating GSAP/Lenis without duplicate animation ownership.

Phase 4 — backend additions: Add MongoDB/Mongoose connection, models, Cloudinary upload service, secure demo session, NFT CRUD, demo ledger and endpoints; preserve market adapters and contract interfaces.

Phase 5 — frontend integration: Replace static NFT source with real queries; integrate creator upload, details, collection, buy/bid flow and demo wallet, receipts and error states; keep real Wagmi separate.

Phase 6 — verification: Run lint/build/backend/API tests/contracts tests. Add tests for permission checks, upload validation, idempotent purchases, insufficient balances, concurrent purchases, wallet reset, ownership updates, route navigation, demo/testnet mode isolation and basic accessibility. Verify actual cloud/DB services only if owner provides credentials; otherwise mark integration as configured but unverified and provide exact setup steps.

Work autonomously on normal coding decisions. Pause for credentials, real expenditures, mainnet deployment, destructive actions outside the workspace, or truly irreversible decisions. Document blockers but continue independent tasks. Do not claim features are complete without exercising them.
12. FINAL DELIVERY CONTRACT
Finish with:
1. Updated physical directory tree and preserved source/contract inventory.
2. Changed-file summary per phase, including exact location of the three user-editable colors.
3. Before/after proof that CurrencyCoinScene.jsx source is unchanged (hash/diff).
4. New and preserved API endpoints with sample requests and clear demo/testnet distinctions.
5. MongoDB/Cloudinary and demo-session setup, environment-variable templates and seed command.
6. Working commands to run frontend, backend and local Hardhat independently and together.
7. Actual lint/build/test results, test cases and unresolved issues, with no fabricated success.
8. Accurate list of functioning CTAs, wallet flows, and NFT upload/purchase demos.
START NOW: read this prompt and the repository master, inspect actual code, execute Phase 0 and then proceed to code edits. This is an implementation assignment, not a request for design commentary.