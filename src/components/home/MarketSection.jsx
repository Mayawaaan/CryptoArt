import { useState, useRef, useLayoutEffect, useEffect } from "react"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { useNavigate } from "react-router-dom"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CircleArrowRight, BarChart3, PieChart, Activity } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

/* ----------------- Realistic Spark Generator ----------------- */
const generateSparkline = (base) => {
  let price = base
  const volatility = base * 0.05
  return Array.from({ length: 20 }, () => {
    const change = (Math.random() - 0.5) * volatility
    price += change
    return price
  })
}

/* ----------------- Initial Dataset ----------------- */
const initialAssets = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    current_price: 5620000,
    market_cap: 110000000000000,
    volume: 3200000000000,
    price_change_percentage_24h: 1.85,
    sparkline_in_7d: { price: generateSparkline(5600000) },
    type: "crypto"
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    current_price: 305000,
    market_cap: 36000000000000,
    volume: 1800000000000,
    price_change_percentage_24h: -0.92,
    sparkline_in_7d: { price: generateSparkline(300000) },
    type: "crypto"
  },
  {
    id: "USD-INR",
    name: "USD / INR",
    symbol: "USD",
    current_price: 83.12,
    market_cap: 10000000000000,
    volume: 120000000000,
    price_change_percentage_24h: 0.14,
    sparkline_in_7d: { price: generateSparkline(83.12) },
    type: "forex"
  },
  {
    id: "EUR-INR",
    name: "EUR / INR",
    symbol: "EUR",
    current_price: 90.45,
    market_cap: 9000000000000,
    volume: 95000000000,
    price_change_percentage_24h: -0.21,
    sparkline_in_7d: { price: generateSparkline(90.45) },
    type: "forex"
  },
  {
    id: "GBP-INR",
    name: "GBP / INR",
    symbol: "GBP",
    current_price: 105.33,
    market_cap: 8500000000000,
    volume: 78000000000,
    price_change_percentage_24h: 0.32,
    sparkline_in_7d: { price: generateSparkline(105.33) },
    type: "forex"
  }
]

