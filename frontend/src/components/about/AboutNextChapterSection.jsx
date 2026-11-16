import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import StatusBadge from "../ui/StatusBadge"
import Button from "../ui/Button"
import { useDemoWallet } from "../../hooks/useDemoWallet"

const AboutNextChapterSection = ({ nextChapter }) => {
  const { openWalletModal, isActive: isDemoActive, wallet } = useDemoWallet()

  return (
    <section
      id="about-next"
      aria-labelledby="about-next-heading"
      className="py-16 sm:py-24 bg-ca-bg"
    >
      <div className="container mx-auto px-4 sm:px-6 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-ca-accent font-semibold">
            {nextChapter.eyebrow}
          </p>
          <h2
            id="about-next-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-ca-text"
          >
            {nextChapter.title}
          </h2>
          <p className="text-sm sm:text-base text-ca-text-secondary leading-relaxed">
            {nextChapter.lead}
          </p>
        </div>

        {/* Operational Foundation vs Planned Exploration Matrix */}
        <div className="space-y-4">
          {nextChapter.tracks.map((track) => (
            <article
              key={track.id}
              className="about-reveal bg-ca-surface border border-ca-border rounded-2xl p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              <div className="lg:col-span-4 space-y-1.5">
                <span className="text-xs font-mono text-ca-accent font-semibold">
                  TRACK {track.number}
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-ca-text">
                  {track.domain}
                </h3>
              </div>

              <div className="lg:col-span-4 space-y-2 p-4 rounded-xl bg-ca-bg border border-ca-border">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-ca-text-muted">
                    Completed Foundation
                  </span>
                  <StatusBadge tone="positive">Operational</StatusBadge>
                </div>
                <p className="text-xs sm:text-sm text-ca-text-secondary leading-relaxed">
                  {track.operationalToday}
                </p>
              </div>

              <div className="lg:col-span-4 space-y-2 p-4 rounded-xl bg-ca-bg border border-ca-divider">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-ca-text-muted">
                    Ongoing Direction
                  </span>
                  <StatusBadge tone="neutral">Planned</StatusBadge>
                </div>
                <p className="text-xs sm:text-sm text-ca-text-muted leading-relaxed">
                  {track.plannedDirection}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Editorial Finale CTA Panel */}
        <div className="about-reveal rounded-2xl bg-ca-surface border border-ca-accent-border p-8 sm:p-12 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-ca-accent font-semibold">
                {nextChapter.cta.eyebrow}
              </p>
              <h3 className="text-2xl sm:text-4xl font-semibold tracking-tight text-ca-text">
                {nextChapter.cta.headline}
              </h3>
              <p className="text-sm sm:text-base text-ca-text-secondary leading-relaxed max-w-2xl">
                {nextChapter.cta.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={nextChapter.cta.primary.to}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-ca-accent text-ca-text-inverse hover:bg-ca-accent-hover transition-colors"
                >
                  {nextChapter.cta.primary.label}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>

                <Link
                  to={nextChapter.cta.secondary.to}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-ca-surface-raised border border-ca-border-strong text-ca-text hover:border-ca-accent hover:text-ca-accent transition-colors"
                >
                  {nextChapter.cta.secondary.label}
                </Link>

                <Button
                  variant="soft"
                  size="lg"
                  onClick={() => openWalletModal("demo")}
                >
                  {isDemoActive
                    ? `Demo Wallet · ${Number(wallet?.balanceCredits || 0).toLocaleString()} CR`
                    : "Initialize 10,000 Demo Credits"}
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 lg:border-l lg:border-ca-divider lg:pl-8 space-y-3">
              <p className="text-xs font-mono uppercase tracking-wider text-ca-text-muted">
                Direct Workspace Routes
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {nextChapter.cta.quickLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-ca-bg border border-ca-border text-xs font-semibold text-ca-text hover:border-ca-accent hover:text-ca-accent transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutNextChapterSection
