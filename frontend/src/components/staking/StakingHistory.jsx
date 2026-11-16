import React, { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Button from "../ui/Button"
import StatusBadge from "../ui/StatusBadge"
import DataTable from "../ui/DataTable"
import { fetchDemoStaking, unstakeDemoPosition } from "../../services/demoApi"
import { useDemoWallet } from "../../hooks/useDemoWallet"
import { useToast } from "../../hooks/useToast"

const StakingHistory = () => {
  const { isActive, databaseConnected, refreshWallet, openWalletModal } = useDemoWallet()
  const { pushToast } = useToast()
  const queryClient = useQueryClient()
  const [unstakingId, setUnstakingId] = useState(null)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["demo-staking"],
    queryFn: ({ signal }) => fetchDemoStaking(signal),
    enabled: databaseConnected && isActive,
    retry: false,
    staleTime: 10_000,
  })

  const unstakeMutation = useMutation({
    mutationFn: (id) => unstakeDemoPosition(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["demo-staking"] })
      refreshWallet()
      const txId = res.data?.transaction?.demoTxId || "DEMO-TX"
      pushToast({
        title: "Demo Position Unstaked",
        description: `Principal + accrued simulated reward settled (${txId}).`,
      })
    },
    onError: (err) => {
      pushToast({
        title: "Unstake failed",
        description: err.message || "Unable to unstake demo position.",
      })
    },
    onSettled: () => {
      setUnstakingId(null)
    },
  })

  const positions = data?.data?.positions || []

  if (!databaseConnected) {
    return (
      <section className="rounded-2xl bg-ca-surface border border-ca-border p-6 text-sm text-ca-text-secondary">
        Connect MongoDB in <code className="font-mono text-ca-text">backend/.env</code> to track
        persistent Demo Staking positions.
      </section>
    )
  }

  if (!isActive) {
    return (
      <section className="rounded-2xl bg-ca-surface border border-ca-border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-ca-text">Your Demo Vault Positions</h3>
          <p className="text-xs text-ca-text-muted mt-1">
            Start a Demo Wallet session to stake credits and track lock schedules in MongoDB.
          </p>
        </div>
        <Button variant="soft" size="sm" onClick={() => openWalletModal("demo")}>
          Start Demo Session
        </Button>
      </section>
    )
  }

  return (
    <section className="bg-ca-surface rounded-2xl border border-ca-border overflow-hidden">
      <div className="px-6 py-4 border-b border-ca-border flex items-center justify-between bg-ca-bg">
        <h3 className="text-base font-semibold text-ca-text">Your Demo Staking Positions</h3>
        <StatusBadge tone="accent">MongoDB Persisted</StatusBadge>
      </div>

      {isLoading ? (
        <div className="p-6 text-sm text-ca-text-muted">Loading staking positions...</div>
      ) : isError ? (
        <div className="p-6 text-sm text-ca-negative">{error?.message}</div>
      ) : (
        <DataTable
          rowKey="_id"
          rows={positions}
          emptyText="No demo staking positions opened yet. Select any vault above to stake Demo Credits."
          columns={[
            {
              key: "poolTitle",
              label: "Vault",
              render: (row) => (
                <div>
                  <p className="font-medium text-ca-text">{row.poolTitle}</p>
                  <p className="text-xs font-mono text-ca-text-muted">
                    {row.lockDays === 0 ? "Flexible" : `${row.lockDays}d schedule`}
                  </p>
                </div>
              ),
            },
            {
              key: "amountCredits",
              label: "Principal",
              align: "right",
              cellClassName: "font-mono tabular-nums text-ca-text font-semibold",
              render: (row) => `${Number(row.amountCredits || 0).toLocaleString()} CR`,
            },
            {
              key: "aprPct",
              label: "APR",
              align: "right",
              cellClassName: "font-mono tabular-nums text-ca-accent",
              render: (row) => `${row.aprPct}%`,
            },
            {
              key: "status",
              label: "Status",
              render: (row) => (
                <StatusBadge tone={row.status === "active" ? "positive" : "neutral"}>
                  {row.status}
                </StatusBadge>
              ),
            },
            {
              key: "action",
              label: "Action",
              align: "right",
              render: (row) =>
                row.status === "active" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    loading={unstakingId === row._id && unstakeMutation.isPending}
                    onClick={() => {
                      setUnstakingId(row._id)
                      unstakeMutation.mutate(row._id)
                    }}
                  >
                    Unstake &amp; Settle
                  </Button>
                ) : (
                  <span className="text-xs font-mono text-ca-text-muted">Settled</span>
                ),
            },
          ]}
        />
      )}
    </section>
  )
}

export default StakingHistory
