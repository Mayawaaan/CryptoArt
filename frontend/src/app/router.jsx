import React, { Suspense, lazy } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { AnimatePresence } from "motion/react"

import HomePage from "../pages/HomePage"
import ErrorPage from "../pages/ErrorPage"
import RouteLoader from "../components/common/RouteLoader"
import PageTransition from "../components/common/PageTransition"
import ErrorBoundary from "../components/common/ErrorBoundary"

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
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"))

const Router = () => {
  const location = useLocation()

  return (
    <ErrorBoundary key={location.pathname}>
      <Suspense fallback={<RouteLoader />}>
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <Routes location={location}>
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
              <Route path="/error" element={<ErrorPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </PageTransition>
        </AnimatePresence>
      </Suspense>
    </ErrorBoundary>
  )
}

export default Router
