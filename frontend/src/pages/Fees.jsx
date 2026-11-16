import React from "react"
import { useNavigate } from "react-router-dom"
import plans from "../data/FeesData"
import PageHeader from "../components/ui/PageHeader"
import Button from "../components/ui/Button"
import StatusBadge from "../components/ui/StatusBadge"

const planRoutes = ["/market-track", "/stake", "/submit-request"]

const Fees = () => {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-ca-bg text-ca-text px-4 sm:px-6 py-10">
      <div className="container mx-auto space-y-10">
        <PageHeader
          eyebrow="Platform Schedule"
          title="Pricing & Platform Access"
          description="Transparent reference tiers covering demo exploration, active testnet prototyping, and API access."
        />

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 sm:p-8 border flex flex-col justify-between gap-8 transition-colors ${
                plan.recommended
                  ? "border-ca-accent bg-ca-surface-raised"
                  : "border-ca-border bg-ca-surface hover:border-ca-accent-border"
              }`}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xl font-semibold text-ca-text">{plan.name}</h2>
                  {plan.recommended && <StatusBadge tone="accent">Default</StatusBadge>}
                </div>

                <p className="text-3xl font-mono tabular-nums font-semibold text-ca-accent">
                  {plan.price}
                </p>

                <p className="text-sm text-ca-text-secondary leading-relaxed">
                  {plan.description}
                </p>

                <ul className="space-y-2.5 text-sm text-ca-text-secondary border-t border-ca-divider pt-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-ca-accent shrink-0" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant={plan.recommended ? "primary" : "secondary"}
                onClick={() => navigate(planRoutes[index] || "/market-track")}
                className="w-full"
              >
                Open Workspace
              </Button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Fees