const MarketSection = () => {
  const [assets, setAssets] = useState(initialAssets)
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const headerRef = useRef(null)

  /* 1. Viewport Detection Logic */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  /* 2. Fake Real-Time Updates */
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev =>
        prev.map(asset => {
          const volatility = asset.current_price * 0.005
          const change = (Math.random() - 0.5) * volatility
          const newPrice = asset.current_price + change
          const newSpark = [...asset.sparkline_in_7d.price.slice(1), newPrice]

          return {
            ...asset,
            current_price: newPrice,
            price_change_percentage_24h:
              ((newPrice - asset.sparkline_in_7d.price[0]) / asset.sparkline_in_7d.price[0]) * 100,
            sparkline_in_7d: { price: newSpark },
            volume: asset.volume + Math.floor((Math.random() - 0.2) * 10000)
          }
        })
      )
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  /* 3. GSAP Animation Logic */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "top 20%",
          scrub: 1
        }
      })

      gsap.set(".market-row", { opacity: 0, y: 30 })

      tl.to(headerRef.current, { opacity: 1, x: 0, duration: 1.2 })
        .to(".market-row", { opacity: 1, y: 0, stagger: 0.1 }, "-=0.5")
    }, containerRef)
    return () => ctx.revert()
  }, [isMobile])

  return (
    <section ref={containerRef} className="min-h-screen bg-gray-900 py-16 md:py-24 px-4 md:px-12 text-zinc-300">
      <div className="mx-auto max-w-7xl lg:px-10">
        
        <header ref={headerRef} className="mb-12 border-l-4 border-yellow-400 pl-6 opacity-0 -translate-x-12">
          <h1 className="text-xs md:text-sm uppercase tracking-[0.2em] text-zinc-500 font-bold">Market Overview</h1>
          <p className="text-3xl md:text-5xl italic text-white font-serif mt-2">
            Live Performance <span className="text-yellow-400 font-black not-italic">INR</span>
          </p>
        </header>

        {/* --- CONDITIONAL RENDERING: CARD VIEW vs TABLE VIEW --- */}
        {isMobile ? (
          /* MOBILE VIEW: Cards containing all data vertically */
          <div className="flex flex-col gap-6">
            {assets.map((asset) => {
              const isPositive = asset.price_change_percentage_24h >= 0
              return (
                <div
                  key={asset.id}
                  onClick={() => navigate(`/trade/${asset.id}`)}
                  className="market-row bg-zinc-800/30 border border-zinc-700/50 p-6 rounded-3xl flex flex-col gap-5 active:scale-95 transition-transform"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{asset.symbol}</p>
                      <h3 className="text-xl text-white font-bold leading-none">{asset.name}</h3>
                    </div>
                    <CircleArrowRight size={24} className="text-yellow-400" />
                  </div>

                  <div className="flex items-baseline justify-between border-b border-zinc-800 pb-4">
                    <p className={`text-2xl font-mono font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                      ₹{asset.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <span className={`text-sm px-2 py-1 rounded-lg ${isPositive ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
                      {isPositive ? "+" : ""}{asset.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  </div>

                  {/* High-Density Data Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1"><Activity size={12}/> Volume</span>
                      <span className="text-xs text-zinc-200 font-mono">₹{asset.volume.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1 justify-end"><PieChart size={12}/> Mkt Cap</span>
                      <span className="text-xs text-zinc-200 font-mono">₹{asset.market_cap.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Compact Sparkline */}
                  <div className="h-16 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={asset.sparkline_in_7d.price.map(p => ({ price: p }))}>
                        <Line type="monotone" dataKey="price" stroke={isPositive ? "#facc15" : "#ef4444"} dot={false} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* DESKTOP VIEW: Grid-based table */
          <div className="bg-zinc-900/40 rounded-3xl border border-zinc-800/50 overflow-hidden">
            <div className="grid grid-cols-6 py-5 text-[11px] uppercase tracking-widest text-zinc-500 px-8 border-b border-zinc-800 font-bold bg-zinc-800/20">
              <span>Asset</span>
              <span>7D Trend</span>
              <span className="text-right">Price</span>
              <span className="text-right">24h Volume</span>
              <span className="text-right">Market Cap</span>
              <span className="text-right pr-4">Explore</span>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {assets.map(asset => {
                const isPositive = asset.price_change_percentage_24h >= 0
                return (
                  <div 
                    key={asset.id} 
                    onClick={() => navigate(`/swap`)}
                    className="market-row py-8 grid grid-cols-6 items-center gap-4 cursor-pointer hover:bg-zinc-800/40 transition px-8 group"
                  >
                    <div className="flex flex-col">
                      <p className="text-[10px] text-zinc-500 uppercase font-mono">{asset.symbol}</p>
                      <p className="text-lg text-white font-semibold group-hover:text-yellow-400 transition-colors">{asset.name}</p>
                    </div>
                    <div className="h-12 w-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={asset.sparkline_in_7d.price.map(p => ({ price: p }))}>
                          <Line type="monotone" dataKey="price" stroke={isPositive ? "#facc15" : "#52525b"} dot={false} strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-mono font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                        ₹{asset.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <p className={`text-[11px] ${isPositive ? "text-green-500" : "text-red-500"}`}>
                        {isPositive ? "+" : ""}{asset.price_change_percentage_24h.toFixed(2)}%
                      </p>
                    </div>
                    <div className="text-right text-xs text-zinc-400 font-mono">₹{asset.volume.toLocaleString()}</div>
                    <div className="text-right text-xs text-zinc-400 font-mono">₹{asset.market_cap.toLocaleString()}</div>
                    <div className="flex justify-end pr-4">
                      <CircleArrowRight size={22} className="text-zinc-600 group-hover:text-yellow-400 transition-colors" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex justify-center mt-12">
           <button className="group relative flex items-center gap-2 px-6 py-3 
                          rounded-xl text-amber-400 border border-amber-400 
                          overflow-hidden transition-all duration-300 cursor-pointer">
                          
                          <span className="absolute inset-0 bg-amber-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                          
                          <span className="relative z-10 group-hover:text-black transition-colors duration-300 flex items-center gap-2">
                            View Full Market
                            <CircleArrowRight size={20}/>
                          </span>
                        </button> 
        </div>
      </div>
    </section>
  )
}

export default MarketSection;