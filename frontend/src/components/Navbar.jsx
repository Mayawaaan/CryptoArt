import React, { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { Menu, Moon, Sun, Wallet, X } from "lucide-react"
import { useAccount } from "wagmi"
import navlinks from "../data/navlinks"
import { isSupportedChainId, shortenAddress } from "../web3/wagmiConfig"
import { useDemoWallet } from "../hooks/useDemoWallet"
import { useTheme } from "../hooks/useThemeTokens"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { address, isConnected, chainId } = useAccount()
  const { wallet: demoWallet, isActive: isDemoActive, openWalletModal } = useDemoWallet()
  const { colorMode, toggleColorMode } = useTheme()

  const wrongNetwork = isConnected && !isSupportedChainId(chainId)
  const isLight = colorMode === "light"

  let triggerLabel = "Try Demo / Wallet"
  let triggerStyle = "bg-ca-accent text-ca-text-inverse hover:bg-ca-accent-hover"

  if (wrongNetwork) {
    triggerLabel = `Wrong Net · ${shortenAddress(address)}`
    triggerStyle = "bg-ca-warning-bg text-ca-warning border border-ca-border-strong"
  } else if (isConnected) {
    triggerLabel = `Testnet · ${shortenAddress(address)}`
    triggerStyle =
      "bg-ca-surface-raised text-ca-accent border border-ca-accent-border hover:bg-ca-accent-soft"
  } else if (isDemoActive) {
    triggerLabel = `Demo · ${Number(demoWallet.balanceCredits || 0).toLocaleString()} CR`
    triggerStyle =
      "bg-ca-surface-raised text-ca-accent border border-ca-accent-border hover:bg-ca-accent-soft"
  }

  return (
    <header className="sticky top-0 z-50 bg-ca-surface/95 backdrop-blur-md border-b border-ca-border">
      <nav
        aria-label="Primary navigation"
        className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4"
      >
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="CryptoArt Home">
          <img
            className="h-9 w-9 object-contain shrink-0"
            src="/logo/logoMark.png"
            alt=""
            aria-hidden="true"
          />
          <span className="text-lg font-semibold tracking-tight text-ca-text">
            Crypto<span className="text-ca-accent">Art</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navlinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              end={link.href === "/"}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-ca-accent-soft text-ca-accent border border-ca-accent-border"
                    : "text-ca-text-secondary hover:text-ca-text hover:bg-ca-surface-raised"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Theme Toggle + Wallet / Demo CTA */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleColorMode}
            aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
            title={isLight ? "Switch to dark mode" : "Switch to light mode"}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-ca-bg border border-ca-border text-ca-text-secondary hover:border-ca-accent hover:text-ca-accent transition-colors"
          >
            {isLight ? (
              <>
                <Moon size={14} aria-hidden="true" />
                <span>Dark</span>
              </>
            ) : (
              <>
                <Sun size={14} aria-hidden="true" />
                <span>Light</span>
              </>
            )}
          </button>

          {isConnected && isDemoActive && (
            <button
              type="button"
              onClick={() => openWalletModal("demo")}
              className="cursor-pointer px-3 py-2 rounded-lg text-xs font-mono tabular-nums bg-ca-bg border border-ca-border text-ca-text-secondary hover:border-ca-accent hover:text-ca-accent transition-colors"
            >
              Demo · {Number(demoWallet.balanceCredits || 0).toLocaleString()} CR
            </button>
          )}
          <button
            type="button"
            onClick={() => openWalletModal(isConnected ? "evm" : "demo")}
            className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${triggerStyle}`}
          >
            <Wallet size={14} aria-hidden="true" />
            <span className="font-mono tabular-nums">{triggerLabel}</span>
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={toggleColorMode}
            aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
            title={isLight ? "Switch to dark mode" : "Switch to light mode"}
            className="cursor-pointer p-2 rounded-lg bg-ca-bg border border-ca-border text-ca-text-secondary hover:text-ca-accent hover:border-ca-accent transition-colors"
          >
            {isLight ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
          </button>

          <button
            type="button"
            onClick={() => openWalletModal(isConnected ? "evm" : "demo")}
            className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${triggerStyle}`}
          >
            <Wallet size={13} aria-hidden="true" />
            <span className="truncate max-w-[115px]">{triggerLabel}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            className="cursor-pointer p-2 rounded-lg text-ca-text hover:bg-ca-surface-raised transition-colors"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="lg:hidden overflow-hidden border-t border-ca-border bg-ca-surface"
          >
            <div className="flex flex-col p-4 space-y-1.5">
              {navlinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  end={link.href === "/"}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-ca-accent-soft text-ca-accent border border-ca-accent-border"
                        : "text-ca-text-secondary hover:text-ca-text hover:bg-ca-surface-raised"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-2 flex flex-wrap gap-2">
                <Link
                  to="/nft-gallery/create"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center px-3 py-2 rounded-xl text-xs font-semibold bg-ca-surface-raised border border-ca-border text-ca-text"
                >
                  Create NFT
                </Link>
                <Link
                  to="/demo-activity"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center px-3 py-2 rounded-xl text-xs font-semibold bg-ca-surface-raised border border-ca-border text-ca-text"
                >
                  Demo Activity
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
