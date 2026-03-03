import Sidebar from "../components/market-track/Sidebar"
import CoinHeader from "../components/market-track/CoinHeader"
import PriceChart from "../components/market-track/PriceChart"
import TradeHistory from "../components/market-track/TradeHistory"
import { MarketProvider } from "../context/MarketContext"

const MarketTrack = () => {
  return (
    <MarketProvider>
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <CoinHeader />
            <PriceChart />
            <TradeHistory />
          </div>

        </div>

      </div>
    </MarketProvider>
  )
}

export default MarketTrack