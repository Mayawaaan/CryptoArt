import { createConfig, http } from "wagmi"
import { hardhat as baseHardhat, sepolia } from "wagmi/chains"
import { injected } from "wagmi/connectors"
import staticDeployments from "../contracts/deployments.json"

const rawHardhatRpc = (
  import.meta.env.VITE_HARDHAT_RPC_URL?.trim() ||
  import.meta.env.VITE_CONTRACTS_RPC_URL?.trim() ||
  "http://127.0.0.1:8545"
)
  .replace(/^(https?:\/\/)+(https?:?\/\/)/i, "https://")
  .replace(/^https\/\//i, "https://")

export const HARDHAT_RPC_URL = rawHardhatRpc.replace(/\/+$/, "")

const sepoliaRpc = import.meta.env.VITE_SEPOLIA_RPC_URL?.trim() || undefined

export const hardhatChain = {
  ...baseHardhat,
  name: HARDHAT_RPC_URL.includes("127.0.0.1") || HARDHAT_RPC_URL.includes("localhost")
    ? "Hardhat Local"
    : "CryptoArt Render RPC",
  rpcUrls: {
    default: { http: [HARDHAT_RPC_URL] },
    public: { http: [HARDHAT_RPC_URL] },
  },
}

export const SUPPORTED_CHAINS = [hardhatChain, sepolia]

export const wagmiConfig = createConfig({
  chains: SUPPORTED_CHAINS,
  connectors: [injected()],
  transports: {
    [hardhatChain.id]: http(HARDHAT_RPC_URL),
    [sepolia.id]: http(sepoliaRpc),
  },
})

const runtimeDeployments = { ...staticDeployments }

if (typeof window !== "undefined" && HARDHAT_RPC_URL) {
  fetch(`${HARDHAT_RPC_URL}/deployments`)
    .then((res) => (res.ok ? res.json() : null))
    .then((json) => {
      if (json && typeof json === "object") {
        Object.assign(runtimeDeployments, json)
      }
    })
    .catch(() => {
      // Fallback to staticDeployments bundled in frontend/src/contracts/deployments.json
    })
}

export function isSupportedChainId(chainId) {
  return SUPPORTED_CHAINS.some((c) => c.id === chainId)
}

export function getChainContracts(chainId) {
  if (!chainId) return null
  return runtimeDeployments[String(chainId)]?.contracts || null
}

export function getExplorerTxUrl(chainId, txHash) {
  if (!txHash) return null
  if (chainId === sepolia.id) {
    return `https://sepolia.etherscan.io/tx/${txHash}`
  }
  return null
}

export function shortenAddress(address) {
  if (!address) return ""
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function formatChainError(err) {
  if (!err) return "Transaction failed."
  const msg = err.shortMessage || err.message || String(err)
  if (/user rejected|user denied/i.test(msg)) {
    return "Transaction rejected in wallet."
  }
  return msg
}
