import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import StatusBadge from "../ui/StatusBadge"

const AboutEcosystemSection = ({ ecosystem }) => {
  return (
    <section
      id="about-ecosystem"
      aria-labelledby="about-ecosystem-heading"
      className="py-16 sm:py-24 border-b border-ca-divider bg-ca-bg"
    >
      <div className="container mx-auto px-4 sm:px-6 space-y-14">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-8 border-b border-ca-divider">
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-ca-accent font-semibold">
              {ecosystem.eyebrow}
            </p>
            <h2
              id="about-ecosystem-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-ca-text"
            >
              {ecosystem.title}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-ca-text-secondary leading-relaxed">
              {ecosystem.description}
            </p>
          </div>
        </div>

        {/* Structured Feature Showcase Rows */}
        <div className="space-y-8">
          {ecosystem.items.map((feature, idx) => {
            const isEven = idx % 2 === 1
            return (
              <article
                key={feature.id}
                className="about-reveal rounded-2xl bg-ca-surface border border-ca-border p-6 sm:p-8 lg:p-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                  {/* Left / Identity & Telemetry Column */}
                  <div
                    className={`lg:col-span-5 space-y-6 ${
                      isEven ? "lg:order-2 lg:border-l lg:border-ca-divider lg:pl-8" : "lg:border-r lg:border-ca-divider lg:pr-8"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-3xl sm:text-4xl font-mono tabular-nums font-semibold text-ca-accent">
                        {feature.number}
                      </span>
                      <StatusBadge tone={feature.statusTone || "neutral"}>
                        {feature.status}
                      </StatusBadge>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl sm:text-3xl font-semibold text-ca-text tracking-tight">
                        {feature.name}
                      </h3>
                      <p className="text-sm sm:text-base font-medium text-ca-text-secondary leading-snug">
                        {feature.summary}
                      </p>
                    </div>

                    {/* Technical Telemetry Strip */}
                    <dl className="space-y-2.5 pt-4 border-t border-ca-divider text-xs">
                      {feature.metrics.map((m) => (
                        <div key={m.label} className="flex justify-between gap-3">
                          <dt className="text-ca-text-muted font-mono uppercase">{m.label}</dt>
                          <dd className="text-ca-text font-mono text-right">{m.value}</dd>
                        </div>
                      ))}
                    </dl>

                    {/* Route CTAs */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Link
                        to={feature.route}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-ca-accent text-ca-text-inverse hover:bg-ca-accent-hover transition-colors"
                      >
                        {feature.ctaLabel}
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>

                      {feature.secondaryRoute && (
                        <Link
                          to={feature.secondaryRoute}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-ca-bg border border-ca-border text-ca-text-secondary hover:border-ca-accent hover:text-ca-accent transition-colors"
                        >
                          {feature.secondaryLabel}
                          <ArrowUpRight size={13} aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Right / Narrative, Use Case & Platform Integration Column */}
                  <div
                    className={`lg:col-span-7 space-y-6 ${
                      isEven ? "lg:order-1" : ""
                    }`}
                  >
                    <div className="space-y-2">
                      <p className="text-xs font-mono uppercase tracking-wider text-ca-text-muted">
                        Implementation Overview
                      </p>
                      <p className="text-sm sm:text-base text-ca-text-secondary leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-ca-bg border border-ca-border space-y-1.5">
                        <p className="text-[11px] font-mono uppercase tracking-wider text-ca-accent font-semibold">
                          Primary Use Case
                        </p>
                        <p className="text-xs sm:text-sm text-ca-text-secondary leading-relaxed">
                          {feature.primaryUseCase}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-ca-bg border border-ca-border space-y-1.5">
                        <p className="text-[11px] font-mono uppercase tracking-wider text-ca-accent font-semibold">
                          How It Fits Into CryptoArt
                        </p>
                        <p className="text-xs sm:text-sm text-ca-text-secondary leading-relaxed">
                          {feature.platformFit}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default AboutEcosystemSection
