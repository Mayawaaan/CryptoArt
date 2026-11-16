const StudentPic1 = "/logo/logoMark.png"
const StudentPic2 = "/logo/logoMark.png"
const StudentPic3 = "/logo/logoMark.png"
const MentorPic = "/logo/logoMark.png"
const Pic1 = "/logo/logoMark.png"
const Pic2 = "/logo/logoMark.png"
const Pic3 = "/logo/logoShowcase.png"

const aboutData = {
  hero: {
    eyebrow: "ABOUT CRYPTOART",
    titleLine1: "From Academic Prototype",
    highlight: "to Full-Stack Digital Asset Architecture",
    headline:
      "An evolving digital-asset workspace built to make market intelligence, Web3 mechanics, and digital ownership transparent.",
    primaryParagraph:
      "CryptoArt is a multi-asset market tracking, token conversion, staking, and digital artwork platform that originated as an academic engineering submission in 2022 and was completely re-architected in 2026. Rather than hiding how financial feeds, off-chain ledgers, and smart contracts operate behind opaque abstractions, CryptoArt exposes each layer with explicit data attribution, deterministic rules, and clear separation between simulated exploration and on-chain testnet execution.",
    secondaryParagraph:
      "Across a single cohesive workspace, visitors can monitor normalized cryptocurrency spot feeds alongside central-bank foreign exchange benchmarks, test multi-asset swaps and time-locked staking vaults using persistent simulated Demo Credits, publish and collect digital artwork backed by MongoDB and Cloudinary, or connect an EVM browser wallet to interact with Solidity contracts on Hardhat Local and Sepolia.",
    description:
      "What started in 2022 as a minor college submission has transformed into a redesigned platform in 2026 — driven by engineering discipline, architectural clarity, and long-term product thinking.",
    quickFacts: [
      {
        label: "Origin & Rebuild",
        value: "2022 → 2026",
        detail: "Initiated as an academic prototype in 2022; rebuilt into a separated monorepo in 2026.",
      },
      {
        label: "Execution Modes",
        value: "Demo + EVM Testnet",
        detail: "Risk-free 10,000 Demo Credit MongoDB ledger alongside Hardhat (31337) & Sepolia (11155111) contracts.",
      },
      {
        label: "Data Providers",
        value: "4 Live Adapters",
        detail: "CoinGecko, Binance Public Data, Frankfurter ECB Reference Rates, and DEX Screener.",
      },
      {
        label: "Design System",
        value: "3 OKLab Anchors",
        detail: "Every surface, chart stroke, and 3D material derives from --ca-base, --ca-text, and --ca-accent.",
      },
    ],
  },

  chapters: [
    { number: "01", id: "about-intro", label: "Introduction" },
    { number: "02", id: "about-journey", label: "Our Journey" },
    { number: "03", id: "about-purpose", label: "Our Purpose" },
    { number: "04", id: "about-ecosystem", label: "Ecosystem" },
    { number: "05", id: "about-architecture", label: "Architecture" },
    { number: "06", id: "about-principles", label: "Principles" },
    { number: "07", id: "about-team", label: "The Team" },
    { number: "08", id: "about-next", label: "Next Chapter" },
  ],

  journey: {
    eyebrow: "SECTION 02 — OUR JOURNEY",
    title: "Four Years of Architectural Evolution",
    subtitle:
      "How a classroom assignment evolved through production engineering exposure into a modular full-stack digital asset platform.",
    milestones: [
      {
        id: "beginning",
        year: "2022",
        phase: "Academic Foundation",
        title: "2022 — The Beginning",
        alignment: "left",
        summary:
          "Built as a minor college submission under academic supervision, the earliest version of CryptoArt focused on staking simulation, dashboard visualization, and component-level frontend architecture.",
        narrative:
          "Working between lectures, lab assignments, and internal review deadlines, the three-member student team set out to visualize how decentralized finance interfaces present market movement and staking yields. While the initial build was structured and academically sound, its state lived entirely in browser memory and its scope was constrained to static UI demonstrations.",
        technicalFocus: [
          "Initial React component hierarchy and route navigation",
          "Client-side staking yield calculators and static market tables",
          "Interactive 3D currency coin exploration in Three.js",
        ],
      },
      {
        id: "presentation-shift",
        year: "2023",
        phase: "First Presentation & Real-World Shift",
        title: "2023 — The First Presentation & The Shift Begins",
        alignment: "right",
        summary:
          "Presenting the prototype in 2023 marked academic completion, but stepping into real-world software environments immediately exposed the gap between a working classroom demo and a resilient system.",
        narrative:
          "During the 2023 academic defense, the interface responded as expected and the core logic held together. Soon after, as the contributors began working on production software problems outside the classroom, their evaluation criteria changed. Hardcoded data structures, tightly coupled view logic, and unvalidated client calculations stood out as architectural shortcuts that would not survive real network latency or concurrent users.",
        technicalFocus: [
          "Audit of rigid state management and tightly coupled view components",
          "Recognition of upstream API rate limits and network failure modes",
          "Transition from feature-checklist thinking to system-boundary design",
        ],
      },
      {
        id: "year-2024",
        year: "2024",
        phase: "Engineering Maturity",
        title: "2024 — Professional Growth & Discipline",
        alignment: "left",
        summary:
          "Throughout 2024, hands-on experience with performance optimization, modular service layers, and maintainable codebases reshaped how the team viewed financial and Web3 applications.",
        narrative:
          "Rather than applying cosmetic patches to the 2022 repository, the team spent 2024 studying how reliable financial terminals handle asynchronous data normalization, caching, and state synchronization. The original project was preserved as a baseline reference—functional as a concept, but waiting for an architecture engineered for longevity.",
        technicalFocus: [
          "Separation of concerns between UI presentation, API normalization, and on-chain state",
          "Study of deterministic smart contract patterns and pull-over-push security",
          "Typography and token-driven design systems for dense numerical interfaces",
        ],
      },
      {
        id: "year-2025",
        year: "2025",
        phase: "Architectural Re-Evaluation",
        title: "2025 — The Realization & Turning Point",
        alignment: "right",
        summary:
          "Revisiting the original codebase in 2025 made the path forward unmistakable: incremental edits were insufficient, and a ground-up architectural rebuild was required.",
        narrative:
          "By 2025, the team's engineering standards had outgrown the legacy codebase. Reviewing the old files revealed scattered color literals, simulated timers masquerading as transactions, and monolithic page components. The team committed to a comprehensive redesign that would replace mock timers with real backend persistence, normalized public market feeds, and verifiable testnet smart contracts.",
        technicalFocus: [
          "Blueprint for physical separation into frontend/, backend/, and contracts/",
          "Specification of the three-anchor OKLab CSS token system",
          "Design of an off-chain MongoDB Demo Wallet alongside EVM testnet contracts",
        ],
      },
      {
        id: "rebuild-2026",
        year: "2026",
        phase: "Full-Stack Monorepo Rebuild",
        title: "2026 — Rebuilding With Intent",
        alignment: "left",
        summary:
          "In 2026, CryptoArt was rebuilt into a three-workspace architecture combining an Express 5 aggregation and persistence backend, a MongoDB and Cloudinary NFT studio, Hardhat Solidity contracts, and an editorial React 19 interface.",
        narrative:
          "The 2026 release transforms CryptoArt from a static student showcase into a working full-stack platform. Market views now consume normalized CoinGecko, Binance, Frankfurter ECB, and DEX Screener feeds with stale-while-error caching. Visitors can initialize a signed 10,000 Demo Credit session to mint, buy, and bid on NFTs or simulate swaps and staking lockups in MongoDB—or connect an EVM wallet to execute Solidity contracts on Hardhat Local and Sepolia.",
        technicalFocus: [
          "Physical monorepo separation: React 19 + Vite 7 frontend, Express 5 backend, Hardhat Solidity 0.8.28 contracts",
          "HMAC-SHA256 HTTP-only cookie demo sessions with atomic MongoDB credit accounting and Cloudinary uploads",
          "Preserved interactive 3D CurrencyCoinScene paired with GSAP ScrollTrigger, Motion, and Lenis",
        ],
      },
    ],
    reflections: [
      {
        id: "latenights",
        tag: "Origin Note · 01",
        title: "The Late Nights",
        image: Pic1,
        body:
          "The earliest version of CryptoArt was assembled between university lectures, lab submissions, and internal academic deadlines—debugging component state at midnight and refining layouts after classroom critiques.",
      },
      {
        id: "curriculum",
        tag: "Origin Note · 02",
        title: "Beyond The Curriculum",
        image: Pic2,
        body:
          "Academic coursework introduced theoretical data structures, but building CryptoArt taught practical execution: how small decisions in state ownership, API error handling, and component boundaries compound across an entire application.",
      },
      {
        id: "learning",
        tag: "Origin Note · 03",
        title: "What Four Years Taught Us",
        image: Pic3,
        body:
          "True engineering progress is not about rewriting syntax—it is about upgrading mindset. Over four years, our focus shifted from making screens look busy to making complex financial and Web3 workflows immediately understandable.",
      },
      {
        id: "system",
        tag: "Origin Note · 04",
        title: "From Feature Thinking to System Thinking",
        image: Pic1,
        body:
          "The 2026 rebuild was never about piling on disconnected widgets. It was about establishing a coherent foundation where market feeds, simulated credit ledgers, media storage, and smart contracts adhere to one unified contract.",
      },
    ],
  },

  purpose: {
    eyebrow: "SECTION 03 — OUR PURPOSE",
    title: "Designed to Demystify Digital Asset Systems",
    lead:
      "Digital asset platforms frequently force users into an uncomfortable binary: either read static documentation with no interactive depth, or connect a live wallet and risk real capital before understanding how the underlying mechanics work.",
    columns: [
      {
        id: "why-it-exists",
        index: "03.1",
        heading: "Why CryptoArt Exists",
        highlight: "Bridging the gap between passive observation and high-friction blockchain execution.",
        paragraphs: [
          "Understanding modern digital asset markets requires navigating fragmented tools. Spot prices live on one aggregator, central-bank foreign exchange benchmarks sit on institutional portals, decentralized exchange liquidity requires block-explorer literacy, and NFT marketplaces demand immediate wallet signatures and gas fees just to test a workflow.",
          "For students, developers, and curious participants, this fragmentation creates unnecessary cognitive load. Worse, many prototype applications blur the line between simulated UI state and actual blockchain settlement—leaving users unsure whether a button click mutated local memory, updated a database, or broadcast a transaction.",
          "CryptoArt exists to bring these workflows into a single, legible environment where every data source is attributed, every execution mode is explicitly labeled, and users can explore the full lifecycle of market analysis, token conversion, staking, and digital art collection without ambiguity.",
        ],
      },
      {
        id: "our-mission",
        index: "03.2",
        heading: "Our Mission",
        highlight: "Exploring accessible, honest digital-asset experiences through disciplined engineering and restrained interface design.",
        paragraphs: [
          "Our mission is to pair verifiable backend and smart-contract engineering with an editorial, high-contrast user interface that respects the reader's attention. Every numeric table uses tabular figures, every market chart reports its upstream provider and timestamp freshness, and every interactive form explains its exact settlement path before submission.",
          "By running a persistent, server-validated MongoDB Demo Wallet side-by-side with unaudited Solidity prototype contracts on Hardhat and Sepolia, CryptoArt allows anyone to experience instant NFT creation, auction bidding, token swaps, and staking lockups risk-free—while giving Web3 developers a clean reference implementation for wallet-connected contract calls.",
        ],
      },
      {
        id: "our-vision",
        index: "03.3",
        heading: "Our Vision",
        highlight: "A transparent, extensible sandbox for financial data visualization and Web3 interaction patterns.",
        paragraphs: [
          "We envision CryptoArt as a continuously evolving reference platform where financial data engineering and spatial web design meet. Rather than chasing speculative hype or pretending to be a custodial mainnet exchange, our long-term direction focuses on deeper market analytics, richer creator provenance tools, and clearer educational bridges between off-chain databases and on-chain protocols.",
          "Planned capabilities are always distinguished from operational features. As the platform grows, our commitment remains unchanged: zero fabricated metrics, zero hidden execution paths, and an unwavering focus on clarity.",
        ],
      },
    ],
  },

  ecosystem: {
    eyebrow: "SECTION 04 — EXPLORE THE CRYPTOART ECOSYSTEM",
    title: "Six Integrated Workspaces, One Cohesive State",
    description:
      "Every module in the CryptoArt repository is wired to live routes, explicit state providers, and transparent execution boundaries. Below is the complete inventory of what is operational in the platform today.",
    items: [
      {
        id: "market-tracking",
        number: "01",
        name: "Market Tracking & FX Intelligence",
        status: "Live Integration",
        statusTone: "positive",
        route: "/market-track",
        ctaLabel: "Open Market Terminal",
        secondaryRoute: "/",
        secondaryLabel: "View Homepage Snapshot",
        summary:
          "Normalized cryptocurrency spot markets paired with European Central Bank reference foreign exchange rates.",
        description:
          "The Market Track workspace aggregates live cryptocurrency pricing, 24-hour volume, market capitalization, and 7-day sparklines from CoinGecko—automatically falling back to Binance public market tickers if upstream rate limits are reached. Alongside crypto assets, it integrates Frankfurter ECB reference rates for major fiat currencies (INR, USD, EUR, GBP), explicitly labeling central-bank benchmarks so they are never confused with tradable spot books.",
        primaryUseCase:
          "Compare multi-currency asset performance across 1-day, 7-day, and 30-day historical intervals while inspecting real-time Binance public spot trade executions.",
        platformFit:
          "Acts as the pricing backbone of the entire application, feeding live reference rates into the Homepage snapshot and the Swap conversion desk.",
        metrics: [
          { label: "Crypto Providers", value: "CoinGecko + Binance Fallback" },
          { label: "Forex Benchmark", value: "Frankfurter (ECB Reference)" },
          { label: "Quote Currencies", value: "INR · USD · EUR · GBP" },
        ],
      },
      {
        id: "token-swapping",
        number: "02",
        name: "Dual-Mode Token Swap Desk",
        status: "Demo Ledger + EVM Testnet",
        statusTone: "accent",
        route: "/swap",
        ctaLabel: "Launch Swap Desk",
        secondaryRoute: "/demo-activity",
        secondaryLabel: "Inspect Demo Ledger",
        summary:
          "Convert between crypto and fiat reference units using simulated Demo Credits, or execute constant-product AMM swaps on-chain.",
        description:
          "The Swap workspace operates in two strictly separated modes. In Demo Credits Mode, users quote conversions across supported crypto and fiat reference assets using live market feeds and settle the conversion record in MongoDB for a 1 Demo Credit simulation fee—complete with idempotency keys and a generated DEMO-TX receipt. In On-Chain Pool Mode, users connect an EVM wallet on Hardhat or Sepolia to swap ETH and test CART tokens directly against the CryptoArtSwapPool smart contract with a 0.30% LP fee and 0.50% slippage protection.",
        primaryUseCase:
          "Test multi-asset conversion quotes and slippage mechanics off-chain, or verify ERC-20 allowance approvals and constant-product AMM reserve math on an EVM testnet.",
        platformFit:
          "Connects the live pricing engine from Market Track with both the MongoDB Demo Wallet ledger and the Solidity SwapPool deployment.",
        metrics: [
          { label: "Off-Chain Mode", value: "MongoDB Ledger (1 CR Fee)" },
          { label: "On-Chain Contract", value: "CryptoArtSwapPool (ETH ↔ CART)" },
          { label: "Pool Formula", value: "Constant-Product AMM (0.30% Fee)" },
        ],
      },
      {
        id: "staking-vaults",
        number: "03",
        name: "Deterministic Staking Vaults",
        status: "Demo Vaults + Solidity Contract",
        statusTone: "accent",
        route: "/stake",
        ctaLabel: "Explore Staking Pools",
        secondaryRoute: "/pool/btc-staking-pool",
        secondaryLabel: "View Pool Specifications",
        summary:
          "Allocate Demo Credits or testnet CART tokens into flexible and time-locked yield schedules.",
        description:
          "CryptoArt configures four reference vault schedules—BTC Staking Pool (30-day lock, 8.45% APR), ETH 2.0 Validator (flexible, 12.2% APR), CORE Native Pool (90-day lock, 24.5% APR), and Stable Liquidity (flexible, 5.2% APR). In Demo Vault mode, staking deducts integer Demo Credits from the user's MongoDB wallet, records an active position, and calculates accrued simulated rewards upon unstaking. In On-Chain mode, positions interact directly with the CryptoArtStaking contract to stake CART, claim rewards, or unstake principal.",
        primaryUseCase:
          "Evaluate how lockup durations and target APR schedules affect position liquidity, and compare off-chain position accounting against Solidity reward-per-second accrual.",
        platformFit:
          "Shares the unified Demo Wallet balance and transaction history while exposing dedicated per-pool specification and execution routes (/stake/:pool and /pool/:pool).",
        metrics: [
          { label: "Configured Pools", value: "4 Reference Vaults (5.2%–24.5% APR)" },
          { label: "Lock Schedules", value: "Flexible, 30 Days, 90 Days" },
          { label: "On-Chain Contract", value: "CryptoArtStaking (Test CART)" },
        ],
      },
      {
        id: "dex-liquidity",
        number: "04",
        name: "Live DEX Liquidity & Reserve Context",
        status: "Live Integration",
        statusTone: "positive",
        route: "/swap",
        ctaLabel: "Inspect DEX Liquidity",
        secondaryRoute: "/api",
        secondaryLabel: "View API Documentation",
        summary:
          "Real-time decentralized exchange pair liquidity via DEX Screener alongside on-chain AMM reserve telemetry.",
        description:
          "Integrated directly into the Swap & Liquidity workspace and exposed via GET /api/dex/pairs, the liquidity module queries DEX Screener for active on-chain trading pairs matching the selected cryptocurrency. It surfaces the underlying DEX protocol identifier, chain ID, base/quote symbols, and USD liquidity depth—while the On-Chain Pool tab reads live ethReserve and tokenReserve balances directly from CryptoArtSwapPool.",
        primaryUseCase:
          "Verify external decentralized market depth and compare real-world DEX pair liquidity against local testnet AMM pool reserves.",
        platformFit:
          "Provides real market structure context beside the Swap terminal so users understand how liquidity depth governs price impact.",
        metrics: [
          { label: "External Feed", value: "DEX Screener Public API" },
          { label: "Telemetry", value: "Chain ID, DEX Protocol, USD Liquidity" },
          { label: "Server Cache", value: "60s TTL + Stale Fallback" },
        ],
      },
      {
        id: "nft-marketplace",
        number: "05",
        name: "NFT Marketplace & Creator Studio",
        status: "MongoDB + Cloudinary + Testnet",
        statusTone: "accent",
        route: "/nft-gallery",
        ctaLabel: "Browse NFT Catalog",
        secondaryRoute: "/nft-gallery/create",
        secondaryLabel: "Open Creator Studio",
        summary:
          "Full-lifecycle digital artwork creation, Cloudinary media storage, fixed-price collecting, and auction bidding.",
        description:
          "The NFT Marketplace combines an off-chain MongoDB catalog with a creator upload pipeline and an optional on-chain Solidity auction tab. Creators upload PNG, JPEG, or WebP files (validated up to 5 MB via magic-byte header inspection) to Cloudinary and publish fixed-price or 7-day auction listings. Collectors can filter by category, sort by price or recency, execute atomic fixed-price purchases in Demo Credits, or place competitive bids that automatically refund outbid participants. A separate Testnet Auctions tab connects to CryptoArtNFTMarketplace for ETH bidding and pull-based outbid withdrawals.",
        primaryUseCase:
          "Experience end-to-end NFT minting, media validation, ownership transfer, and auction escrow using Demo Credits—or test Solidity ERC-721 auction settlement on-chain.",
        platformFit:
          "Links the Homepage showcase, the Creator Studio (/nft-gallery/create), item detail pages (/nft-gallery/:id), and the collector's personal portfolio (/collection).",
        metrics: [
          { label: "Media Pipeline", value: "Cloudinary + Magic-Byte Validator" },
          { label: "Catalog Storage", value: "MongoDB Atomic Ownership Transfer" },
          { label: "On-Chain Tab", value: "CryptoArtNFTMarketplace (Lots #1–#3)" },
        ],
      },
      {
        id: "wallet-connectivity",
        number: "06",
        name: "Dual Wallet & Simulated Credit Architecture",
        status: "Active Across All Routes",
        statusTone: "positive",
        route: "/demo-activity",
        ctaLabel: "View Demo Activity Ledger",
        secondaryRoute: "/collection",
        secondaryLabel: "Open My Collection",
        summary:
          "Instant 10,000 Demo Credit browser sessions paired with Wagmi v3 EVM wallet connectivity and a test CART faucet.",
        description:
          "Accessible from the global navigation bar on every page, the Wallet & Execution Mode dialog lets users operate in two distinct environments. Starting a Demo Session issues an HTTP-only HMAC-SHA256 signed cookie (ca_demo_session) backed by a MongoDB DemoWallet initialized with 10,000.00 simulated credits—allowing immediate interaction with swaps, staking, and NFTs with one-click balance resets. Switching to the EVM Testnet tab connects injected wallets (MetaMask, Rabby, Coinbase Wallet) via Wagmi and Viem, validates chain IDs (31337 or 11155111), and provides a faucet button to mint 1,000 test CART tokens.",
        primaryUseCase:
          "Onboard immediately with zero wallet setup or gas costs via Demo Credits, then switch to an EVM testnet wallet when ready to sign real blockchain transactions.",
        platformFit:
          "Serves as the identity and balance layer across Swap, Staking, NFT Gallery, Creator Studio, My Collection, and Demo Activity.",
        metrics: [
          { label: "Demo Allocation", value: "10,000.00 Simulated Credits (Resettable)" },
          { label: "Session Security", value: "HMAC-SHA256 HTTP-Only Cookie + CSRF Guard" },
          { label: "EVM Networks", value: "Hardhat (31337) & Sepolia (11155111)" },
        ],
      },
    ],
  },

  architecture: {
    eyebrow: "SECTION 05 — BEHIND THE PLATFORM",
    title: "Layered Full-Stack & Web3 Architecture",
    description:
      "CryptoArt is organized as a physically separated three-package repository (frontend/, backend/, and contracts/). Each layer has a single, well-defined responsibility so that market aggregation, off-chain simulation, media storage, and smart-contract execution never bleed into one another.",
    layers: [
      {
        id: "layer-frontend",
        code: "LAYER 01",
        name: "Client Interface & Three-Anchor Token System",
        directory: "frontend/src/",
        stack: ["React 19", "Vite 7", "Tailwind CSS v4", "React Router 7", "TanStack Query", "Recharts"],
        summary:
          "Component-driven SPA with lazy-loaded route bundles, tabular financial typography, and a strict OKLab color derivation engine.",
        responsibilities: [
          "Derives every background, surface, border, status badge, chart stroke, and 3D material from three CSS custom properties (--ca-base, --ca-text, --ca-accent) via color-mix(in oklab, ...).",
          "Manages server-state synchronization and cache invalidation for Demo Wallet balances, NFT catalogs, and ledger history through TanStack Query.",
          "Enforces accessible modal dialogs, keyboard navigation, and responsive layouts from 390px mobile viewports to widescreen terminals.",
        ],
      },
      {
        id: "layer-spatial-motion",
        code: "LAYER 02",
        name: "3D WebGL Scene & Motion Choreography",
        directory: "frontend/src/components/home/ & context/",
        stack: ["Three.js", "React Three Fiber", "Drei", "GSAP + ScrollTrigger", "Motion for React", "Lenis"],
        summary:
          "Hardware-accelerated 3D currency sculpture paired with disciplined, reduced-motion-aware scroll and layout transitions.",
        responsibilities: [
          "Renders the interactive CurrencyCoinScene in React Three Fiber with procedural radial brushing, metallic clearcoat materials, dynamic rim lighting, and pointer-driven orbital inertia.",
          "Synchronizes a single Lenis smooth-scroll instance with GSAP's ticker and ScrollTrigger.update so scroll-driven timelines remain frame-accurate without transform conflicts.",
          "Uses Motion for React for discrete UI state transitions (modal dialogs, segmented tab pills, accordion drawers) while respecting prefers-reduced-motion.",
        ],
      },
      {
        id: "layer-backend-api",
        code: "LAYER 03",
        name: "Express 5 Aggregation, Security & Validation Gateway",
        directory: "backend/src/",
        stack: ["Node.js", "Express 5", "Helmet", "express-rate-limit", "Multer", "cookie-parser"],
        summary:
          "Normalized REST API enforcing request deduplication, TTL caching, HMAC session authentication, CSRF origin checks, and binary file inspection.",
        responsibilities: [
          "Wraps all read endpoints in a uniform JSON envelope ({ data, source, asOf, stale }) backed by an in-memory cache with inflight promise deduplication and stale-while-error fallback.",
          "Issues and verifies HMAC-SHA256 signed HTTP-only cookies (ca_demo_session) and blocks cross-origin state mutations via strict Origin/Referer validation.",
          "Validates uploaded NFT artwork in memory using magic-byte header signatures and pixel dimension parsing (PNG, JPEG, WebP <= 5 MB) before streaming to cloud storage.",
        ],
      },
      {
        id: "layer-persistence-providers",
        code: "LAYER 04",
        name: "MongoDB Persistence, Cloudinary Media & Market Adapters",
        directory: "backend/src/models/, services/, providers/",
        stack: ["MongoDB + Mongoose 9", "Cloudinary SDK v2", "CoinGecko API", "Binance Data API", "Frankfurter ECB", "DEX Screener"],
        summary:
          "Durable off-chain document store for Demo Credits and NFTs alongside resilient external market-data adapters.",
        responsibilities: [
          "Persists five Mongoose models (NFT, DemoWallet, DemoTransaction, DemoPosition, DemoBid) using atomic conditional findOneAndUpdate operations ($inc with balance guards) that prevent concurrent double-spending even on standalone MongoDB nodes.",
          "Streams verified creator artwork to Cloudinary and automatically cleans up orphaned Cloudinary assets when an unreferenced listing is deleted.",
          "Normalizes live crypto spot data (CoinGecko with automatic Binance fallback), historical candle/chart series, ECB foreign exchange reference rates, and DEX pair liquidity.",
        ],
      },
      {
        id: "layer-web3-contracts",
        code: "LAYER 05",
        name: "Solidity Smart Contracts & EVM Testnet Integration",
        directory: "contracts/ & frontend/src/web3/",
        stack: ["Solidity 0.8.28", "Hardhat", "OpenZeppelin v5", "Wagmi v3", "Viem v2"],
        summary:
          "Unaudited prototype smart contracts for local Hardhat (31337) and Sepolia (11155111) execution, isolated from mainnet funds.",
        responsibilities: [
          "CryptoArtToken (ERC-20 CART): Implements an owner-controlled mint and a public testnet faucet (1,000 CART per claim with cooldown protection).",
          "CryptoArtSwapPool & CryptoArtStaking: Implement a constant-product ETH <-> CART automated market maker and multi-pool staking vaults with ReentrancyGuard and SafeERC20.",
          "CryptoArtNFTMarketplace: Implements ERC-721 custodial auctions with pull-based outbid ETH refunds (pendingReturns) so a reverting receiver can never block auction progress.",
        ],
      },
    ],
    dataFlows: [
      {
        title: "Market Intelligence Pipeline",
        path: "Client (MarketTrack / Home) → GET /api/markets → MemoryCache (Inflight Dedup) → CoinGecko / Binance / Frankfurter → Normalized { data, source, asOf, stale } Envelope",
      },
      {
        title: "Simulated Demo & NFT Pipeline",
        path: "Client (Credentials Include + Origin Header) → HMAC Cookie Auth & CSRF Guard → Multer + Magic-Byte Validator → Cloudinary Upload & MongoDB Atomic Update → DEMO-TX Receipt",
      },
      {
        title: "EVM Testnet Contract Pipeline",
        path: "Client (Wagmi / Viem) → Chain ID Guard (31337 | 11155111) → publicClient.simulateContract → Wallet Signature (writeContractAsync) → Block Receipt Confirmation",
      },
    ],
  },

  principles: {
    eyebrow: "SECTION 06 — PRINCIPLES THAT GUIDE US",
    title: "Four Engineering & Design Commitments",
    description:
      "Every architectural decision in CryptoArt is evaluated against four non-negotiable standards. These principles govern how we write backend services, design smart contracts, and lay out financial data on screen.",
    items: [
      {
        number: "01",
        title: "Clarity Over Complexity",
        thesis: "Financial and Web3 interfaces should reduce cognitive friction, not amplify it.",
        body:
          "Digital asset applications often mistake visual noise—neon gradients, flashing tickers, and crowded toolbars—for sophistication. We take the opposite approach. Complex market series, conversion quotes, and contract states are presented through generous negative space, crisp typographic hierarchy, and aligned tabular numerals. When a user inspects a price chart, a staking APR schedule, or an NFT bid table, the structure of the layout makes the underlying relationship self-evident without requiring a manual.",
        practice: "Manifested in our three-anchor OKLab token system, restrained motion rules, and tabular-nums financial formatting across all 23 routes.",
      },
      {
        number: "02",
        title: "Thoughtful Engineering",
        thesis: "Maintainable boundaries, defensive validation, and purposeful technology choices.",
        body:
          "Every dependency and architectural boundary in CryptoArt exists to solve a concrete problem. Frontend presentation, Express API normalization, and Solidity smart contracts live in physically separated packages with independent configurations and automated test suites. On the server, upstream market requests are deduplicated in flight and cached by volatility tier, uploaded images are verified by binary magic bytes rather than trusting file extensions, and database balance mutations use atomic conditional updates to prevent race conditions.",
        practice: "Manifested in 11 automated backend integration and concurrency tests, 4 Solidity contract test suites, and zero-warning ESLint enforcement.",
      },
      {
        number: "03",
        title: "Transparency by Design",
        thesis: "Never blur the line between live data, off-chain simulation, and blockchain execution.",
        body:
          "Trust in a technical product comes from honesty about what the system is doing at every moment. CryptoArt explicitly attributes every market figure to its upstream source (CoinGecko, Binance, Frankfurter ECB, or DEX Screener) and surfaces a visible badge whenever cached fallback data is served. Likewise, simulated actions using MongoDB Demo Credits carry explicit 'Simulated — No blockchain transaction' disclosures and DEMO-TX identifiers, while EVM contract actions verify network support and simulate transactions before requesting a wallet signature.",
        practice: "Manifested in normalized API response envelopes, explicit Stale/Live badges, and dual-tab Demo vs. Testnet switches across Swap, Staking, and NFTs.",
      },
      {
        number: "04",
        title: "Continuous Exploration",
        thesis: "A living engineering laboratory that evolves through research, critique, and iteration.",
        body:
          "CryptoArt's journey from a 2022 college prototype to its 2026 full-stack architecture reflects a willingness to question our own assumptions and rebuild when standards advance. We treat the platform as an active environment for exploring spatial 3D web graphics, resilient data-fetching patterns, and safe onboarding flows for decentralized protocols. Each iteration refines what works, removes what is redundant, and documents what remains on the horizon.",
        practice: "Manifested in the preservation and refinement of our signature 3D CurrencyCoinScene alongside a modernized full-stack monorepo.",
      },
    ],
  },

  sections: [
    {
      id: "beginning",
      type: "left-year",
      year: "2022",
      title: "2022 — The Beginning",
      content1:
        "Built as a minor project under academic supervision, the first version focused on staking simulation, dashboard visualization, and frontend architecture.",
      content2:
        "It was structured, academically strong, and technically sound — but limited in scope.",
    },
    {
      id: "presentation",
      type: "right-year",
      year: "2023",
      title: "The First Presentation",
      content1:
        "Presenting it in 2023 felt like completion. But deep down, we knew it was only a prototype.",
      content2:
        "The logic worked. The UI responded. Yet it lacked real-world depth and scalability.",
    },
    {
      id: "year-2023",
      type: "left-year",
      year: "2023",
      title: "The Shift Begins",
      content1:
        "In 2023, we stepped beyond academics and began working on real-world problems. Exposure to production environments changed how we evaluated our own system.",
      content2:
        "We started noticing architectural shortcuts, rigid state management, and areas where scalability was limited.",
    },
    {
      id: "year-2024",
      type: "right-year",
      year: "2024",
      title: "Professional Growth",
      content1:
        "In 2024, our technical maturity improved significantly. We understood performance optimization, system modularity, and maintainable code structures.",
      content2:
        "The original project began to feel like a prototype — functional, but not engineered for longevity.",
    },
    {
      id: "year-2025",
      type: "left-year",
      year: "2025",
      title: "The Realization",
      content1:
        "By 2025, revisiting the original codebase felt unfamiliar. Our standards had evolved.",
      content2:
        "We recognized inefficiencies in UI structure, data flow, and scalability — and knew a redesign was inevitable.",
    },
    {
      id: "rebuild",
      type: "right-year",
      year: "2026",
      title: "Rebuilding With Intent",
      content1: "In 2026, we didn't update the system. We rebuilt it entirely.",
      content2: "From student mindset → to product thinking.",
    },
    {
      id: "redesign",
      type: "grid",
      title: "2026 — The Redesign",
      grid: [
        {
          heading: "Architecture",
          text: "Modular components, scalable structure, performance-driven rendering.",
        },
        {
          heading: "Experience",
          text: "Clean UI, interaction refinement, user-centered design principles.",
        },
        {
          heading: "Vision",
          text: "Built not for grades — but for long-term sustainability.",
        },
      ],
    },
  ],

  team: {
    eyebrow: "SECTION 07 — THE PEOPLE BEHIND CRYPTOART",
    title: "Three Engineers. One Academic Mentor.",
    subtitle:
      "CryptoArt was conceived, engineered, and rebuilt by three collaborating developers who carried an academic prototype forward into a full-stack architecture, guided during its foundational phase by their faculty supervisor.",
    students: [
      {
        index: "01",
        image: StudentPic1,
        name: "Arpit Nigam",
        role: "Project Lead & System Architect",
        focusAreas: [
          "System Architecture",
          "Modular Component Design",
          "Cross-Module State Integration",
        ],
        socials: {
          instagram: "https://instagram.com/yourusername",
          linkedin: "https://linkedin.com/in/yourusername",
        },
        description:
          "Led overall architecture planning, implemented core platform components, and established the modular design boundaries that guided CryptoArt from its initial 2022 structure through the 2026 full-stack rebuild.",
        extendedBio:
          "Focused on defining clean contracts between application modules, coordinating route-level state flows, and ensuring that market tracking, staking workflows, and wallet connectivity operate as one cohesive system.",
      },
      {
        index: "02",
        image: StudentPic2,
        name: "Ayan Magardey",
        role: "3D Frontend Developer & UI Architect",
        focusAreas: [
          "Three.js / React Three Fiber",
          "Design System & Typography",
          "Motion & Interaction Flows",
        ],
        socials: {
          github: "https://github.com/Mayawaaan",
          portfolio: "https://ayanmagardey.in",
        },
        description:
          "Engineered the interactive 3D currency showcase, built the reusable UI primitive library, refined user interaction flows, and led the 2026 visual redesign with a focus on typographic hierarchy, restraint, and scalability.",
        extendedBio:
          "Architected the three-anchor OKLab token cascade (--ca-base, --ca-text, --ca-accent) and integrated GSAP ScrollTrigger, Motion for React, and Lenis smooth scrolling around the WebGL CurrencyCoinScene.",
      },
      {
        index: "03",
        image: StudentPic3,
        name: "Samkit Jain",
        role: "Backend & Logic Developer",
        focusAreas: [
          "Express API & Data Modeling",
          "Market Feed Normalization",
          "Persistence & Business Logic",
        ],
        socials: {
          instagram: "https://instagram.com/yourusername",
          linkedin: "https://linkedin.com/in/yourusername",
        },
        description:
          "Designed the backend business logic structure, database schemas, and system-level functional integrations—ensuring the API layer supports resilient market aggregation, atomic demo credit accounting, and future analytics expansion.",
        extendedBio:
          "Structured the server-side validation pipelines, rate-limit-aware caching, and deterministic transaction recording that power CryptoArt's off-chain Demo Wallet and NFT catalog.",
      },
    ],

    mentor: {
      index: "ADVISOR",
      image: MentorPic,
      name: "Prof. Swapnil Waghela",
      role: "Academic Supervisor & Guide",
      focusAreas: [
        "Foundational Architecture Review",
        "Academic Validation",
        "Early-Stage Strategic Guidance",
      ],
      socials: {
        linkedin: "https://linkedin.com/in/yourusername",
      },
      description:
        "Provided architectural direction, academic validation, and critical feedback during the 2022–2023 foundation phase of CryptoArt. While his mentorship anchored the project's academic beginnings, the 2026 full-stack redesign was driven by the engineering team's subsequent industry growth and vision for a sustainable digital product.",
    },
  },

  nextChapter: {
    eyebrow: "SECTION 08 — THE NEXT CHAPTER",
    title: "Version One of a Continuing Architecture",
    lead:
      "The 2026 rebuild marks a structural foundation rather than a finish line. Below is how we distinguish the capabilities operational in the workspace today from the engineering tracks we are actively exploring next.",
    tracks: [
      {
        id: "track-ux",
        number: "01",
        domain: "User Experience & Interface Precision",
        operationalToday:
          "Responsive 23-route workspace governed by three OKLab CSS anchors, keyboard-accessible dialogs, tabular numeric alignment, and reduced-motion-safe GSAP + Motion + Lenis choreography.",
        plannedDirection:
          "Customizable multi-panel workspace layouts, keyboard command palette for rapid asset and route switching, and persistent user-saved theme presets built on top of the three-anchor token engine.",
      },
      {
        id: "track-nft",
        number: "02",
        domain: "NFT Marketplace & Creator Provenance",
        operationalToday:
          "Cloudinary image uploads with server-side magic-byte validation, MongoDB catalog filtering and pagination, atomic Demo Credit fixed-price purchases, competitive bidding with automatic outbid refunds, and seeded testnet ETH auctions.",
        plannedDirection:
          "Multi-edition collection drops, creator royalty split simulations in the Demo Ledger, richer on-chain metadata pinning (IPFS/Arweave adapters), and automated auction settlement workers.",
      },
      {
        id: "track-market",
        number: "03",
        domain: "Market-Data Integrations & Analytics",
        operationalToday:
          "Normalized REST adapters for CoinGecko, Binance Public Data, Frankfurter ECB reference rates, and DEX Screener pairs with inflight request deduplication and stale-while-error caching.",
        plannedDirection:
          "WebSocket streaming for live order-book depth, multi-asset correlation overlays in Recharts, and historical volatility comparison tools across crypto and fiat reference benchmarks.",
      },
      {
        id: "track-wallet",
        number: "04",
        domain: "Demo Wallet & Educational Onboarding",
        operationalToday:
          "Zero-setup HTTP-only HMAC-signed Demo Wallet funded with 10,000.00 simulated credits, full chronological transaction ledger (/demo-activity), idempotent mutation guards, and instant balance resets.",
        plannedDirection:
          "Guided interactive walkthroughs that annotate each step of a swap, stake, or auction bid—comparing off-chain database mutations against equivalent EVM gas and calldata costs.",
      },
      {
        id: "track-web3",
        number: "05",
        domain: "Web3 & Smart Contract Architecture",
        operationalToday:
          "Solidity 0.8.28 prototype contracts (CryptoArtToken, CryptoArtSwapPool, CryptoArtStaking, CryptoArtNFTMarketplace) verified by Hardhat tests and wired via Wagmi v3 and Viem v2 for Hardhat Local and Sepolia.",
        plannedDirection:
          "Account-abstraction (ERC-4337) session key experiments on testnet, on-chain governance proposal simulations for CART stakers, and formal static-analysis verification pipelines.",
      },
      {
        id: "track-reliability",
        number: "06",
        domain: "Platform Performance & Reliability",
        operationalToday:
          "Vendor-chunked Vite production builds, route-level React.lazy code splitting, Express rate limiting, strict Origin/Referer CSRF enforcement, and standalone-safe atomic MongoDB queries.",
        plannedDirection:
          "Distributed Redis cache adapter for multi-instance backend deployments, automated end-to-end visual regression suites, and OpenTelemetry request tracing across upstream market providers.",
      },
    ],
    cta: {
      eyebrow: "START EXPLORING",
      headline: "Experience the Platform Firsthand",
      description:
        "Inspect live multi-currency market feeds, initialize a 10,000 Demo Credit session in one click, or browse digital artwork in the marketplace—no wallet extension or real funds required to begin.",
      primary: {
        label: "Explore CryptoArt",
        to: "/market-track",
      },
      secondary: {
        label: "Discover the Marketplace",
        to: "/nft-gallery",
      },
      quickLinks: [
        { label: "Open Swap Desk", to: "/swap" },
        { label: "Inspect Staking Vaults", to: "/stake" },
        { label: "Create Demo NFT", to: "/nft-gallery/create" },
        { label: "Read API Reference", to: "/api" },
      ],
    },
  },
}

export default aboutData
