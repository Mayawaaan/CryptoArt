import React, { Suspense, lazy } from "react"
import { Link, Route, Routes } from "react-router-dom"
import HomePage from "../pages/HomePage"

const SwapPage = lazy(() => import("../pages/SwapPage"))
const StakingPage = lazy(() => import("../pages/StakingPage"))
const MarketTrack = lazy(() => import("../pages/MarketTrack"))
const NFTGallery = lazy(() => import("../pages/NFTGallery"))
const CreateNftPage = lazy(() => import("../pages/CreateNftPage"))
const NftDetailPage = lazy(() => import("../pages/NftDetailPage"))
const CollectionPage = lazy(() => import("../pages/CollectionPage"))
const DemoActivityPage = lazy(() => import("../pages/DemoActivityPage"))
const AboutUs = lazy(() => import("../pages/AboutUs"))
const AffiliateProgram = lazy(() => import("../pages/AffiliateProgram"))
const API = lazy(() => import("../pages/API"))
const CookiePolicy = lazy(() => import("../pages/CookiePolicy"))
const Fees = lazy(() => import("../pages/Fees"))
const HelpCenter = lazy(() => import("../pages/HelpCenter"))
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"))
const Security = lazy(() => import("../pages/Security"))
const SubmitRequest = lazy(() => import("../pages/SubmitRequest"))
const TermsOfService = lazy(() => import("../pages/TermsOfService"))
const TradingFee = lazy(() => import("../pages/TradingFee"))
const UserGuide = lazy(() => import("../pages/UserGuide"))
const StakePage = lazy(() => import("../pages/StakePage"))
const PoolDetails = lazy(() => import("../pages/PoolDetails"))

const RouteFallback = () => (
  <div className="min-h-[60vh] bg-ca-bg text-ca-text-muted flex items-center justify-center text-sm font-mono">
    Loading view...
  </div>
)

const NotFound = () => (
  <main className="min-h-[70vh] bg-ca-bg text-ca-text flex items-center justify-center px-6">
    <div className="text-center space-y-4 max-w-md bg-ca-surface border border-ca-border rounded-2xl p-8">
      <p className="text-xs font-mono uppercase tracking-widest text-ca-accent">404</p>
      <h1 className="text-2xl font-semibold">Page Not Found</h1>
      <p className="text-sm text-ca-text-muted">
        The requested route does not exist in CryptoArt.
      </p>
      <Link
        to="/"
        className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold bg-ca-accent text-ca-text-inverse hover:bg-ca-accent-hover transition-colors"
      >
        Return Home
      </Link>
    </div>
  </main>
)

const Router = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/swap" element={<SwapPage />} />
        <Route path="/stake" element={<StakingPage />} />
        <Route path="/market-track" element={<MarketTrack />} />
        <Route path="/nft-gallery" element={<NFTGallery />} />
        <Route path="/nft-gallery/create" element={<CreateNftPage />} />
        <Route path="/nft-gallery/:id" element={<NftDetailPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/demo-activity" element={<DemoActivityPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/affiliate-program" element={<AffiliateProgram />} />
        <Route path="/api" element={<API />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/trading-fee" element={<TradingFee />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/submit-request" element={<SubmitRequest />} />
        <Route path="/user-guide" element={<UserGuide />} />
        <Route path="/security" element={<Security />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/stake/:pool" element={<StakePage />} />
        <Route path="/pool/:pool" element={<PoolDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default Router
