import { createConfig, http } from "wagmi"
import { hardhat, sepolia } from "wagmi/chains"
import { injected } from "wagmi/connectors"
import deployments from "../contracts/deployments.json"

export const SUPPORTED_CHAINS = [hardhat, sepolia]

const sepoliaRpc = import.meta.env.VITE_SEPOLIA_RPC_URL?.trim() || undefined

export const wagmiConfig = createConfig({
  chains: SUPPORTED_CHAINS,
  connectors: [injected()],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
    [sepolia.id]: http(sepoliaRpc),
  },
})

export function isSupportedChainId(chainId) {
  return SUPPORTED_CHAINS.some((c) => c.id === chainId)
}

export function getChainContracts(chainId) {
  if (!chainId) return null
  return deployments[String(chainId)]?.contracts || null
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
