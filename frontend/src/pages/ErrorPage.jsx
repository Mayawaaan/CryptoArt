import React from "react"
import { ArrowRight, RotateCcw } from "lucide-react"
import StatusBadge from "../components/ui/StatusBadge"
import Button from "../components/ui/Button"

const ErrorPage = ({
  error,
  onReset,
  title = "Unexpected Workspace Interruption",
  code = "ERR_RUNTIME_BOUNDARY",
}) => {
  const message =
    error?.message ||
    "An unexpected client error or network chunk interruption occurred while rendering this view."

  const handleReload = () => {
    if (typeof onReset === "function") {
      onReset()
    } else if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

  const handleGoHome = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
  }

  return (
    <main className="min-h-[82vh] bg-ca-bg text-ca-text flex items-center justify-center px-4 sm:px-6 py-16">
      <div className="w-full max-w-2xl bg-ca-surface border border-ca-border rounded-2xl p-8 sm:p-10 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ca-divider pb-5">
          <div className="flex items-center gap-3">
            <img
              src="/logo/logoMark.png"
              alt=""
              aria-hidden="true"
              className="w-9 h-9 object-contain"
            />
            <StatusBadge tone="negative">{code}</StatusBadge>
          </div>
          <span className="text-xs font-mono text-ca-text-muted">Recovery Mode</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ca-text">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-ca-text-secondary leading-relaxed">
            CryptoArt caught an unhandled exception before it could corrupt your session state.
            Your Demo Wallet credits and connected Web3 state remain intact.
          </p>
        </div>

        <div className="rounded-xl bg-ca-bg border border-ca-border p-4 space-y-1.5">
          <p className="text-[11px] font-mono uppercase tracking-wider text-ca-accent font-semibold">
            Diagnostic Details
          </p>
          <p className="text-xs font-mono text-ca-text-secondary break-words leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button variant="primary" size="lg" onClick={handleReload}>
            <RotateCcw size={15} aria-hidden="true" />
            Try Again / Reload View
          </Button>

          <Button variant="secondary" size="lg" onClick={handleGoHome}>
            Return to Safe Home
            <ArrowRight size={15} aria-hidden="true" />
          </Button>

          <a
            href="/submit-request"
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium bg-ca-bg border border-ca-border text-ca-text-secondary hover:border-ca-accent hover:text-ca-accent transition-colors"
          >
            Report Issue
          </a>
        </div>
      </div>
    </main>
  )
}

export default ErrorPage
