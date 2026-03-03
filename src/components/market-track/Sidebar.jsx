import { useMarket } from "../../context/MarketContext"
import TrendingCoins from "./TrendingCoins"

const Sidebar = () => {
  const {
    search,
    setSearch,
    activeTab,
    setActiveTab,
  } = useMarket()

  return (
    <div className="space-y-4">

      {/* Search + Tabs Card */}
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 sticky top-4 z-10">

        {/* Search */}
        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg text-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-600"
        />

        {/* Tabs */}
        <div className="flex mt-4 gap-2">
          {["crypto", "forex"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-xs sm:text-sm font-semibold py-2 rounded-md transition-all ${
                activeTab === tab
                  ? "bg-amber-600/20 text-amber-500 border border-amber-600/40"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Coins */}
      <div className="max-h-[400px] lg:max-h-none overflow-y-auto pr-1">
        <TrendingCoins />
      </div>

    </div>
  )
}

export default Sidebar