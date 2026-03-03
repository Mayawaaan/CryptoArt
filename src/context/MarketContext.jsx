import { createContext, useContext, useEffect, useState, useMemo } from "react"
import { TOKENS } from "../data/currency"

const MarketContext = createContext()

export const MarketProvider = ({ children }) => {
  const [selectedCoin, setSelectedCoin] = useState(TOKENS[0])
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("crypto")

  const [price, setPrice] = useState(Number(TOKENS[0].price))
  const [chartData, setChartData] = useState([])
  const [change, setChange] = useState(0)

  // 🔎 Filter coins
  const filteredCoins = useMemo(() => {
    return TOKENS.filter((coin) => {
      const matchesTab = coin.type === activeTab
      const matchesSearch =
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())

      return matchesTab && matchesSearch
    })
  }, [search, activeTab])

  // ✅ Reset when coin changes
  useEffect(() => {
    const basePrice = Number(selectedCoin.price)

    setPrice(basePrice)
    setChange(0)

    setChartData([
      {
        time: new Date().toLocaleTimeString(),
        price: basePrice,
      },
    ])
  }, [selectedCoin])

  // ✅ Live price simulation
  useEffect(() => {
    const basePrice = Number(selectedCoin.price)

    const interval = setInterval(() => {
      setPrice((prev) => {
        const volatility =
          selectedCoin.type === "crypto" ? 0.01 : 0.002

        const newPrice =
          prev * (1 + (Math.random() - 0.5) * volatility)

        const formattedPrice = Number(newPrice.toFixed(6))

        const newChange =
          ((formattedPrice - basePrice) / basePrice) * 100

        setChange(Number(newChange.toFixed(2)))

        // 🔥 Update chart data
        setChartData((prevData) => {
          const updated = [
            ...prevData,
            {
              time: new Date().toLocaleTimeString(),
              price: formattedPrice,
            },
          ]

          if (updated.length > 30) updated.shift()

          return updated
        })

        return formattedPrice
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [selectedCoin])

  return (
    <MarketContext.Provider
      value={{
        filteredCoins,
        selectedCoin,
        setSelectedCoin,
        search,
        setSearch,
        activeTab,
        setActiveTab,
        price,
        change,
        chartData, // 🔥 YOU FORGOT THIS
      }}
    >
      {children}
    </MarketContext.Provider>
  )
}

export const useMarket = () => {
  const context = useContext(MarketContext)
  if (!context) {
    throw new Error("useMarket must be used inside MarketProvider")
  }
  return context
}

export default MarketContext