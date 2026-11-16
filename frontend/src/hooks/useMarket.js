import { useContext } from "react"
import { MarketContext } from "../context/marketContextObject"

export const useMarket = () => {
  const context = useContext(MarketContext)
  if (!context) {
    throw new Error("useMarket must be used inside MarketProvider")
  }
  return context
}
