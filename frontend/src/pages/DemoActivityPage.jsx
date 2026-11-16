import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import PageHeader from "../components/ui/PageHeader"
import Button from "../components/ui/Button"
import StatusBadge from "../components/ui/StatusBadge"
import DataTable from "../components/ui/DataTable"
import EmptyState from "../components/ui/EmptyState"
import { fetchDemoTransactions } from "../services/demoApi"
import { useDemoWallet } from "../hooks/useDemoWallet"

const DemoActivityPage = () => {
  const { wallet, isActive, databaseConnected, unavailableReason, openWalletModal } =
    useDemoWallet()
  const [page, setPage] = useState(1)

  const txQuery = useQuery({
    queryKey: ["demo-transactions", page],
    queryFn: ({ signal }) => fetchDemoTransactions({ page, limit: 20 }, signal),
    enabled: databaseConnected && isActive,
    retry: false,
  })

  const items = txQuery.data?.data?.items || []
  const pagination = txQuery.data?.data?.pagination || { page: 1, totalPages: 1, total: 0 }

  return (
    <main className="min-h-screen bg-ca-bg text-ca-text px-4 sm:px-6 py-10">
      <div className="container mx-auto space-y-8">
        <PageHeader
          eyebrow="Simulated Ledger"
          title="Demo Wallet Activity"
          description="Chronological MongoDB ledger of simulated swaps, staking allocations, NFT purchases, and credit resets."
          actions={
            isActive && (
              <Button variant="outline" size="sm" onClick={() => openWalletModal("demo")}>
                Manage / Reset Demo Wallet
              </Button>
            )
          }
        />

        {!databaseConnected ? (
          <EmptyState title="Database Required" description={unavailableReason} />
        ) : !isActive ? (
          <EmptyState
            title="No Active Demo Session"
            description="Start a Demo Wallet session to view and record simulated transactions."
            action={
              <Button variant="primary" onClick={() => openWalletModal("demo")}>
                Start Demo Session (10,000 CR)
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-ca-surface border border-ca-border rounded-2xl p-5">
                <span className="text-xs text-ca-text-muted uppercase tracking-wider block">
                  Demo Account ID
                </span>
                <span className="text-sm font-mono font-semibold text-ca-text mt-1 block">
                  {wallet.accountId}
                </span>
              </div>
              <div className="bg-ca-surface border border-ca-border rounded-2xl p-5">
                <span className="text-xs text-ca-text-muted uppercase tracking-wider block">
                  Available Demo Balance
                </span>
                <span className="text-xl font-mono tabular-nums font-semibold text-ca-accent mt-1 block">
                  {Number(wallet.balanceCredits || 0).toLocaleString()} CR
                </span>
              </div>
              <div className="bg-ca-surface border border-ca-border rounded-2xl p-5">
                <span className="text-xs text-ca-text-muted uppercase tracking-wider block">
                  Execution Nature
                </span>
                <span className="text-xs text-ca-text-secondary mt-1.5 block">
                  Simulated — No blockchain transaction
                </span>
              </div>
            </div>

            <div className="bg-ca-surface border border-ca-border rounded-2xl overflow-hidden">
              {txQuery.isLoading ? (
                <div className="p-6 text-sm text-ca-text-muted">Loading simulated ledger...</div>
              ) : txQuery.isError ? (
                <div className="p-6 text-sm text-ca-negative">{txQuery.error?.message}</div>
              ) : (
                <DataTable
                  rowKey="_id"
                  rows={items}
                  emptyText="No transactions logged yet."
                  columns={[
                    {
                      key: "demoTxId",
                      label: "Reference ID",
                      cellClassName: "font-mono text-xs text-ca-text-muted",
                    },
                    {
                      key: "type",
                      label: "Type",
                      render: (row) => <StatusBadge tone="accent">{row.type}</StatusBadge>,
                    },
                    {
                      key: "note",
                      label: "Summary",
                      cellClassName: "text-xs sm:text-sm text-ca-text-secondary",
                    },
                    {
                      key: "amountCredits",
                      label: "Credits",
                      align: "right",
                      cellClassName: "font-mono tabular-nums text-ca-text font-semibold",
                      render: (row) => `${Number(row.amountCredits || 0).toLocaleString()} CR`,
                    },
                    {
                      key: "createdAt",
                      label: "Timestamp",
                      align: "right",
                      cellClassName: "font-mono text-xs text-ca-text-muted",
                      render: (row) =>
                        row.createdAt
                          ? new Date(row.createdAt).toLocaleString("en-US", {
                              month: "short",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })
                          : "--",
                    },
                  ]}
                />
              )}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-ca-text-muted">
                  Page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

export default DemoActivityPage
