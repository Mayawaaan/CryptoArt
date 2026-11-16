import React, { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from "wagmi"
import { formatEther, formatUnits, parseEther, parseUnits } from "viem"
import { TOKENS } from "../../data/currency"
import { fetchMarkets, fetchDexPairs } from "../../services/marketApi"
import { executeDemoSwap } from "../../services/demoApi"
import {
  CRYPTO_ART_SWAP_POOL_ABI,
  CRYPTO_ART_TOKEN_ABI,
} from "../../contracts/abis"
import {
  formatChainError,
  getChainContracts,
  isSupportedChainId,
} from "../../web3/wagmiConfig"
import { useDemoWallet } from "../../hooks/useDemoWallet"
import { useToast } from "../../hooks/useToast"

import PageHeader from "../ui/PageHeader"
import Tabs from "../ui/Tabs"
import Button from "../ui/Button"
import StatusBadge from "../ui/StatusBadge"
import SwapHeader from "./SwapHeader"
import SwapInputBox from "./SwapInputBox"
import SwapSwitchButton from "./SwapSwitchButton"
import SwapDetails from "./SwapDetails"
import TokenModal from "./TokenModal"
import TxStatusBanner from "../web3/TxStatusBanner"

const decimalRegex = /^[0-9]*\.?[0-9]*$/
const roundTo6 = (num) => Math.round(num * 1e6) / 1e6

const SwapComponent = () => {
  const [executionMode, setExecutionMode] = useState("demo")
  const [tokens, setTokens] = useState(TOKENS)
  const [payTokenId, setPayTokenId] = useState("eth")
  const [receiveTokenId, setReceiveTokenId] = useState("inr")

  const [payAmount, setPayAmount] = useState("1.0")
  const [receiveAmount, setReceiveAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)
  const [mode, setMode] = useState("swap")

  const [feedMeta, setFeedMeta] = useState({
    loading: true,
    error: "",
    source: "",
    asOf: "",
    stale: false,
  })
  const [dexContext, setDexContext] = useState({
    loading: false,
    pairs: [],
    error: "",
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSide, setModalSide] = useState(null)

  const {
    wallet: demoWallet,
    isActive: isDemoActive,
    databaseConnected,
    unavailableReason,
    refreshWallet,
    openWalletModal,
  } = useDemoWallet()
  const { pushToast } = useToast()

  // On-chain testnet state (ETH <-> CART)
  const { address, isConnected, chainId } = useAccount()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()
  const chainContracts = getChainContracts(chainId)
  const swapPoolAddress = chainContracts?.CryptoArtSwapPool
  const tokenAddress = chainContracts?.CryptoArtToken
  const supportedChain = isSupportedChainId(chainId)

  const [onChainDirection, setOnChainDirection] = useState("ethToCart")
  const [onChainAmount, setOnChainAmount] = useState("0.05")
  const [txState, setTxState] = useState({ status: "idle", message: "", txHash: "" })

  const { data: ethReserve, refetch: refetchEthRes } = useReadContract({
    address: swapPoolAddress,
    abi: CRYPTO_ART_SWAP_POOL_ABI,
    functionName: "ethReserve",
    query: { enabled: Boolean(executionMode === "onchain" && swapPoolAddress) },
  })

  const { data: tokenReserve, refetch: refetchTokRes } = useReadContract({
    address: swapPoolAddress,
    abi: CRYPTO_ART_SWAP_POOL_ABI,
    functionName: "tokenReserve",
    query: { enabled: Boolean(executionMode === "onchain" && swapPoolAddress) },
  })

  let parsedOnChainIn = 0n
  try {
    if (onChainAmount && Number(onChainAmount) > 0) {
      parsedOnChainIn =
        onChainDirection === "ethToCart"
          ? parseEther(onChainAmount)
          : parseUnits(onChainAmount, 18)
    }
  } catch {
    parsedOnChainIn = 0n
  }

  const reserveIn = onChainDirection === "ethToCart" ? ethReserve : tokenReserve
  const reserveOut = onChainDirection === "ethToCart" ? tokenReserve : ethReserve

  const { data: quotedOnChainOut } = useReadContract({
    address: swapPoolAddress,
    abi: CRYPTO_ART_SWAP_POOL_ABI,
    functionName: "getAmountOut",
    args:
      parsedOnChainIn > 0n && reserveIn && reserveOut && reserveIn > 0n && reserveOut > 0n
        ? [parsedOnChainIn, reserveIn, reserveOut]
        : undefined,
    query: {
      enabled: Boolean(
        executionMode === "onchain" &&
          swapPoolAddress &&
          parsedOnChainIn > 0n &&
          reserveIn &&
          reserveOut &&
          reserveIn > 0n &&
          reserveOut > 0n
      ),
    },
  })

  const payToken = tokens.find((t) => t.id === payTokenId) || tokens[0]
  const receiveToken = tokens.find((t) => t.id === receiveTokenId) || tokens[1]

  const refreshMarketPrices = useCallback(async (signal) => {
    try {
      setFeedMeta((prev) => ({ ...prev, loading: true, error: "" }))
      const res = await fetchMarkets("inr", signal)
      const combined = [...(res.data?.crypto || []), ...(res.data?.forex || [])]
      const bySymbol = new Map(
        combined.map((item) => [String(item.symbol).toUpperCase(), item])
      )

      setTokens((prev) =>
        prev.map((t) => {
          const live = bySymbol.get(t.symbol.toUpperCase())
          if (live && typeof live.current_price === "number" && live.current_price > 0) {
            return { ...t, price: live.current_price, isLive: true }
          }
          return t
        })
      )
      setFeedMeta({
        loading: false,
        error: "",
        source: res.source || "",
        asOf: res.asOf || "",
        stale: Boolean(res.stale),
      })
    } catch (err) {
      if (err.name === "AbortError") return
      setFeedMeta((prev) => ({
        ...prev,
        loading: false,
        error: err.message || "Live pricing unavailable; showing baseline reference values.",
      }))
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    refreshMarketPrices(controller.signal)
    return () => controller.abort()
  }, [refreshMarketPrices])

  useEffect(() => {
    const queryToken =
      payToken.type === "crypto" && payToken.symbol !== "INRC"
        ? payToken.symbol
        : receiveToken.type === "crypto" && receiveToken.symbol !== "INRC"
        ? receiveToken.symbol
        : null

    if (!queryToken) {
      setDexContext({ loading: false, pairs: [], error: "" })
      return undefined
    }

    const controller = new AbortController()
    setDexContext((prev) => ({ ...prev, loading: true, error: "" }))

    fetchDexPairs(queryToken, controller.signal)
      .then((res) => {
        setDexContext({
          loading: false,
          pairs: (res.data?.pairs || []).slice(0, 3),
          error: "",
        })
      })
      .catch((err) => {
        if (err.name === "AbortError") return
        setDexContext({
          loading: false,
          pairs: [],
          error: err.message || "DEX liquidity feed unavailable.",
        })
      })

    return () => controller.abort()
  }, [payToken.symbol, payToken.type, receiveToken.symbol, receiveToken.type])

  useEffect(() => {
    if (!payToken || !receiveToken) return

    const num = parseFloat(payAmount)
    if (Number.isNaN(num)) {
      setReceiveAmount("")
      return
    }

    const rate = payToken.price / receiveToken.price
    setReceiveAmount(roundTo6(num * rate).toString())
  }, [payAmount, payToken, receiveToken])

  const handlePayChange = (e) => {
    const val = e.target.value
    if (decimalRegex.test(val)) {
      setPayAmount(val)
      setStatusMessage(null)
    }
  }

  const handleReceiveChange = (e) => {
    const val = e.target.value
    if (!decimalRegex.test(val)) return

    setReceiveAmount(val)
    setStatusMessage(null)

    if (!val) {
      setPayAmount("")
      return
    }

    const num = parseFloat(val)
    if (!Number.isNaN(num)) {
      const rate = receiveToken.price / payToken.price
      setPayAmount(roundTo6(num * rate).toString())
    }
  }

  const handleSwitch = () => {
    setPayTokenId(receiveToken.id)
    setReceiveTokenId(payToken.id)
    setPayAmount(receiveAmount)
    setReceiveAmount(payAmount)
    setStatusMessage(null)
  }

  const handleDemoSwap = async () => {
    const numPay = Number(payAmount)
    const numRecv = Number(receiveAmount)
    if (!numPay || numPay <= 0 || !numRecv || numRecv <= 0 || payToken.id === receiveToken.id) {
      return
    }

    if (!isDemoActive) {
      openWalletModal("demo")
      return
    }

    try {
      setIsLoading(true)
      setStatusMessage(null)
      const res = await executeDemoSwap({
        paySymbol: payToken.symbol,
        receiveSymbol: receiveToken.symbol,
        payAmount: numPay,
        receiveAmount: numRecv,
      })

      refreshWallet()
      const txId = res.data?.transaction?.demoTxId || "DEMO-TX"
      setStatusMessage({
        type: "info",
        txId,
        text: `Simulated conversion recorded (${txId}): ${numPay} ${payToken.symbol} → ${numRecv} ${receiveToken.symbol}.`,
      })
      pushToast({
        title: "Demo Conversion Settled",
        description: `Reference ${txId} · 1 Demo Credit simulation fee`,
      })
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err.message || "Unable to record simulated swap.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOnChainSwap = async () => {
    if (!isConnected || !supportedChain || !swapPoolAddress || !tokenAddress || !publicClient) {
      return
    }
    if (parsedOnChainIn <= 0n || !quotedOnChainOut || quotedOnChainOut <= 0n) {
      setTxState({
        status: "error",
        message: "Enter a valid amount with available pool liquidity.",
        txHash: "",
      })
      return
    }

    const minOut = (quotedOnChainOut * 995n) / 1000n

    try {
      if (onChainDirection === "cartToEth") {
        setTxState({
          status: "simulating",
          message: "Checking CART allowance and simulating approval...",
          txHash: "",
        })
        const allowance = await publicClient.readContract({
          address: tokenAddress,
          abi: CRYPTO_ART_TOKEN_ABI,
          functionName: "allowance",
          args: [address, swapPoolAddress],
        })

        if (allowance < parsedOnChainIn) {
          const approveSim = await publicClient.simulateContract({
            address: tokenAddress,
            abi: CRYPTO_ART_TOKEN_ABI,
            functionName: "approve",
            args: [swapPoolAddress, parsedOnChainIn],
            account: address,
          })
          setTxState({
            status: "pending",
            message: "Approve CART spend in your wallet...",
            txHash: "",
          })
          const approveHash = await writeContractAsync(approveSim.request)
          await publicClient.waitForTransactionReceipt({ hash: approveHash })
        }
      }

      setTxState({
        status: "simulating",
        message: "Simulating swap on CryptoArtSwapPool...",
        txHash: "",
      })

      const sim =
        onChainDirection === "ethToCart"
          ? await publicClient.simulateContract({
              address: swapPoolAddress,
              abi: CRYPTO_ART_SWAP_POOL_ABI,
              functionName: "swapEthForCart",
              args: [minOut],
              value: parsedOnChainIn,
              account: address,
            })
          : await publicClient.simulateContract({
              address: swapPoolAddress,
              abi: CRYPTO_ART_SWAP_POOL_ABI,
              functionName: "swapCartForEth",
              args: [parsedOnChainIn, minOut],
              account: address,
            })

      setTxState({
        status: "pending",
        message: "Confirm swap in wallet...",
        txHash: "",
      })
      const hash = await writeContractAsync(sim.request)
      setTxState({
        status: "pending",
        message: "Swap broadcast; waiting for block confirmation...",
        txHash: hash,
      })
      await publicClient.waitForTransactionReceipt({ hash })
      await Promise.all([refetchEthRes(), refetchTokRes()])
      setTxState({
        status: "confirmed",
        message: "On-chain testnet swap settled.",
        txHash: hash,
      })
    } catch (err) {
      setTxState({
        status: "error",
        message: formatChainError(err),
        txHash: "",
      })
    }
  }

  const getInrValue = (amount, token) => {
    const val = parseFloat(amount)
    if (Number.isNaN(val)) return "₹0.00"
    return (val * token.price).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    })
  }

  const numericPay = parseFloat(payAmount)

  return (
    <>
      <main className="min-h-screen bg-ca-bg text-ca-text px-4 sm:px-6 py-10">
        <div className="container mx-auto space-y-8">
          <PageHeader
            eyebrow="Exchange & AMM"
            title="Swap & Liquidity Desk"
            description="Record simulated conversions in your MongoDB Demo Wallet against live market feeds or execute ETH ↔ CART swaps via CryptoArtSwapPool."
            actions={
              isDemoActive ? (
                <StatusBadge tone="accent" className="tabular-nums">
                  Demo Balance · {Number(demoWallet?.balanceCredits || 0).toLocaleString()} CR
                </StatusBadge>
              ) : (
                <Button variant="soft" size="sm" onClick={() => openWalletModal("demo")}>
                  Start Demo Wallet
                </Button>
              )
            }
          />

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-ca-surface border border-ca-border rounded-2xl p-6 space-y-5">
              <Tabs
                value={executionMode}
                onChange={setExecutionMode}
                layoutId="swap-execution-mode"
                ariaLabel="Swap execution mode"
                className="w-full grid grid-cols-2"
                items={[
                  { value: "demo", label: "Demo Credits (Simulated)" },
                  { value: "onchain", label: "On-Chain Pool (ETH ↔ CART)" },
                ]}
              />

              {executionMode === "demo" ? (
                <div>
                  <SwapHeader
                    mode={mode}
                    onModeChange={setMode}
                    onRefresh={() => refreshMarketPrices()}
                  />

                  <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-ca-bg border border-ca-border text-xs text-ca-text-muted flex flex-wrap items-center justify-between gap-2">
                    <span>
                      {feedMeta.error
                        ? "Offline Reference Rates"
                        : feedMeta.source
                        ? `Rates: ${feedMeta.source}${feedMeta.stale ? " (Stale)" : ""}`
                        : "Loading rates..."}
                    </span>
                    <StatusBadge tone="neutral">Simulated · No Gas</StatusBadge>
                  </div>

                  <SwapInputBox
                    id="swap-pay-input"
                    label={mode === "buy" ? "Pay Currency" : "You Pay"}
                    amount={payAmount}
                    onChange={handlePayChange}
                    token={payToken}
                    inrValue={getInrValue(payAmount, payToken)}
                    onTokenClick={() => {
                      setModalSide("pay")
                      setIsModalOpen(true)
                    }}
                  />

                  <SwapSwitchButton onClick={handleSwitch} />

                  <SwapInputBox
                    id="swap-receive-input"
                    label="You Receive"
                    amount={receiveAmount}
                    onChange={handleReceiveChange}
                    token={receiveToken}
                    inrValue={getInrValue(receiveAmount, receiveToken)}
                    onTokenClick={() => {
                      setModalSide("receive")
                      setIsModalOpen(true)
                    }}
                  />

                  <SwapDetails
                    payToken={payToken}
                    receiveToken={receiveToken}
                    roundTo6={roundTo6}
                    asOf={feedMeta.asOf}
                  />

                  {!databaseConnected && (
                    <div className="mt-4 p-3 rounded-xl bg-ca-warning-bg border border-ca-border-strong text-xs text-ca-warning">
                      {unavailableReason}
                    </div>
                  )}

                  {statusMessage && (
                    <div
                      role="status"
                      className={`mt-4 p-3.5 rounded-xl text-xs border space-y-1.5 ${
                        statusMessage.type === "error"
                          ? "bg-ca-negative-bg text-ca-negative border-ca-border-strong"
                          : "bg-ca-positive-bg text-ca-positive border-ca-accent-border"
                      }`}
                    >
                      <p>{statusMessage.text}</p>
                      {statusMessage.txId && (
                        <Link
                          to="/demo-activity"
                          className="inline-block underline font-mono text-ca-accent"
                        >
                          View Ledger Receipt →
                        </Link>
                      )}
                    </div>
                  )}

                  <Button
                    variant="primary"
                    size="lg"
                    loading={isLoading}
                    disabled={
                      !payAmount ||
                      Number.isNaN(numericPay) ||
                      numericPay <= 0 ||
                      payToken.id === receiveToken.id ||
                      (isDemoActive && Number(demoWallet?.balanceCredits || 0) < 1) ||
                      !databaseConnected
                    }
                    onClick={handleDemoSwap}
                    className="w-full mt-5"
                  >
                    {!databaseConnected
                      ? "Database Unavailable"
                      : !isDemoActive
                      ? "Start Demo Session to Convert"
                      : mode === "buy"
                      ? "Record Demo Conversion (1 CR Fee)"
                      : "Execute Demo Swap (1 CR Fee)"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="px-3.5 py-2.5 rounded-xl bg-ca-bg border border-ca-border text-xs text-ca-text-muted flex items-center justify-between">
                    <span>CryptoArtSwapPool AMM</span>
                    <StatusBadge tone="accent">Testnet Only</StatusBadge>
                  </div>

                  {!isConnected ? (
                    <div className="p-5 rounded-xl bg-ca-bg border border-ca-border space-y-3">
                      <p className="text-sm text-ca-text-secondary">
                        Connect your EVM browser wallet to execute ETH ↔ CART swaps on Hardhat
                        Local or Sepolia.
                      </p>
                      <Button variant="secondary" size="sm" onClick={() => openWalletModal("evm")}>
                        Connect EVM Wallet
                      </Button>
                    </div>
                  ) : !supportedChain ? (
                    <div className="p-5 rounded-xl bg-ca-warning-bg border border-ca-border-strong space-y-3 text-xs text-ca-warning">
                      <p>
                        Unsupported network (Chain {chainId}). Switch to Hardhat Local (31337) or
                        Sepolia (11155111).
                      </p>
                      <Button variant="outline" size="sm" onClick={() => openWalletModal("evm")}>
                        Switch Network
                      </Button>
                    </div>
                  ) : !swapPoolAddress ? (
                    <div className="p-5 rounded-xl bg-ca-bg border border-ca-border text-xs text-ca-text-muted leading-relaxed">
                      No SwapPool deployment found for Chain {chainId}. Start a local Hardhat node
                      and run{" "}
                      <code className="font-mono text-ca-text">npm run contracts:deploy:local</code>.
                    </div>
                  ) : (
                    <>
                      <div className="bg-ca-bg border border-ca-border rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-xs text-ca-text-muted">
                          <label htmlFor="onchain-swap-input">
                            Pay ({onChainDirection === "ethToCart" ? "ETH" : "CART"})
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              setOnChainDirection((d) =>
                                d === "ethToCart" ? "cartToEth" : "ethToCart"
                              )
                            }
                            className="cursor-pointer font-mono text-ca-accent hover:underline"
                          >
                            Switch Direction
                          </button>
                        </div>
                        <input
                          id="onchain-swap-input"
                          type="text"
                          inputMode="decimal"
                          value={onChainAmount}
                          onChange={(e) => {
                            if (decimalRegex.test(e.target.value)) {
                              setOnChainAmount(e.target.value)
                            }
                          }}
                          className="w-full bg-transparent text-2xl font-mono tabular-nums font-semibold text-ca-text outline-none"
                        />
                      </div>

                      <div className="bg-ca-bg border border-ca-border rounded-xl p-4 text-xs font-mono tabular-nums space-y-1.5 text-ca-text-muted">
                        <div className="flex justify-between">
                          <span>Estimated Output</span>
                          <span className="text-ca-text font-semibold">
                            {quotedOnChainOut
                              ? `${Number(
                                  onChainDirection === "ethToCart"
                                    ? formatUnits(quotedOnChainOut, 18)
                                    : formatEther(quotedOnChainOut)
                                ).toFixed(6)} ${onChainDirection === "ethToCart" ? "CART" : "ETH"}`
                              : "--"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pool Reserves</span>
                          <span>
                            {ethReserve !== undefined && tokenReserve !== undefined
                              ? `${Number(formatEther(ethReserve)).toFixed(3)} ETH / ${Number(
                                  formatUnits(tokenReserve, 18)
                                ).toFixed(1)} CART`
                              : "Loading..."}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fee / Max Slippage</span>
                          <span>0.30% / 0.50%</span>
                        </div>
                      </div>

                      <TxStatusBanner
                        status={txState.status}
                        message={txState.message}
                        txHash={txState.txHash}
                        chainId={chainId}
                      />

                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleOnChainSwap}
                        loading={txState.status === "simulating" || txState.status === "pending"}
                        disabled={!quotedOnChainOut}
                        className="w-full"
                      >
                        {onChainDirection === "ethToCart"
                          ? "Swap ETH for CART"
                          : "Approve & Swap CART for ETH"}
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Live DEX Liquidity Context */}
            <aside className="lg:col-span-5 bg-ca-surface border border-ca-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-ca-divider pb-3">
                <div>
                  <h2 className="text-sm font-semibold text-ca-text">
                    External DEX Pair Liquidity
                  </h2>
                  <p className="text-xs text-ca-text-muted">Live pairs via DEX Screener</p>
                </div>
                <StatusBadge tone="neutral">{payToken.symbol}</StatusBadge>
              </div>

              {dexContext.loading ? (
                <div className="space-y-3">
                  <div className="h-16 rounded-xl bg-ca-surface-raised animate-pulse" />
                  <div className="h-16 rounded-xl bg-ca-surface-raised animate-pulse" />
                </div>
              ) : dexContext.error ? (
                <p className="text-xs text-ca-text-muted">{dexContext.error}</p>
              ) : dexContext.pairs.length === 0 ? (
                <p className="text-xs text-ca-text-muted">
                  Select a cryptocurrency asset to inspect live DEX pair liquidity.
                </p>
              ) : (
                <div className="space-y-3">
                  {dexContext.pairs.map((pair) => (
                    <a
                      key={`${pair.chainId}-${pair.pairAddress}`}
                      href={pair.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 rounded-xl bg-ca-bg border border-ca-border hover:border-ca-accent transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                        <span className="font-semibold text-ca-text">
                          {pair.baseToken?.symbol}/{pair.quoteToken?.symbol}
                        </span>
                        <span className="text-ca-accent uppercase">{pair.dexId}</span>
                      </div>
                      <div className="flex justify-between text-xs text-ca-text-muted font-mono tabular-nums">
                        <span>Chain: {pair.chainId}</span>
                        <span>
                          Liquidity:{" "}
                          {pair.liquidityUsd
                            ? `$${Math.round(pair.liquidityUsd).toLocaleString()}`
                            : "--"}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      <TokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(token) => {
          if (modalSide === "pay") setPayTokenId(token.id)
          else setReceiveTokenId(token.id)
        }}
        selectedTokenId={modalSide === "pay" ? receiveToken.id : payToken.id}
        tokens={tokens}
      />
    </>
  )
}

export default SwapComponent
