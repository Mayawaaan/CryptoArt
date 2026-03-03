import React, { useState, useEffect } from "react"
import { TOKENS } from "../../data/currency"

import SwapHeader from "./SwapHeader"
import SwapInputBox from "./SwapInputBox"
import SwapSwitchButton from "./SwapSwitchButton"
import SwapDetails from "./SwapDetails"
import SwapActionButton from "./SwapActionButton"
import TokenModal from "./TokenModal"

const decimalRegex = /^[0-9]*\.?[0-9]*$/
const roundTo6 = (num) => Math.round(num * 1e6) / 1e6

const SwapComponent = () => {
  const [tokens, setTokens] = useState(TOKENS)

  const [payToken, setPayToken] = useState(
    TOKENS.find((t) => t.id === "eth")
  )
  const [receiveToken, setReceiveToken] = useState(
    TOKENS.find((t) => t.id === "inr")
  )

  const [payAmount, setPayAmount] = useState("1.0")
  const [receiveAmount, setReceiveAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSide, setModalSide] = useState(null)

  /* ---------------- Conversion (INR Base via price) ---------------- */

  useEffect(() => {
    if (!payToken || !receiveToken) return

    const num = parseFloat(payAmount)
    if (isNaN(num)) {
      setReceiveAmount("")
      return
    }

    const rate = payToken.price / receiveToken.price
    setReceiveAmount(roundTo6(num * rate).toString())
  }, [payAmount, payToken, receiveToken])

  const handlePayChange = (e) => {
    const val = e.target.value
    if (decimalRegex.test(val)) setPayAmount(val)
  }

  const handleReceiveChange = (e) => {
    const val = e.target.value
    if (!decimalRegex.test(val)) return

    setReceiveAmount(val)

    if (!val) {
      setPayAmount("")
      return
    }

    const num = parseFloat(val)
    if (!isNaN(num)) {
      const rate = receiveToken.price / payToken.price
      setPayAmount(roundTo6(num * rate).toString())
    }
  }

  /* ---------------- Switch ---------------- */

  const handleSwitch = () => {
    setPayToken(receiveToken)
    setReceiveToken(payToken)
    setPayAmount(receiveAmount)
    setReceiveAmount(payAmount)
  }

  /* ---------------- Swap Action ---------------- */

  const handleSwapAction = () => {
    if (
      !payAmount ||
      parseFloat(payAmount) <= 0 ||
      payToken.id === receiveToken.id
    )
      return

    if (parseFloat(payAmount) > parseFloat(payToken.balance)) {
      alert(`Insufficient ${payToken.symbol} balance.`)
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      const updated = tokens.map((t) => {
        if (t.id === payToken.id) {
          return {
            ...t,
            balance: roundTo6(
              parseFloat(t.balance) - parseFloat(payAmount)
            ).toString(),
          }
        }
        if (t.id === receiveToken.id) {
          return {
            ...t,
            balance: roundTo6(
              parseFloat(t.balance) + parseFloat(receiveAmount)
            ).toString(),
          }
        }
        return t
      })

      setTokens(updated)
      setPayToken(updated.find((t) => t.id === payToken.id))
      setReceiveToken(updated.find((t) => t.id === receiveToken.id))

      setIsLoading(false)
      setPayAmount("1.0")
    }, 1000)
  }

  /* ---------------- INR Value Display ---------------- */

  const getInrValue = (amount, token) => {
    const val = parseFloat(amount)
    if (isNaN(val)) return "₹0.00"

    return (val * token.price).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    })
  }

  if (!payToken || !receiveToken) return null

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white px-4">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6">
          
          <SwapHeader />

          <SwapInputBox
            label="You Pay"
            amount={payAmount}
            onChange={handlePayChange}
            token={payToken}
            usdValue={getInrValue(payAmount, payToken)}
            onTokenClick={() => {
              setModalSide("pay")
              setIsModalOpen(true)
            }}
            accent="amber"
          />

          <SwapSwitchButton onClick={handleSwitch} />

          <SwapInputBox
            label="You Receive"
            amount={receiveAmount}
            onChange={handleReceiveChange}
            token={receiveToken}
            usdValue={getInrValue(receiveAmount, receiveToken)}
            onTokenClick={() => {
              setModalSide("receive")
              setIsModalOpen(true)
            }}
            accent="sky"
          />

          <SwapDetails
            payToken={payToken}
            receiveToken={receiveToken}
            roundTo6={roundTo6}
          />

          <SwapActionButton
            onClick={handleSwapAction}
            isLoading={isLoading}
            payAmount={payAmount}
            payToken={payToken}
          />
        </div>
      </div>

      <TokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(token) => {
          if (modalSide === "pay") setPayToken(token)
          else setReceiveToken(token)
        }}
        selectedTokenId={
          modalSide === "pay" ? receiveToken.id : payToken.id
        }
        tokens={tokens}
      />
    </>
  )
}

export default SwapComponent