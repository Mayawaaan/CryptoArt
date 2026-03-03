import { ChevronDown } from "lucide-react"

const SwapInputBox = ({
  label,
  amount,
  onChange,
  token,
  onTokenClick,
  usdValue,
  accent,
}) => {
  const accentStyle =
    accent === "amber"
      ? "bg-amber-400/20 text-amber-400"
      : "bg-sky-400/20 text-sky-400"

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-xs text-gray-500">
          Balance: {token.balance} {token.symbol}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <input
          type="text"
          value={amount}
          onChange={onChange}
          className="bg-transparent text-3xl font-bold outline-none w-1/2"
        />

        <button
          onClick={onTokenClick}
          className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl"
        >
          {token.icon ? (
            <img src={token.icon} className="w-6 h-6 rounded-full" />
          ) : (
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${accentStyle}`}>
              {token.symbolChar || token.symbol.charAt(0)}
            </div>
          )}
          <span className="font-semibold">{token.symbol}</span>
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="text-xs text-gray-500 mt-2">{usdValue}</div>
    </div>
  )
}

export default SwapInputBox