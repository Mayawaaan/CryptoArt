CRYPTOART — MASTER ENGINEERING & DESIGN PROMPT
You are the principal frontend engineer, Web3 engineer, Solidity developer, backend architect, and design-system specialist responsible for upgrading an existing application called CryptoArt.
0. Source of truth
I will supply the existing project as a ZIP archive. First extract and inspect the entire archive. The codebase, assets, package manifests, routes, feature modules, UI, 3D scenes, state management, existing APIs, and any Solidity contracts are your source of truth. Do not pretend to have inspected files you have not opened. Do not invent features, file paths, existing APIs, or deployed contract addresses.

The aim is to turn this functional prototype into a cohesive, modern, realistic, professional Web3 application. Preserve its product identity, existing features, route structure where reasonable, state flows, useful animations, and 3D work. Refactor incrementally; do not replace the app with a generic crypto dashboard or a fresh starter template.

The existing project may contain modules for market tracking, crypto/forex, token swap, staking, liquidity, NFT marketplace, and 3D visualizations. Verify each against the ZIP; do not assume they are all implemented or working.
1. Mandatory audit before changing code
Read package.json, lockfiles, build configuration, route setup, component tree, stores, data services, environment files (without exposing secrets), public assets, styles, shader files, and smart-contract files. Produce concise findings:
1. Actual frameworks, versions, dependencies, and folder structure.
2. All existing routes/features and whether each is operational, partial, hard-coded, or broken.
3. Data flow and state-management map, including current API usage and CORS/refresh problems.
4. 3D assets, React Three Fiber/Three.js/GLSL interactions, performance constraints, and visual dependencies.
5. Existing smart contracts, supported networks, wallet support, and security gaps.
6. A priority-ordered implementation plan with clear dependencies.
Then implement the plan, not merely describe it. If the environment allows direct file editing, modify the actual files. Preserve the app's current language (JavaScript or TypeScript) unless migration is clearly justified and low-risk. Avoid redundant dependencies.
2. Design direction — quiet, deliberate, premium
Make the app polished, subtle, credible, and suitable for a modern Web3 financial product, without making it visually loud. Maintain a disciplined hierarchy, consistent spacing, alignment, table density, typography, input states, and data presentation. Avoid gratuitous icons, emojis, neon glows, loud gradients, oversaturated colors, decorative glassmorphism, excess shadows, and animation that obstructs functionality. Use icons only where they clearly help comprehension or interaction. Prefer text, numbers, and clean geometry over decoration.

Do not invent new product sections or propose a series of unrelated redesign concepts. Improve the UI that actually exists. Do not destroy distinctive existing 3D elements: refine their materials, lighting, motion, color integration, accessibility, and performance as needed.
3. Strict three-anchor design system
The entire website must be themable through exactly three user-editable anchor colors, in this order:
:root {
  --ca-base: #10151E;    /* dominant page and surface family */
  --ca-text: #E9EDF4;    /* all readable foreground family */
  --ca-accent: #9CAFE6;  /* interactions, selection, emphasis */
}
I must be able to change ONLY these three values in one centralized file (for example src/styles/theme.css or a single theme config; adapt the path to the actual repo) and have the WHOLE site update automatically, including navigation, buttons, forms, cards, charts, tooltips, overlays, borders, loading states, 3D materials, shader uniforms, particles, and any other feature with a color.

Create derived families from these anchors: base-50 through base-950, text-50 through text-950, and accent-50 through accent-950. Compute shades/tints/transparency systematically using CSS color-mix(in oklch, ...) or a well-tested equivalent, rather than placing additional free-floating hex colors throughout the codebase. Establish semantic aliases such as background, surface, surface-raised, border, text-primary, text-secondary, text-muted, interactive, interactive-hover, interactive-active, focus-ring, and chart-series. The semantic aliases MUST reference the three color families.

Define palette usage: BASE dominates full-page background, surfaces and dividers; TEXT is used for body content, figures, headings and subordinate labels; ACCENT is reserved for selected states, primary actions, focus, active links and meaningful data emphasis. Derived contrasts must be legible; maintain WCAG AA contrast where feasible. For positive/negative financial changes, also use explicit +/- signs, labels and/or direction markers: never rely solely on hue. For any unavoidable extra semantic warning color, document the exception rather than quietly introducing a fourth theme variable.

No inline hex values, arbitrary Tailwind color utilities, unrelated CSS color literals, or independent shader color constants outside the central token system. If Tailwind is already present, map its custom theme utilities onto the same token source. If light/dark mode already exists, preserve it using three anchors per active mode, with the same semantic aliases. Do not add a theme switch solely for decoration.

