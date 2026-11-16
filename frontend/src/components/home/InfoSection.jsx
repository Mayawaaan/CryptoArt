import React, { useLayoutEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import features from "../../data/features"

gsap.registerPlugin(ScrollTrigger)

const InfoSection = () => {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) return undefined

    const ctx = gsap.context(() => {
      gsap.from(".info-reveal", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="w-full py-16 lg:py-24 bg-ca-bg text-ca-text">
      <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
        <div className="lg:col-span-5 info-reveal">
          <div className="rounded-2xl border border-ca-border bg-ca-surface p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-5">
            <img
              src="/logo/logoMark.png"
              alt="CryptoArt emblem"
              className="w-40 h-40 sm:w-48 sm:h-48 object-contain"
            />
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-ca-text">
                Crypto<span className="text-ca-accent">Art</span>
              </p>
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-ca-text-muted">
                Markets · Exchange · Creator Studio
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="info-reveal space-y-3">
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-ca-accent font-semibold">
              Engineering Standards
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ca-text">
              Transparent Separation Between Demo Simulation and Testnet Execution
            </h2>
            <p className="text-sm sm:text-base text-ca-text-secondary leading-relaxed max-w-2xl">
              Off-chain demo activity runs against server-validated MongoDB accounts using
              simulated Demo Credits, while smart-contract flows run explicitly against Hardhat and
              Sepolia deployments with user wallet signatures.
            </p>
          </div>

          <div className="info-reveal grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((item) => (
              <div
                key={item.title}
                className="border-l-2 border-ca-accent pl-4 py-1 space-y-1"
              >
                <h3 className="text-sm font-semibold text-ca-text">{item.title}</h3>
                <p className="text-xs text-ca-text-secondary leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="info-reveal flex flex-wrap gap-3 pt-2">
            <Link
              to="/api"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-ca-surface-raised border border-ca-border text-ca-text hover:border-ca-accent transition-colors"
            >
              API Reference
            </Link>
            <Link
              to="/security"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-ca-surface-raised border border-ca-border text-ca-text hover:border-ca-accent transition-colors"
            >
              Security Notes
            </Link>
            <Link
              to="/user-guide"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-ca-surface-raised border border-ca-border text-ca-text hover:border-ca-accent transition-colors"
            >
              User Guide
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InfoSection
