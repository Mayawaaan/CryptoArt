import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { useMarket } from "../../context/MarketContext"

const PriceChart = () => {
  const { chartData, selectedCoin } = useMarket()

  const formatINR = (num) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num)

  return (
    <div
      className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm
                 h-[300px] sm:h-[350px] lg:h-[450px] p-4"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          key={selectedCoin.symbol} // 🔥 force remount on coin change
          data={chartData}
          margin={{ left: -10, right: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#374151"
            vertical={false}
          />

          <XAxis dataKey="time" hide />

          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
            tick={{ fill: "#9CA3AF", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={55}
          />

          <Tooltip
            formatter={(value) => formatINR(value)}
            cursor={{ stroke: "#d97706", strokeWidth: 1 }}
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />

          <Line
            type="monotone"
            dataKey="price" // ✅ correct usage
            stroke="#d97706"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PriceChart