import { Loader2 } from "lucide-react"

const SwapActionButton = ({
  onClick,
  isLoading,
  payAmount,
  payToken,
}) => {
  const insufficient =
    parseFloat(payAmount) > parseFloat(payToken.balance)

  return (
    <button
      onClick={onClick}
      disabled={
        isLoading ||
        !payAmount ||
        parseFloat(payAmount) <= 0 ||
        insufficient
      }
      className="w-full mt-6 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold py-4 rounded-2xl disabled:opacity-50 flex justify-center items-center gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Swapping...
        </>
      ) : insufficient ? (
        `Insufficient ${payToken.symbol}`
      ) : (
        "Swap"
      )}
    </button>
  )
}

export default SwapActionButton