The existing 3D elements must subscribe to the theme tokens reactively. Use a controlled mechanism for passing token colors to Three.js materials, environment accents, particles, postprocessing and GLSL uniforms. Avoid imperative DOM color sampling on every render frame. Limit bloom to intentional highlights; design must also look credible without postprocessing.
4. Engineering boundaries and architecture
Solidity is not a replacement for HTTP APIs. Separate concerns correctly:
- Frontend: current React app and its existing router/store/3D stack, improved and preserved.
- Backend: Node.js API service (use the codebase's conventions; Express/Fastify and TS/JS only as appropriate) for market-data aggregation, caching, server-side API keys, normalized responses, error handling, optional lightweight persistence, and read-only indexing of blockchain events.
- On-chain: Solidity contracts only when a feature genuinely needs trustless state or transactions. Use a supported EVM testnet or local Hardhat chain as the default; never assume mainnet deployment.
- Wallet and contract integration: Wagmi + Viem where compatible with the existing stack; perform user-authorized writes from the wallet, never by collecting seed phrases or private keys.
Keep frontend, API layer, chain adapters, ABIs, and shared types/contracts clearly separated. Avoid introducing a database for data that can be read or cached without persistence. If persistent preferences, watchlists, user records, or off-chain NFT listing metadata require storage, choose the smallest suitable option and document it; reuse an existing database if present.
5. Market and external data APIs
Audit existing sources first. Replace fake tickers and static price arrays with real upstream data when an API supports the required data. Use an adapter interface and centralize retry/backoff, cache TTL, normalization, timestamps, source attribution, and error codes.

Research current terms, coverage and quota before coding. Candidate sources:
- CoinGecko Demo API: general crypto market data, market cap, historical series and price snapshots. Official reference: https://www.coingecko.com/en/api/pricing. A free account/key may be required; use a server-side environment variable.
- Binance public market data: exchange tickers, candlesticks and public WebSocket streams, subject to geographic availability. Docs: https://developers.binance.me/en/docs/products/spot/faqs/market_data_only.
- DEX Screener: DEX pair/token trading and liquidity data, with documented endpoint-specific rate limits. Docs: https://docs.dexscreener.com/api/reference.
- Frankfurter: free FX reference rates and historical series; NOT live tradable forex quotes. Docs: https://frankfurter.dev/.
- DefiLlama: consider only currently free endpoints verified against official documentation. IMPORTANT: its legacy free yield endpoints /pools and /chart/{pool} were discontinued on 13 November 2026, so DO NOT build a free staking-yield integration that depends on them. Docs: https://api-docs.defillama.com/.
Treat each provider as optional until tested. Do not claim that an API supports a field, interval, region, currency, or history depth without verifying it. Normalize data into one contract so UI components do not know provider response formats. Supply fallback states: loading, stale-with-timestamp, temporarily unavailable, and error; do not fabricate moving prices or random percentage changes to appear live. If the app has a prototype/demo mode, mark synthetic values conspicuously as DEMO and keep them separate from live data. Respect rate limits and attribution rules.

For INR, USD, EUR, GBP, CNY and other displayed currencies, use exact available price or conversion source, document quote provenance, and do not mix fiat FX reference rates with executable crypto/forex trade prices.
6. Feature-by-feature implementation
Build an implementation matrix from the actual archive. For each existing feature:
1. Preserve intended behavior and current route.
2. Identify data inputs, calculations, API dependencies, wallet dependencies, and missing backend endpoints.
3. Wire a real read API wherever supported.
4. For state-changing blockchain actions, either implement a tested, transparent testnet transaction flow or clearly label the feature as a non-executing prototype. Do not represent a simulated swap, staking reward, liquidity deposit, NFT purchase, or price quote as a confirmed on-chain operation.
5. Provide actionable loading, empty, invalid-input, disconnected-wallet, wrong-network, rejected-transaction, pending, confirmed, reverted, and provider-outage states where applicable.
For swap, staking, liquidity, and NFT functionality only if they exist in the archive, map the UI to the underlying protocol/contract requirements rather than assuming a market-data API can execute trades. If no audited protocol/contract integration exists, default to a clearly disclosed demo/testnet path. Do not build an unaudited real-money DEX, custody service, or financial return mechanism.

For NFTs, if appropriate to existing features, prefer established OpenZeppelin ERC-721/ERC-1155 components and metadata conventions. For transactions, simulate calls where possible, display network/gas estimates, show the transaction hash and explorer link, and reconcile on-chain confirmation rather than marking success immediately on wallet submission.
7. Solidity prototype requirements (conditional)
If the ZIP already contains contracts: inspect, compile, test and integrate them; do not arbitrarily rewrite contracts that work. If missing contracts block clearly implemented features, create only the minimum testnet-ready Solidity contracts needed for a demonstrable end-to-end flow. Use a current Hardhat toolchain, OpenZeppelin contracts, and consistent ABIs/deployment addresses per network. Include deployment scripts, local/testnet configuration and focused unit/integration tests.

Test access controls, approvals, zero values, incorrect token/network, unauthorized calls, reentrancy-sensitive flows, event emissions, transaction failures and accounting invariants as relevant. Never hardcode secrets, take custody of user wallet keys, silently spend/approve tokens, or deploy to a real-money chain without explicit request. State clearly that prototype contracts are not audited and not production-safe.
8. Backend deliverables
Build only endpoints justified by existing screens. Likely resource groups, if needed: /api/health, /api/markets, /api/markets/:asset, /api/markets/:asset/history, /api/forex/rates, /api/dex/pairs, /api/wallet/:address/activity, and /api/nft/.... Adapt names to the application and do not create routes with no consumers.

Use a documented response envelope with data, source, asOf, stale, and structured errors when relevant. Validate inputs and wallet addresses, use safe timeouts, upstream request deduplication, cache durations by volatility, rate limiting, CORS allowlist, server-side key management, and protective logging. Supply .env.example without real keys. Do not expose third-party secrets in Vite/React VITE_* variables. Provide a straightforward local dev workflow for starting frontend, backend, and chain/testnet.

Avoid fake successful responses in production code paths. A market-data backend is read-only; it cannot make user wallet trades through a public market-data endpoint.
9. Frontend implementation standards
Continue using the current project's React, state library (including Zustand if present), router, charting, R3F/Three.js, CSS tooling and build system. Consolidate duplicated UI primitives and token usage. Prevent race conditions in data fetching; cancel stale requests; manage WebSocket reconnect/backoff and component cleanup. Handle zero/negative/very large numbers, small token decimals, precision and localization safely. Do not use floating-point JS arithmetic for token balances or transaction amounts where exact integer units/BigInt are required.

Maintain responsiveness from mobile to wide desktop, keyboard accessibility, readable dense tables, descriptive form labels, and reduced-motion handling. Protect animation and WebGL performance: sensible DPR caps, cleanup/disposal of geometries/materials/textures, and avoiding unnecessary shader recompilations or Zustand rerender storms. Retain the distinct 3D identity of CryptoArt; do not fill every screen with new animation.
10. Validation and acceptance criteria
Before declaring completion:
- The existing app starts and builds with reproducible commands.
- Existing routes/navigation and critical features continue working.
- No crashes, broken imports, double routers, hook-order violations, CORS bypass hacks, or secret leakage.
- Every page and existing 3D object reflects changes to only --ca-base, --ca-text, and --ca-accent.
- All real-data screens expose provider and data freshness, handle offline/error conditions, and do not imply fake values are live.
- Wallet flows distinguish disconnected, connected, unsupported network, pending, failed and confirmed states.
- Smart contracts (when created) compile, have tests and deploy to local chain/testnet, not mainnet.
- Backend contract/API documentation and .env.example exist.
- Run available tests, lint, build and a manual smoke-test checklist; show actual command results, not unverified assertions.
11. Execution and final response protocol
Work in this order:

Phase A — Discovery: inspect and document actual codebase; record feature inventory and technical debt.

Phase B — Foundation: central three-anchor token architecture; bring existing pages/3D under theme control without changing behavior.

Phase C — Real data: backend service, source adapters, reliable market data and integration with existing UI.

Phase D — On-chain prototype: wallet and minimal Solidity/testnet implementation only for present and feasible features.

Phase E — Quality: responsive/a11y/performance improvements, regression fixes, tests and documentation.

For each phase, edit real files; enumerate changed file paths and why; include commands to run and tests performed. If time/context budget prevents completion, stop at a coherent working checkpoint and state precisely what remains. Do not mark unimplemented features complete. Prioritize functional correctness, maintainability, fidelity to the original app, and restrained visual quality over large quantities of generated code.

Non-negotiable: This is an upgrade of the provided CryptoArt ZIP, not a new product concept. Do not fabricate codebase understanding, add unnecessary UI features, invent production trading capabilities, or introduce hardcoded colors outside the three-variable system. Start by inspecting the ZIP, then implement.