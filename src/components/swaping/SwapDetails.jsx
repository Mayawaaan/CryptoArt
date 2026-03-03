const SwapDetails = ({ payToken, receiveToken, roundTo6 }) => (
  <div className="bg-black/30 rounded-xl p-3 mt-4 text-xs text-gray-400 space-y-1">
    <div className="flex justify-between">
      <span>Rate</span>
      <span>
        1 {payToken.symbol} ={" "}
        {roundTo6(payToken.price / receiveToken.price)}{" "}
        {receiveToken.symbol}
      </span>
    </div>

    <div className="flex justify-between">
      <span>Slippage</span>
      <span>0.5%</span>
    </div>

    <div className="flex justify-between">
      <span>Network Fee</span>
      <span>₹ 0.42</span>
    </div>
  </div>
)

export default SwapDetails