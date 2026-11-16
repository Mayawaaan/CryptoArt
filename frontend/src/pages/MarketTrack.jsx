import React from "react"
import { Link } from "react-router-dom"
import Sidebar from "../components/market-track/Sidebar"
import CoinHeader from "../components/market-track/CoinHeader"
import PriceChart from "../components/market-track/PriceChart"
import TradeHistory from "../components/market-track/TradeHistory"
import PageHeader from "../components/ui/PageHeader"
import { MarketProvider } from "../context/MarketContext"

const MarketTrack = () => {
  return (
    <MarketProvider>
      <main className="min-h-screen bg-ca-bg text-ca-text px-4 sm:px-6 py-10">
        <div className="container mx-auto space-y-8">
          <PageHeader
            eyebrow="Market Intelligence"
            title="Live Asset & FX Terminal"
            description="Inspect real-time cryptocurrency spot series, ECB central-bank forex benchmarks, and recent Binance spot executions."
            actions={
              <Link
                to="/swap"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-ca-accent text-ca-text-inverse hover:bg-ca-accent-hover transition-colors"
              >
                Open Swap Desk
              </Link>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 xl:col-span-3">
              <Sidebar />
            </div>

            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              <CoinHeader />
              <PriceChart />
              <TradeHistory />
            </div>
          </div>
        </div>
      </main>
    </MarketProvider>
  )
}

export default MarketTrack
