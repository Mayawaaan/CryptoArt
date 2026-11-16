import React from "react"
import { Link } from "react-router-dom"
import feeTiers from "../data/TradingFee"
import PageHeader from "../components/ui/PageHeader"
import DataTable from "../components/ui/DataTable"

const TradingFee = () => {
  return (
    <main className="min-h-screen bg-ca-bg text-ca-text-secondary px-4 sm:px-6 py-10">
      <div className="container mx-auto space-y-10">
        <PageHeader
          eyebrow="Exchange Schedule"
          title="Trading Fee Reference"
          description="Volume-based maker and taker benchmarks alongside simulated demo execution disclosure."
        />

        <div className="bg-ca-surface border border-ca-border rounded-2xl overflow-hidden">
          <DataTable
            rowKey="volume"
            rows={feeTiers}
            columns={[
              {
                key: "volume",
                label: "30-Day Volume (USD)",
                cellClassName: "font-mono tabular-nums text-ca-text",
              },
              {
                key: "maker",
                label: "Maker Fee",
                align: "right",
                cellClassName: "font-mono tabular-nums font-semibold text-ca-accent",
              },
              {
                key: "taker",
                label: "Taker Fee",
                align: "right",
                cellClassName: "font-mono tabular-nums text-ca-text-secondary",
              },
            ]}
          />
        </div>

        <div className="rounded-2xl bg-ca-surface border border-ca-border p-6 space-y-2 text-xs sm:text-sm text-ca-text-secondary">
          <p className="font-semibold text-ca-text">Execution Disclosures</p>
          <p>Demo Wallet conversions charge 1 simulated Demo Credit per swap with zero real custody.</p>
          <p>On-chain CryptoArtSwapPool prototype swaps apply a deterministic 0.30% LP fee on testnet reserves.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 border-t border-ca-divider pt-8">
          <Link
            to="/security"
            className="bg-ca-surface border border-ca-border rounded-2xl p-6 hover:border-ca-accent transition-colors space-y-1.5"
          >
            <h2 className="text-base font-semibold text-ca-text">Security Architecture</h2>
            <p className="text-xs text-ca-text-muted">Review audit scope and wallet boundaries.</p>
          </Link>

          <Link
            to="/privacy-policy"
            className="bg-ca-surface border border-ca-border rounded-2xl p-6 hover:border-ca-accent transition-colors space-y-1.5"
          >
            <h2 className="text-base font-semibold text-ca-text">Privacy Policy</h2>
            <p className="text-xs text-ca-text-muted">Inspect session storage and data handling.</p>
          </Link>

          <Link
            to="/submit-request"
            className="bg-ca-surface border border-ca-border rounded-2xl p-6 hover:border-ca-accent transition-colors space-y-1.5"
          >
            <h2 className="text-base font-semibold text-ca-text">Submit Request</h2>
            <p className="text-xs text-ca-text-muted">Open a technical or account inquiry.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default TradingFee
