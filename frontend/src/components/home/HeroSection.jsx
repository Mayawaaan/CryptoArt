import React, { useLayoutEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { gsap } from "gsap"
import { ArrowRight } from "lucide-react"
import CurrencyCoinScene from "./CurrencyCoinScene"
import Button from "../ui/Button"
import { useDemoWallet } from "../../hooks/useDemoWallet"

const HeroSection = () => {
  const copyRef = useRef(null)
  const { openWalletModal, isActive: isDemoActive, wallet } = useDemoWallet()

  useLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion || !copyRef.current) return undefined

    const ctx = gsap.context(() => {
      gsap.from(".hero-stagger", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        clearProps: "transform,opacity",
      })
    }, copyRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="bg-ca-bg border-b border-ca-divider">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 px-4 sm:px-6 py-12 lg:py-20">
        <div ref={copyRef} className="w-full lg:w-1/2 text-ca-text space-y-6">
          <p className="hero-stagger text-xs font-mono uppercase tracking-[0.18em] text-ca-accent font-semibold">
            Markets · Exchange · Creator Studio
          </p>

          <h1 className="hero-stagger text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-ca-text">
            Digital Asset Infrastructure,{" "}
            <span className="text-ca-accent">Built for Clarity</span>
          </h1>

          <p className="hero-stagger text-ca-text-secondary text-base sm:text-lg max-w-xl leading-relaxed">
            Monitor live cryptocurrency and central-bank FX markets, simulate trades and staking
            with persistent Demo Credits, create NFTs on MongoDB and Cloudinary, or connect an EVM
            wallet on Hardhat and Sepolia.
          </p>

          <div className="hero-stagger flex flex-wrap items-center gap-3 pt-1">
            <Link
              to="/market-track"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-ca-accent text-ca-text-inverse hover:bg-ca-accent-hover transition-colors"
            >
              Explore Markets
              <ArrowRight size={16} aria-hidden="true" />
            </Link>

            <Link
              to="/nft-gallery"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-ca-text border border-ca-border-strong bg-ca-surface hover:border-ca-accent hover:text-ca-accent transition-colors"
            >
              Browse NFTs
            </Link>

            <Button
              variant="soft"
              size="lg"
              onClick={() => openWalletModal("demo")}
            >
              {isDemoActive
                ? `Demo Wallet · ${Number(wallet?.balanceCredits || 0).toLocaleString()} CR`
                : "Try Demo Wallet"}
            </Button>
          </div>

          <div className="hero-stagger grid grid-cols-3 gap-6 pt-6 border-t border-ca-divider max-w-lg">
            <div>
              <p className="text-sm font-semibold text-ca-text">Spot &amp; FX Feeds</p>
              <p className="text-ca-text-muted text-xs mt-1">CoinGecko, Binance, ECB</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-ca-text">10,000 Demo CR</p>
              <p className="text-ca-text-muted text-xs mt-1">Risk-free Mongo ledger</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-ca-text">EVM Testnet</p>
              <p className="text-ca-text-muted text-xs mt-1">Hardhat &amp; Sepolia</p>
            </div>
          </div>
        </div>

        {/* Preserved 3D Coin Scene (unobstructed & untouched) */}
        <div className="w-full lg:w-1/2 h-[340px] sm:h-[440px] lg:h-[560px]">
          <CurrencyCoinScene />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
