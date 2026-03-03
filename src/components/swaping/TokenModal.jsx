import React, { useState, useMemo, useEffect, memo } from "react"
import { createPortal } from "react-dom"
import { X, Search } from "lucide-react"

const TokenModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedTokenId,
  tokens,
}) => {
  const [search, setSearch] = useState("")

  /* ✅ Proper Scroll Lock (Safe Version) */
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden"
      document.body.style.overflow = "hidden"
    } else {
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
    }

    return () => {
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const filteredTokens = useMemo(() => {
    if (!tokens) return []

    return tokens.filter(
      (t) =>
        (t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.symbol.toLowerCase().includes(search.toLowerCase())) &&
        t.id !== selectedTokenId
    )
  }, [search, selectedTokenId, tokens])

  const cryptoTokens = filteredTokens.filter((t) => t.type === "crypto")
  const forexTokens = filteredTokens.filter((t) => t.type === "forex")

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm">

      {/* Fullscreen Center Wrapper */}
      <div className="w-full h-full flex items-center justify-center">

        {/* Modal Box */}
        <div className="bg-gray-900 border border-gray-800 w-full max-w-md h-[520px] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">
                Select Token
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="relative mt-4">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search token..."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-amber-500 text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Scroll Area */}
          <div
            className="flex-1 overflow-y-auto"
            style={{ overscrollBehavior: "contain" }}
          >
            {cryptoTokens.length > 0 && (
              <div className="text-gray-500 text-sm font-semibold px-4 pt-3 pb-2">
                Crypto
              </div>
            )}

            {cryptoTokens.map((token) => (
              <TokenButton
                key={token.id}
                token={token}
                onSelect={onSelect}
                onClose={onClose}
              />
            ))}

            {forexTokens.length > 0 && (
              <div className="text-gray-500 text-sm font-semibold px-4 pt-4 pb-2">
                Forex
              </div>
            )}

            {forexTokens.map((token) => (
              <TokenButton
                key={token.id}
                token={token}
                onSelect={onSelect}
                onClose={onClose}
              />
            ))}
          </div>

        </div>
      </div>
    </div>,
    document.body
  )
}

/* ---------------- Token Button ---------------- */

const TokenButton = memo(({ token, onSelect, onClose }) => {
  return (
    <button
      onClick={() => {
        onSelect(token)
        onClose()
      }}
      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-center gap-3">
        {token.icon ? (
          <img
            src={token.icon}
            alt={token.symbol}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              token.type === "crypto"
                ? "bg-green-500/20 text-green-500"
                : "bg-sky-500/20 text-sky-500"
            }`}
          >
            {token.symbolChar || token.symbol.charAt(0)}
          </div>
        )}

        <div className="text-left">
          <div className="font-bold text-white">
            {token.symbol}
          </div>
          <div className="text-xs text-gray-500">
            {token.name}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-400">
        {token.balance}
      </div>
    </button>
  )
})

export default TokenModal