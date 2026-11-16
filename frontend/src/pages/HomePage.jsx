import React from "react"
import HeroSection from "../components/home/HeroSection"
import MarketSection from "../components/home/MarketSection"
import CorePlatformFeature from "../components/home/CorePlatformFeature"
import NftShowcaseSection from "../components/home/NftShowcaseSection"
import InfoSection from "../components/home/InfoSection"

const HomePage = () => {
  return (
    <main className="bg-ca-bg text-ca-text overflow-x-clip">
      <HeroSection />
      <MarketSection />
      <CorePlatformFeature />
      <NftShowcaseSection />
      <InfoSection />
    </main>
  )
}

export default HomePage
