import React from "react"
import { useMarket } from "../../hooks/useMarket"
import Tabs from "../ui/Tabs"
import { Input } from "../ui/Input"
import TrendingCoins from "./TrendingCoins"

const Sidebar = () => {
  const { search, setSearch, activeTab, setActiveTab } = useMarket()

  return (
    <div className="space-y-4 lg:sticky lg:top-20">
      <div className="bg-ca-surface p-4 rounded-2xl border border-ca-border space-y-3">
        <Input
          id="market-asset-search"
          type="text"
          aria-label="Search assets"
          placeholder="Filter by symbol or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          layoutId="market-asset-class"
          ariaLabel="Asset classes"
          className="w-full grid grid-cols-2"
          items={[
            { value: "crypto", label: "Crypto" },
            { value: "forex", label: "Forex (ECB)" },
          ]}
        />
      </div>

      <div className="max-h-[380px] lg:max-h-[580px] overflow-y-auto pr-0.5">
        <TrendingCoins />
      </div>
    </div>
  )
}

export default Sidebar
