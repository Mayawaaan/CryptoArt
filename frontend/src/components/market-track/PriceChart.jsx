import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { useMarket } from "../../hooks/useMarket"
import { useTheme } from "../../hooks/useThemeTokens"

const SYMBOL_BY_CURRENCY = { INR: "₹", USD: "$", EUR: "€", GBP: "£" }

const formatAxisTick = (v, currency = "INR") => {
  if (v === null || v === undefined || Number.isNaN(Number(v))) return ""
  const num = Number(v)
  const sym = SYMBOL_BY_CURRENCY[currency] || ""
  if (currency === "INR" && Math.abs(num) >= 100000) {
    return `${sym}${(num / 100000).toFixed(1)}L`
  }
  if (Math.abs(num) >= 1000) return `${sym}${(num / 1000).toFixed(1)}K`
  return `${sym}${num.toFixed(2)}`
}

const formatTooltipPrice = (v, currency = "INR") => {
  if (v === null || v === undefined || Number.isNaN(Number(v))) return "—"
  const locale = currency === "INR" ? "en-IN" : "en-US"
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: Math.abs(v) < 1000 ? 2 : 0,
    maximumFractionDigits: Math.abs(v) < 1000 ? 4 : 2,
  }).format(Number(v))
}

const PriceChart = () => {
  const { chartData, selectedCoin, chartState, vsCurrency } = useMarket()
  const { tokens } = useTheme()

  return (
    <div className="bg-ca-surface rounded-2xl border border-ca-border h-[320px] sm:h-[380px] lg:h-[430px] p-4 sm:p-5 flex flex-col">
      <div className="flex items-center justify-between text-xs font-mono text-ca-text-muted mb-3">
        <span>
          Historical Series · {selectedCoin?.symbol}/{vsCurrency}
        </span>
        {chartState.source && (
          <span>
            {chartState.stale ? "STALE · " : ""}
            {chartState.source}
          </span>
        )}
      </div>

      {chartState.loading && chartData.length === 0 ? (
        <div className="flex-1 rounded-xl bg-ca-surface-raised animate-pulse" />
      ) : chartState.error && chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-ca-text-muted text-center px-4">
          {chartState.error}
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-ca-text-muted">
          No historical points available for this interval.
        </div>
      ) : (
        <div className="flex-1 min-h-[240px] min-w-0">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={200}
            minHeight={240}
            initialDimension={{ width: 640, height: 320 }}
          >
            <LineChart
              key={`${selectedCoin?.symbol}-${vsCurrency}`}
              data={chartData}
              margin={{ left: 4, right: 12, top: 8, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={tokens.chartGrid}
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tick={{ fill: tokens.chartAxis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                minTickGap={28}
              />

              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={(val) => formatAxisTick(val, vsCurrency)}
                tick={{ fill: tokens.chartAxis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={72}
              />

              <Tooltip
                formatter={(value) => [
                  formatTooltipPrice(value, vsCurrency),
                  selectedCoin?.symbol,
                ]}
                cursor={{ stroke: tokens.chartSeries1, strokeWidth: 1 }}
                contentStyle={{
                  backgroundColor: tokens.surfaceRaised,
                  border: `1px solid ${tokens.borderStrong}`,
                  borderRadius: "10px",
                  color: tokens.textPrimary,
                  fontSize: "12px",
                }}
                labelStyle={{ color: tokens.textMuted }}
              />

              <Line
                type="monotone"
                dataKey="price"
                stroke={tokens.chartSeries1}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default PriceChart
