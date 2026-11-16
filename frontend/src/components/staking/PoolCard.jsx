import React from "react"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Button from "../ui/Button"
import StatusBadge from "../ui/StatusBadge"

const PoolCard = ({ slug, title, asset, description, baseApy, lockDays, minStake }) => {
  const navigate = useNavigate()
  const resolvedSlug = slug || title.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className="p-6 rounded-2xl bg-ca-surface border border-ca-border hover:border-ca-accent-border transition-colors flex flex-col justify-between gap-6">
      <div className="space-y-5">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <StatusBadge tone="neutral">{asset}</StatusBadge>
            <h3 className="text-xl font-semibold text-ca-text pt-1">{title}</h3>
            <p className="text-sm text-ca-text-secondary">{description}</p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] uppercase tracking-wider text-ca-text-muted block">
              Target APR
            </span>
            <span className="text-2xl font-mono tabular-nums font-semibold text-ca-accent">
              {baseApy}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 border-y border-ca-divider text-xs">
          <div>
            <span className="text-ca-text-muted block mb-1">Lock Schedule</span>
            <span className="font-semibold text-ca-text">
              {lockDays === 0 ? "Flexible" : `${lockDays} Days`}
            </span>
          </div>

          <div>
            <span className="text-ca-text-muted block mb-1">Min Demo Stake</span>
            <span className="font-mono tabular-nums font-semibold text-ca-text">1 CR</span>
          </div>

          <div>
            <span className="text-ca-text-muted block mb-1">Reference Min</span>
            <span className="font-mono tabular-nums font-semibold text-ca-text">
              {Number(minStake || 0).toLocaleString()} units
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={() => navigate(`/stake/${resolvedSlug}`)}>
          Stake in Vault
          <ArrowRight size={15} aria-hidden="true" />
        </Button>

        <Button variant="outline" onClick={() => navigate(`/pool/${resolvedSlug}`)}>
          Specifications
        </Button>
      </div>
    </div>
  )
}

export default PoolCard
