import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  usePublicClient,
  useReadContract,
  useSwitchChain,
  useWriteContract,
} from "wagmi"
import { formatEther, formatUnits } from "viem"
import { hardhat, sepolia } from "wagmi/chains"
import { Coins, Copy, ExternalLink, LogOut, RotateCcw } from "lucide-react"

import Dialog from "../ui/Dialog"
import Tabs from "../ui/Tabs"
import Button from "../ui/Button"
import { Input } from "../ui/Input"
import StatusBadge from "../ui/StatusBadge"
import TxStatusBanner from "../web3/TxStatusBanner"
import { CRYPTO_ART_TOKEN_ABI } from "../../contracts/abis"
import {
  formatChainError,
  getChainContracts,
  isSupportedChainId,
  shortenAddress,
} from "../../web3/wagmiConfig"
import { useDemoWallet } from "../../hooks/useDemoWallet"
import { useToast } from "../../hooks/useToast"

const WalletModal = () => {
  const {
    wallet,
    isActive: isDemoActive,
    databaseConnected,
    backendReachable,
    unavailableReason,
    startSession,
    isStarting,
    resetWallet,
    isResetting,
    refreshHealth,
    walletModalOpen,
    walletModalTab,
    setWalletModalTab,
    closeWalletModal,
  } = useDemoWallet()
  const { pushToast } = useToast()

  const { address, isConnected, chainId, chain } = useAccount()
  const { connectors, connect, isPending: isConnecting, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  const [aliasInput, setAliasInput] = useState("")
  const [confirmReset, setConfirmReset] = useState(false)
  const [demoError, setDemoError] = useState(null)

  const [faucetState, setFaucetState] = useState({
    status: "idle",
    message: "",
    txHash: "",
  })

  const { data: nativeBalance } = useBalance({
    address,
    query: { enabled: Boolean(isConnected && address) },
  })

  const chainContracts = getChainContracts(chainId)
  const tokenAddress = chainContracts?.CryptoArtToken

  const { data: cartBalance, refetch: refetchCart } = useReadContract({
    address: tokenAddress,
    abi: CRYPTO_ART_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(isConnected && address && tokenAddress) },
  })

  const supported = isSupportedChainId(chainId)

  const handleStartDemo = async (e) => {
    e.preventDefault()
    setDemoError(null)
    try {
      const created = await startSession(aliasInput.trim() || "Demo Collector")
      pushToast({
        title: "Demo Wallet Ready",
        description: `Account ${created.data.accountId} funded with ${Number(
          created.data.balanceCredits
        ).toLocaleString()} simulated credits.`,
      })
      setAliasInput("")
    } catch (err) {
      setDemoError(err.message || "Unable to initialize demo wallet.")
    }
  }

  const handleResetDemo = async () => {
    setDemoError(null)
    try {
      await resetWallet()
      setConfirmReset(false)
      pushToast({
        title: "Demo Credits Reset",
        description: "Balance restored to 10,000.00 Demo Credits.",
      })
    } catch (err) {
      setDemoError(err.message || "Failed to reset demo wallet.")
    }
  }

  const handleCopyAccount = async () => {
    if (!wallet?.accountId) return
    try {
      await navigator.clipboard.writeText(wallet.accountId)
      pushToast({ title: "Copied account ID", description: wallet.accountId })
    } catch {
      pushToast({ title: "Copy failed", description: "Select and copy the ID manually." })
    }
  }

  const handleFaucet = async () => {
    if (!tokenAddress || !publicClient || !address) return
    try {
      setFaucetState({
        status: "simulating",
        message: "Simulating test CART faucet claim...",
        txHash: "",
      })
      const sim = await publicClient.simulateContract({
        address: tokenAddress,
        abi: CRYPTO_ART_TOKEN_ABI,
        functionName: "faucet",
        account: address,
      })

      setFaucetState({
        status: "pending",
        message: "Awaiting wallet signature and block confirmation...",
        txHash: "",
      })
      const hash = await writeContractAsync(sim.request)
      setFaucetState({
        status: "pending",
        message: "Transaction submitted; confirming on-chain...",
        txHash: hash,
      })
      await publicClient.waitForTransactionReceipt({ hash })
      await refetchCart()
      setFaucetState({
        status: "confirmed",
        message: "Minted 1,000 test CART tokens to your connected wallet.",
        txHash: hash,
      })
    } catch (err) {
      setFaucetState({
        status: "error",
        message: formatChainError(err),
        txHash: "",
      })
    }
  }

  return (
    <Dialog
      isOpen={walletModalOpen}
      onClose={closeWalletModal}
      title="Wallet & Execution Mode"
      subtitle="Switch cleanly between simulated Demo Credits and live EVM testnet contracts."
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        <Tabs
          value={walletModalTab}
          onChange={setWalletModalTab}
          layoutId="wallet-mode-tabs"
          ariaLabel="Wallet mode tabs"
          className="w-full grid grid-cols-2"
          items={[
            {
              value: "demo",
              label: isDemoActive ? "Demo Wallet (Active)" : "Demo Wallet",
            },
            {
              value: "evm",
              label: isConnected ? "EVM Testnet (Connected)" : "EVM Testnet",
            },
          ]}
        />

        {walletModalTab === "demo" ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-ca-accent-soft/60 border border-ca-accent-border px-4 py-3 text-xs text-ca-text-secondary leading-relaxed">
              <strong className="text-ca-accent font-semibold">Simulated — No real funds:</strong>{" "}
              Demo Credits are stored off-chain in MongoDB so you can create NFTs, place bids,
              swap, and test staking without paying gas or connecting MetaMask.
            </div>

            {!backendReachable || !databaseConnected ? (
              <div className="rounded-xl bg-ca-surface-raised border border-ca-border p-4 space-y-3">
                <StatusBadge tone="warning">Database Required</StatusBadge>
                <p className="text-xs text-ca-text-secondary leading-relaxed">
                  {unavailableReason}
                </p>
                <Button variant="outline" size="sm" onClick={() => refreshHealth()}>
                  Retry Connection Check
                </Button>
              </div>
            ) : !isDemoActive ? (
              <form onSubmit={handleStartDemo} className="space-y-4">
                <Input
                  id="demo-wallet-alias"
                  label="Collector Alias (Optional)"
                  placeholder="Demo Collector"
                  maxLength={40}
                  value={aliasInput}
                  onChange={(e) => setAliasInput(e.target.value)}
                  hint="Starts an HTTP-only signed browser session funded with 10,000.00 Demo Credits."
                />
                {demoError && (
                  <p role="alert" className="text-xs text-ca-negative">
                    {demoError}
                  </p>
                )}
                <Button type="submit" loading={isStarting} className="w-full">
                  Start Demo Session (10,000 Credits)
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-ca-bg border border-ca-border space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge tone="accent">Demo Active</StatusBadge>
                    <span className="text-xs text-ca-text-muted">{wallet.displayAlias}</span>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-ca-text-muted">
                      Available Balance
                    </p>
                    <p className="text-2xl font-semibold font-mono tabular-nums text-ca-text mt-0.5">
                      {Number(wallet.balanceCredits || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      <span className="text-sm text-ca-accent">CR</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-ca-divider text-xs">
                    <span className="text-ca-text-muted">Demo Account ID</span>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="cursor-pointer inline-flex items-center gap-1.5 font-mono text-ca-text hover:text-ca-accent transition-colors"
                    >
                      {wallet.accountId}
                      <Copy size={12} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {demoError && (
                  <p role="alert" className="text-xs text-ca-negative">
                    {demoError}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Link
                    to="/nft-gallery/create"
                    onClick={closeWalletModal}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-ca-surface-raised border border-ca-border text-ca-text hover:border-ca-accent transition-colors"
                  >
                    Create NFT
                    <ExternalLink size={12} aria-hidden="true" />
                  </Link>
                  <Link
                    to="/collection"
                    onClick={closeWalletModal}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-ca-surface-raised border border-ca-border text-ca-text hover:border-ca-accent transition-colors"
                  >
                    Collection
                    <ExternalLink size={12} aria-hidden="true" />
                  </Link>
                  <Link
                    to="/demo-activity"
                    onClick={closeWalletModal}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-ca-surface-raised border border-ca-border text-ca-text hover:border-ca-accent transition-colors"
                  >
                    Activity
                    <ExternalLink size={12} aria-hidden="true" />
                  </Link>
                </div>

                {!confirmReset ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmReset(true)}
                    className="w-full"
                  >
                    <RotateCcw size={14} aria-hidden="true" />
                    Reset Demo Balance to 10,000 CR
                  </Button>
                ) : (
                  <div className="p-3 rounded-xl bg-ca-surface-raised border border-ca-border-strong space-y-2.5">
                    <p className="text-xs text-ca-text-secondary">
                      Restore available demo balance back to 10,000.00 CR? Existing NFT listings
                      remain intact.
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        loading={isResetting}
                        onClick={handleResetDemo}
                        className="flex-1"
                      >
                        Confirm Reset
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmReset(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {!isConnected ? (
              <div className="space-y-4">
                <p className="text-xs text-ca-text-secondary leading-relaxed">
                  Connect an injected EVM browser wallet (MetaMask, Rabby, Coinbase Wallet) to
                  execute prototype smart contracts on Hardhat Local (31337) or Sepolia (11155111).
                  Never enter seed phrases or private keys.
                </p>

                <div className="space-y-2.5">
                  {connectors.map((connector) => (
                    <button
                      type="button"
                      key={connector.uid}
                      disabled={isConnecting}
                      onClick={() => connect({ connector })}
                      className="cursor-pointer w-full flex items-center justify-between px-4 py-3 rounded-xl bg-ca-surface-raised border border-ca-border hover:border-ca-accent text-sm font-semibold text-ca-text transition-colors disabled:opacity-50"
                    >
                      <span>{connector.name}</span>
                      <span className="text-xs font-mono text-ca-accent">
                        {isConnecting ? "Connecting..." : "Connect"}
                      </span>
                    </button>
                  ))}
                </div>

                {connectError && (
                  <p role="alert" className="text-xs text-ca-negative">
                    {formatChainError(connectError)}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-ca-bg border border-ca-border space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-ca-text-muted">Address</span>
                    <span className="font-mono font-semibold text-ca-text">
                      {shortenAddress(address)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ca-text-muted">Network</span>
                    <span
                      className={`font-mono font-semibold ${
                        supported ? "text-ca-accent" : "text-ca-warning"
                      }`}
                    >
                      {chain?.name || `Chain ${chainId}`} ({chainId})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ca-text-muted">Native Balance</span>
                    <span className="font-mono tabular-nums text-ca-text">
                      {nativeBalance
                        ? `${Number(formatEther(nativeBalance.value)).toFixed(4)} ${
                            nativeBalance.symbol
                          }`
                        : "--"}
                    </span>
                  </div>
                  {tokenAddress && (
                    <div className="flex items-center justify-between">
                      <span className="text-ca-text-muted">Test CART</span>
                      <span className="font-mono tabular-nums text-ca-accent">
                        {cartBalance !== undefined
                          ? `${Number(formatUnits(cartBalance, 18)).toLocaleString()} CART`
                          : "--"}
                      </span>
                    </div>
                  )}
                </div>

                {!supported && (
                  <div className="p-3 rounded-xl bg-ca-warning-bg border border-ca-border-strong text-xs text-ca-warning">
                    Unsupported network. Switch to Hardhat Local (31337) or Sepolia (11155111).
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={isSwitching || chainId === hardhat.id}
                    onClick={() => switchChain({ chainId: hardhat.id })}
                  >
                    Hardhat (31337)
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={isSwitching || chainId === sepolia.id}
                    onClick={() => switchChain({ chainId: sepolia.id })}
                  >
                    Sepolia (11155111)
                  </Button>
                </div>

                {supported && tokenAddress ? (
                  <Button
                    variant="soft"
                    size="sm"
                    onClick={handleFaucet}
                    loading={
                      faucetState.status === "pending" || faucetState.status === "simulating"
                    }
                    className="w-full"
                  >
                    <Coins size={14} aria-hidden="true" />
                    Mint 1,000 Test CART (Faucet)
                  </Button>
                ) : supported ? (
                  <p className="text-xs text-ca-text-muted">
                    Prototype contracts are not deployed on chain {chainId}. Run{" "}
                    <code className="font-mono text-ca-text">npm run contracts:deploy:local</code>{" "}
                    against a local Hardhat node.
                  </p>
                ) : null}

                <TxStatusBanner
                  status={faucetState.status}
                  message={faucetState.message}
                  txHash={faucetState.txHash}
                  chainId={chainId}
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disconnect()}
                  className="w-full"
                >
                  <LogOut size={14} aria-hidden="true" />
                  Disconnect EVM Wallet
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Dialog>
  )
}

export default WalletModal
