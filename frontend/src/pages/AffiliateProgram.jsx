import React from "react"
import { Link } from "react-router-dom"
import tiers from "../data/AffiliateProgramData"
import PageHeader from "../components/ui/PageHeader"

const AffiliateProgram = () => {
  return (
    <main className="min-h-screen bg-ca-bg text-ca-text-secondary px-4 sm:px-6 py-10">
      <div className="container mx-auto space-y-12">
        <PageHeader
          eyebrow="Partner Program"
          title="Affiliate Commission Structure"
          description="Reference revenue-share schedule for developer and community integration partners."
          actions={
            <Link
              to="/submit-request"
              className="px-4 py-2 rounded-xl bg-ca-accent text-ca-text-inverse text-xs font-semibold hover:bg-ca-accent-hover transition-colors"
            >
              Apply via Support Portal
            </Link>
          }
        />

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              step: "01",
              title: "Share Identifier",
              text: "Distribute your partner identifier across developer and trader documentation.",
            },
            {
              step: "02",
              title: "Attributed Activity",
              text: "Referred accounts are tracked against published volume tiers.",
            },
            {
              step: "03",
              title: "Scheduled Settlement",
              text: "Commission statements follow monthly schedule disclosures.",
            },
          ].map((item) => (
            <div key={item.step} className="bg-ca-surface border border-ca-border rounded-2xl p-6 space-y-2">
              <span className="text-xs font-mono text-ca-accent font-semibold">{item.step}</span>
              <h2 className="text-base font-semibold text-ca-text">{item.title}</h2>
              <p className="text-xs sm:text-sm text-ca-text-muted leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-ca-text">Tier Schedule</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.level}
                className="bg-ca-surface border border-ca-border rounded-2xl p-7 space-y-3 hover:border-ca-accent transition-colors"
              >
                <h3 className="text-lg font-semibold text-ca-text">{tier.level}</h3>
                <p className="text-3xl font-mono tabular-nums font-semibold text-ca-accent">
                  {tier.commission}
                </p>
                <p className="text-xs sm:text-sm text-ca-text-muted">{tier.requirement}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default AffiliateProgram
