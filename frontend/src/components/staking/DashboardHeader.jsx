import React from "react"
import { Link } from "react-router-dom"
import pools from "../../data/StakingPoolData"
import PageHeader from "../ui/PageHeader"
import StatusBadge from "../ui/StatusBadge"

const DashboardHeader = () => {
  const avgApy = (pools.reduce((acc, p) => acc + p.baseApy, 0) / pools.length).toFixed(2)

  return (
    <PageHeader
      eyebrow="Yield & Lockups"
      title="Staking Vaults"
      description="Allocate simulated Demo Credits into time-locked or flexible vaults, or interact with the CryptoArtStaking contract on EVM testnets."
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone="neutral" className="tabular-nums">
            Mean Schedule · {avgApy}% APR
          </StatusBadge>
          <Link
            to="/demo-activity"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-ca-surface-raised border border-ca-border text-ca-text hover:border-ca-accent transition-colors"
          >
            View Demo Activity
          </Link>
        </div>
      }
    />
  )
}

export default DashboardHeader
