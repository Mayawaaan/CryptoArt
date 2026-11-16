import React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import Button from "../components/ui/Button"
import StatusBadge from "../components/ui/StatusBadge"

const QUICK_ROUTES = [
  {
    code: "01",
    name: "Market Terminal",
    description: "Live cryptocurrency spot feeds, historical charts, and ECB forex benchmarks.",
    to: "/market-track",
  },
  {
    code: "02",
    name: "Swap & Liquidity",
    description: "Multi-asset simulated conversions, DEX Screener pairs, and ETH ↔ CART pools.",
    to: "/swap",
  },
  {
    code: "03",
    name: "Staking Vaults",
    description: "Flexible and time-locked yield schedules in Demo Credits or testnet CART.",
    to: "/stake",
  },
  {
    code: "04",
    name: "NFT Marketplace",
    description: "Browse MongoDB-backed digital artwork, collect fixed-price items, or place bids.",
    to: "/nft-gallery",
  },
  {
    code: "05",
    name: "Creator Studio",
    description: "Upload PNG, JPEG, or WebP artwork to Cloudinary and publish a listing.",
    to: "/nft-gallery/create",
  },
  {
    code: "06",
    name: "About CryptoArt",
    description: "Explore our 2022–2026 journey, layered system architecture, and engineering team.",
    to: "/about-us",
  },
]

const NotFoundPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <main className="min-h-[82vh] bg-ca-bg text-ca-text px-4 sm:px-6 py-14 sm:py-20">
      <div className="container mx-auto max-w-5xl space-y-12">
        {/* Top Hero Card */}
        <section className="bg-ca-surface border border-ca-border rounded-2xl p-8 sm:p-12 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ca-divider pb-5">
            <div className="flex items-center gap-3">
              <img
                src="/logo/logoMark.png"
                alt=""
                aria-hidden="true"
                className="w-9 h-9 object-contain"
              />
              <StatusBadge tone="warning">ERR_ROUTE_404 · NOT FOUND</StatusBadge>
            </div>
            <span className="text-xs font-mono text-ca-text-muted">
              Requested path: <code className="text-ca-accent">{location.pathname}</code>
            </span>
          </div>

          <div className="space-y-3 max-w-2xl">
            <p className="text-5xl sm:text-6xl font-mono tabular-nums font-semibold text-ca-accent tracking-tight">
              404
            </p>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-ca-text">
              This route does not exist in the CryptoArt workspace.
            </h1>
            <p className="text-sm sm:text-base text-ca-text-secondary leading-relaxed">
              The URL you entered may be misspelled, moved during the monorepo separation, or
              no longer active. Use the navigation controls below to return to a verified route.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-ca-accent text-ca-text-inverse hover:bg-ca-accent-hover transition-colors"
            >
              Return to Homepage
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Button variant="secondary" size="lg" onClick={() => navigate(-1)}>
              <ArrowLeft size={15} aria-hidden="true" />
              Go Back
            </Button>
            <Link
              to="/help-center"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium bg-ca-bg border border-ca-border text-ca-text-secondary hover:border-ca-accent hover:text-ca-accent transition-colors"
            >
              Help Center
            </Link>
          </div>
        </section>

        {/* Verified Route Directory */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-[0.18em] text-ca-text-muted font-semibold">
              Verified Workspace Directory
            </h2>
            <span className="text-xs font-mono text-ca-accent">6 Core Modules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_ROUTES.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group bg-ca-surface border border-ca-border hover:border-ca-accent rounded-2xl p-5 flex flex-col justify-between gap-4 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-ca-accent font-semibold">{item.code}</span>
                    <ArrowUpRight
                      size={15}
                      className="text-ca-text-muted group-hover:text-ca-accent transition-colors"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-base font-semibold text-ca-text group-hover:text-ca-accent transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-ca-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-ca-text-muted">{item.to}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default NotFoundPage
