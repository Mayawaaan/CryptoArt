import React, { useLayoutEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SectionHeader from "../ui/SectionHeader"

gsap.registerPlugin(ScrollTrigger)

const MODULES = [
  {
    index: "01",
    title: "Market Intelligence",
    description:
      "Multi-currency spot prices, 7-day and 30-day charts, Binance recent fills, and ECB forex benchmarks.",
    cta: "Open Markets",
    to: "/market-track",
  },
  {
    index: "02",
    title: "Swap & DEX Liquidity",
    description:
      "Simulate portfolio conversions against live rates using Demo Credits or execute swaps on EVM testnet pools.",
    cta: "Open Swap Desk",
    to: "/swap",
  },
  {
    index: "03",
    title: "Staking Vaults",
    description:
      "Review deterministic lock periods and yield tiers in simulated Demo Vaults or prototype Solidity pools.",
    cta: "View Pools",
    to: "/stake",
  },
  {
    index: "04",
    title: "Creator NFT Market",
    description:
      "Upload verified artwork to Cloudinary, list fixed-price or auction works on MongoDB, and collect with Demo Credits.",
    cta: "Explore Gallery",
    to: "/nft-gallery",
  },
]

const CorePlatformFeature = () => {
  const containerRef = useRef(null)

  useLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return undefined

    const ctx = gsap.context(() => {
      gsap.from(".module-card", {
        opacity: 0,
        y: 18,
        stagger: 0.08,
        duration: 0.48,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="bg-ca-surface/40 text-ca-text py-16 lg:py-24 px-4 sm:px-6 border-y border-ca-divider"
    >
      <div className="container mx-auto space-y-10">
        <SectionHeader
          eyebrow="Platform Architecture"
          title="Four Integrated Workspaces"
          description="Every route shares consistent state, explicit execution-mode labeling, and synchronized market feeds."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {MODULES.map((item) => (
            <div
              key={item.index}
              className="module-card bg-ca-surface rounded-2xl border border-ca-border hover:border-ca-accent-border p-6 flex flex-col justify-between gap-8 transition-colors"
            >
              <div className="space-y-3">
                <span className="text-xs font-mono text-ca-accent font-semibold">
                  {item.index}
                </span>
                <h3 className="text-lg font-semibold text-ca-text">{item.title}</h3>
                <p className="text-sm text-ca-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>

              <Link
                to={item.to}
                className="inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-ca-accent border border-ca-accent-border bg-ca-accent-soft hover:bg-ca-accent hover:text-ca-text-inverse transition-colors"
              >
                <span>{item.cta}</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CorePlatformFeature
