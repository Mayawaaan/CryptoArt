import React from 'react'
import HomePage from '../pages/HomePage';
import SwapPage from '../pages/SwapPage';
import StakingPage from '../pages/StakingPage';
import MarketTrack from '../pages/MarketTrack';
import NFTGallery from '../pages/NFTGallery';
import AboutUs from '../pages/AboutUs';
import AffiliateProgram from '../pages/AffiliateProgram';
import API from '../pages/API';
import CookiePolicy from '../pages/CookiePolicy';
import Fees from '../pages/Fees';
import HelpCenter from '../pages/HelpCenter';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import Security from '../pages/Security';
import SubmitRequest from '../pages/SubmitRequest';
import TermsOfService from '../pages/TermsOfService';
import TradingFee from '../pages/TradingFee';
import UserGuide from '../pages/UserGuide';
import StakePage from '../pages/StakePage';
import PoolDetails from '../pages/PoolDetails';
import { Routes, Route } from 'react-router-dom';


const router = () => {
  return (
    <>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/swap" element={<SwapPage />} />
          <Route path="/stake" element={<StakingPage />} />
          <Route path="/market-track" element={<MarketTrack />} />
          <Route path="/nft-gallery" element={<NFTGallery />} />
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
        </Routes>
    </>
  )
}

export default router