import React, { useState, useMemo, useEffect, memo } from "react"
import { createPortal } from "react-dom"
import { X, Search } from "lucide-react"

const TokenModal = ({ isOpen, onClose, onSelect, selectedTokenId, tokens }) => {
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!isOpen) return undefined

    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

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
    <div
      className="fixed inset-0 z-[9999] bg-ca-bg/80 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Select asset"
      onClick={onClose}
    >
      <div
        className="bg-ca-surface border border-ca-border w-full max-w-md h-[520px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-ca-border">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold text-ca-text">Select Asset</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close asset selector"
              className="cursor-pointer p-1.5 text-ca-text-muted hover:text-ca-text hover:bg-ca-surface-raised rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative mt-3">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ca-text-muted"
              size={16}
              aria-hidden="true"
            />
            <label htmlFor="swap-token-search" className="sr-only">
              Search token
            </label>
            <input
              id="swap-token-search"
              type="text"
              placeholder="Search token or currency..."
              className="w-full bg-ca-bg border border-ca-border rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-ca-accent text-ca-text placeholder:text-ca-text-muted"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-ca-divider" style={{ overscrollBehavior: "contain" }}>
          {cryptoTokens.length > 0 && (
            <div className="text-ca-text-muted text-xs uppercase tracking-wider font-semibold px-4 pt-3 pb-2 bg-ca-surface-raised">
              Crypto
            </div>
          )}

          {cryptoTokens.map((token) => (
            <TokenButton key={token.id} token={token} onSelect={onSelect} onClose={onClose} />
          ))}

          {forexTokens.length > 0 && (
            <div className="text-ca-text-muted text-xs uppercase tracking-wider font-semibold px-4 pt-3 pb-2 bg-ca-surface-raised">
              Fiat Reference
            </div>
          )}

          {forexTokens.map((token) => (
            <TokenButton key={token.id} token={token} onSelect={onSelect} onClose={onClose} />
          ))}

          {filteredTokens.length === 0 && (
            <p className="p-6 text-center text-sm text-ca-text-muted">No matching assets.</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

const TokenButton = memo(({ token, onSelect, onClose }) => {
  return (
    <button
      type="button"
      onClick={() => {
        onSelect(token)
        onClose()
      }}
      className="cursor-pointer w-full flex items-center justify-between px-4 py-3 hover:bg-ca-surface-raised transition-colors"
    >
      <div className="flex items-center gap-3">
        {token.icon ? (
          <img src={token.icon} alt={token.symbol} className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-ca-accent-soft text-ca-accent border border-ca-accent-border">
            {token.symbolChar || token.symbol.charAt(0)}
          </div>
        )}

        <div className="text-left">
          <div className="font-semibold text-sm text-ca-text">{token.symbol}</div>
          <div className="text-xs text-ca-text-muted">{token.name}</div>
        </div>
      </div>

      <div className="text-xs font-mono text-ca-text-secondary">{token.balance}</div>
    </button>
  )
})

export default TokenModal
