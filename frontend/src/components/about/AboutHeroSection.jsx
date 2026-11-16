import React from "react"
import { Link } from "react-router-dom"
import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"
import StatusBadge from "../ui/StatusBadge"

const AboutHeroSection = ({ hero }) => {
  return (
    <section
      id="about-intro"
      aria-labelledby="about-hero-heading"
      className="relative border-b border-ca-divider py-14 sm:py-20 lg:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 space-y-14">
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-ca-divider">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-[0.22em] text-ca-accent font-semibold">
              {hero.eyebrow}
            </span>
            <span className="text-ca-text-muted font-mono text-xs">/</span>
            <span className="text-xs font-mono uppercase tracking-[0.16em] text-ca-text-muted">
              SECTION 01 — EDITORIAL INTRODUCTION
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="accent">Monorepo v2.0</StatusBadge>
            <StatusBadge tone="neutral">Est. 2022 · Rebuilt 2026</StatusBadge>
          </div>
        </div>

        {/* Main Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8 space-y-6"
          >
            <h1
              id="about-hero-heading"
              className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-ca-text"
            >
              {hero.titleLine1}{" "}
              <span className="text-ca-accent block sm:inline">{hero.highlight}</span>
            </h1>

            <p className="text-lg sm:text-xl text-ca-text font-medium leading-relaxed max-w-3xl">
              {hero.headline}
            </p>

            <div className="space-y-4 text-sm sm:text-base text-ca-text-secondary leading-relaxed max-w-3xl pt-2">
              <p>{hero.primaryParagraph}</p>
              <p>{hero.secondaryParagraph}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                to="/market-track"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-ca-accent text-ca-text-inverse hover:bg-ca-accent-hover transition-colors"
              >
                Explore Live Markets
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link
                to="/nft-gallery"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-ca-surface border border-ca-border-strong text-ca-text hover:border-ca-accent hover:text-ca-accent transition-colors"
              >
                Browse NFT Marketplace
              </Link>
            </div>
          </motion.div>

          {/* Right Editorial Dossier Panel */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Platform dossier summary"
            className="lg:col-span-4 bg-ca-surface border border-ca-border rounded-2xl p-6 sm:p-7 space-y-6"
          >
            <div className="flex items-center gap-4 pb-5 border-b border-ca-divider">
              <img
                src="/logo/logoMark.png"
                alt="CryptoArt emblem"
                className="w-14 h-14 rounded-xl border border-ca-border bg-ca-bg p-1.5 object-contain shrink-0"
              />
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-ca-accent">
                  System Profile
                </p>
                <h2 className="text-base font-semibold text-ca-text mt-0.5">
                  CryptoArt Digital Asset Workspace
                </h2>
              </div>
            </div>

            <div className="rounded-xl bg-ca-bg border border-ca-border p-3 flex items-center justify-center">
              <img
                src="/logo/logoShowcase.png"
                alt="CryptoArt brand icon scale showcase"
                loading="lazy"
                className="w-full h-auto object-contain"
              />
            </div>

            <dl className="space-y-4 text-xs">
              <div className="flex justify-between gap-4 py-1.5 border-b border-ca-divider">
                <dt className="text-ca-text-muted font-mono uppercase">Repository Layout</dt>
                <dd className="text-ca-text font-mono text-right">frontend · backend · contracts</dd>
              </div>
              <div className="flex justify-between gap-4 py-1.5 border-b border-ca-divider">
                <dt className="text-ca-text-muted font-mono uppercase">Market Feeds</dt>
                <dd className="text-ca-text font-mono text-right">Spot Crypto + ECB Forex</dd>
              </div>
              <div className="flex justify-between gap-4 py-1.5 border-b border-ca-divider">
                <dt className="text-ca-text-muted font-mono uppercase">Off-Chain Mode</dt>
                <dd className="text-ca-accent font-mono text-right">10,000 Demo Credits</dd>
              </div>
              <div className="flex justify-between gap-4 py-1.5 border-b border-ca-divider">
                <dt className="text-ca-text-muted font-mono uppercase">On-Chain Networks</dt>
                <dd className="text-ca-text font-mono text-right">Hardhat (31337) · Sepolia</dd>
              </div>
              <div className="flex justify-between gap-4 py-1.5">
                <dt className="text-ca-text-muted font-mono uppercase">Custody Status</dt>
                <dd className="text-ca-text-secondary font-mono text-right">Non-Custodial / Zero Real Funds</dd>
              </div>
            </dl>

            <p className="text-xs text-ca-text-muted leading-relaxed pt-2 border-t border-ca-divider">
              {hero.description}
            </p>
          </motion.aside>
        </div>

        {/* Bottom 4-Pillar Specification Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {hero.quickFacts.map((fact, idx) => (
            <div
              key={fact.label}
              className="bg-ca-surface/60 border border-ca-border rounded-2xl p-5 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-mono text-ca-text-muted">
                <span>{fact.label}</span>
                <span className="text-ca-accent">0{idx + 1}</span>
              </div>
              <p className="text-lg sm:text-xl font-mono tabular-nums font-semibold text-ca-text">
                {fact.value}
              </p>
              <p className="text-xs text-ca-text-secondary leading-relaxed">{fact.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutHeroSection
