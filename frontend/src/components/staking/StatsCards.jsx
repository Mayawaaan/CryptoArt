import React from "react"
import { useQuery } from "@tanstack/react-query"
import pools from "../../data/StakingPoolData"
import Button from "../ui/Button"
import StatusBadge from "../ui/StatusBadge"
import { fetchDemoStaking } from "../../services/demoApi"
import { useDemoWallet } from "../../hooks/useDemoWallet"

const StatsCards = () => {
  const { wallet, isActive, databaseConnected, openWalletModal } = useDemoWallet()

  const { data } = useQuery({
    queryKey: ["demo-staking"],
    queryFn: ({ signal }) => fetchDemoStaking(signal),
    enabled: databaseConnected && isActive,
    retry: false,
    staleTime: 10_000,
  })

  const positions = data?.data?.positions || []
  const activePositions = positions.filter((p) => p.status === "active")
  const totalDemoStaked = activePositions.reduce(
    (sum, p) => sum + Number(p.amountCredits || 0),
    0
  )
  const avgApy = (pools.reduce((acc, p) => acc + p.baseApy, 0) / pools.length).toFixed(2)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="p-6 rounded-2xl bg-ca-surface border border-ca-border space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-wider text-ca-text-muted font-medium">
            Active Demo Staked
          </span>
          <StatusBadge tone={isActive ? "accent" : "neutral"}>
            {isActive ? `${activePositions.length} Active` : "Session Idle"}
          </StatusBadge>
        </div>

        <p className="text-2xl sm:text-3xl font-mono tabular-nums font-semibold text-ca-text pt-1">
          {totalDemoStaked.toLocaleString()} <span className="text-sm text-ca-accent">CR</span>
        </p>

        <p className="text-xs text-ca-text-muted">
          Principal locked inside simulated MongoDB Demo Vaults.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-ca-surface border border-ca-border space-y-3">
        <span className="text-xs uppercase tracking-wider text-ca-text-muted font-medium block">
          Available Demo Balance
        </span>

        <p className="text-2xl sm:text-3xl font-mono tabular-nums font-semibold text-ca-accent">
          {isActive
            ? `${Number(wallet?.balanceCredits || 0).toLocaleString()} CR`
            : "--"}
        </p>

        {!isActive && (
          <Button variant="soft" size="sm" onClick={() => openWalletModal("demo")}>
            Start Demo Session (10,000 CR)
          </Button>
        )}
      </div>

      <div className="p-6 rounded-2xl bg-ca-surface border border-ca-border space-y-2">
        <span className="text-xs uppercase tracking-wider text-ca-text-muted font-medium block">
          Configured Mean Schedule
        </span>

        <p className="text-2xl sm:text-3xl font-mono tabular-nums font-semibold text-ca-text pt-1">
          {avgApy}% <span className="text-sm text-ca-text-muted">APR</span>
        </p>

        <p className="text-xs text-ca-text-muted">
          Deterministic reward schedule across {pools.length} reference vaults.
        </p>
      </div>
    </div>
  )
}

export default StatsCards
