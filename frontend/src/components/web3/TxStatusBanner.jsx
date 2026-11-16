import { ExternalLink, Loader2 } from "lucide-react"
import { getExplorerTxUrl } from "../../web3/wagmiConfig"

const TxStatusBanner = ({ status, message, txHash, chainId }) => {
  if (!status || status === "idle") return null

  const explorerUrl = getExplorerTxUrl(chainId, txHash)

  const toneClass =
    status === "confirmed"
      ? "bg-ca-positive-bg border-ca-accent-border text-ca-positive"
      : status === "error" || status === "reverted"
      ? "bg-ca-negative-bg border-ca-border-strong text-ca-negative"
      : "bg-ca-surface-raised border-ca-border text-ca-text-secondary"

  return (
    <div role="status" className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${toneClass}`}>
      <div className="flex items-center gap-2 font-semibold">
        {(status === "simulating" || status === "pending") && (
          <Loader2 size={14} className="animate-spin shrink-0" />
        )}
        <span className="uppercase font-mono tracking-wider">
          {status === "simulating"
            ? "Simulating"
            : status === "pending"
            ? "Pending Confirmation"
            : status === "confirmed"
            ? "On-Chain Confirmed"
            : "Transaction Failed"}
        </span>
      </div>

      {message && <p className="leading-relaxed">{message}</p>}

      {txHash && (
        <div className="flex items-center justify-between gap-2 pt-1 font-mono text-[11px] text-ca-text-muted">
          <span className="truncate">Tx: {txHash}</span>
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-ca-accent hover:underline shrink-0"
            >
              Explorer <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default TxStatusBanner
