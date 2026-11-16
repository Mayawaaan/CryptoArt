import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight } from "lucide-react"
import pools from "../data/StakingPoolData"
import Button from "../components/ui/Button"
import StatusBadge from "../components/ui/StatusBadge"

const PoolDetails = () => {
  const { pool } = useParams()
  const navigate = useNavigate()

  const poolInfo =
    pools.find((p) => p.slug === pool) || {
      slug: pool,
      title: pool.replace(/-/g, " "),
      asset: "CART",
      baseApy: 12.0,
      lockDays: 30,
      minStake: 100,
      description: "Prototype staking pool configuration.",
      summary:
        "Computes deterministic reward accruals against the configured lock duration and APR schedule.",
    }

  return (
    <main className="min-h-screen bg-ca-bg text-ca-text px-4 sm:px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => navigate("/stake")}
          className="cursor-pointer inline-flex items-center gap-2 text-xs font-medium text-ca-text-muted hover:text-ca-text transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to Staking Vaults
        </button>

        <div className="bg-ca-surface border border-ca-border p-6 sm:p-10 rounded-2xl space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ca-divider pb-6">
            <div className="space-y-2">
              <StatusBadge tone="neutral">{poolInfo.asset}</StatusBadge>
              <h1 className="text-3xl font-semibold capitalize text-ca-text">{poolInfo.title}</h1>
              <p className="text-sm text-ca-text-secondary max-w-xl">{poolInfo.description}</p>
            </div>

            <Button variant="primary" onClick={() => navigate(`/stake/${poolInfo.slug}`)}>
              Open Vault
              <ArrowRight size={15} aria-hidden="true" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-ca-bg border border-ca-border p-5 rounded-xl space-y-1">
              <span className="text-ca-text-muted text-xs uppercase tracking-wider block">
                Target APR
              </span>
              <span className="text-xl font-mono tabular-nums font-semibold text-ca-accent">
                {poolInfo.baseApy}%
              </span>
            </div>

            <div className="bg-ca-bg border border-ca-border p-5 rounded-xl space-y-1">
              <span className="text-ca-text-muted text-xs uppercase tracking-wider block">
                Lock Schedule
              </span>
              <span className="text-xl font-semibold text-ca-text">
                {poolInfo.lockDays === 0 ? "Flexible" : `${poolInfo.lockDays} Days`}
              </span>
            </div>

            <div className="bg-ca-bg border border-ca-border p-5 rounded-xl space-y-1">
              <span className="text-ca-text-muted text-xs uppercase tracking-wider block">
                Demo Minimum
              </span>
              <span className="text-xl font-mono tabular-nums font-semibold text-ca-text">
                1 CR
              </span>
            </div>

            <div className="bg-ca-bg border border-ca-border p-5 rounded-xl space-y-1">
              <span className="text-ca-text-muted text-xs uppercase tracking-wider block">
                Execution Paths
              </span>
              <span className="text-sm font-semibold text-ca-text block pt-1">
                Demo + Testnet
              </span>
            </div>
          </div>

          <div className="bg-ca-bg border border-ca-border p-6 rounded-xl space-y-2">
            <h2 className="text-sm font-semibold text-ca-text">Vault Architecture &amp; Scope</h2>
            <p className="text-xs sm:text-sm text-ca-text-secondary leading-relaxed">
              {poolInfo.summary} Simulated positions persist to your MongoDB Demo Wallet under{" "}
              <code className="font-mono text-ca-text">DEMO_CREDITS</code>; smart contract calls
              require an injected EVM wallet targeting Hardhat Local (31337) or Sepolia (11155111).
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PoolDetails
