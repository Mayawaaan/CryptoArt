import React, { useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from "wagmi"
import { formatUnits, parseUnits } from "viem"
import { useQueryClient } from "@tanstack/react-query"

import pools from "../data/StakingPoolData"
import { stakeDemoCredits } from "../services/demoApi"
import {
  CRYPTO_ART_STAKING_ABI,
  CRYPTO_ART_TOKEN_ABI,
} from "../contracts/abis"
import {
  formatChainError,
  getChainContracts,
  isSupportedChainId,
} from "../web3/wagmiConfig"
import { useDemoWallet } from "../hooks/useDemoWallet"
import { useToast } from "../hooks/useToast"
import Tabs from "../components/ui/Tabs"
import Button from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import StatusBadge from "../components/ui/StatusBadge"
import TxStatusBanner from "../components/web3/TxStatusBanner"

const StakePage = () => {
  const { pool } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { wallet, isActive: isDemoActive, databaseConnected, refreshWallet, openWalletModal } =
    useDemoWallet()
  const { pushToast } = useToast()

  const poolInfo =
    pools.find((p) => p.slug === pool) || {
      poolId: 0,
      slug: pool,
      title: pool.replace(/-/g, " "),
      asset: "CART",
      baseApy: 12.0,
      lockDays: 30,
      minStake: 100,
    }

  const [mode, setMode] = useState("demo")
  const [amount, setAmount] = useState("250")
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const [cartAmount, setCartAmount] = useState("100")
  const [txState, setTxState] = useState({ status: "idle", message: "", txHash: "" })

  const { address, isConnected, chainId } = useAccount()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  const supported = isSupportedChainId(chainId)
  const chainContracts = getChainContracts(chainId)
  const stakingAddress = chainContracts?.CryptoArtStaking
  const tokenAddress = chainContracts?.CryptoArtToken
  const poolIdBigInt = BigInt(poolInfo.poolId ?? 0)

  const { data: userPosition, refetch: refetchPos } = useReadContract({
    address: stakingAddress,
    abi: CRYPTO_ART_STAKING_ABI,
    functionName: "positions",
    args: address ? [poolIdBigInt, address] : undefined,
    query: { enabled: Boolean(isConnected && address && stakingAddress) },
  })

  const { data: pendingReward, refetch: refetchReward } = useReadContract({
    address: stakingAddress,
    abi: CRYPTO_ART_STAKING_ABI,
    functionName: "pendingRewards",
    args: address ? [poolIdBigInt, address] : undefined,
    query: { enabled: Boolean(isConnected && address && stakingAddress) },
  })

  const handleDemoStake = async (e) => {
    e.preventDefault()
    setFeedback(null)

    if (!isDemoActive) {
      openWalletModal("demo")
      return
    }

    const parsed = Number.parseInt(amount, 10)
    if (!Number.isInteger(parsed) || parsed < 1) {
      setFeedback({ type: "error", text: "Enter a whole integer of at least 1 Demo Credit." })
      return
    }

    try {
      setLoading(true)
      const res = await stakeDemoCredits({
        poolSlug: poolInfo.slug,
        poolTitle: poolInfo.title,
        aprPct: poolInfo.baseApy,
        lockDays: poolInfo.lockDays,
        amountCredits: parsed,
      })

      queryClient.invalidateQueries({ queryKey: ["demo-staking"] })
      refreshWallet()
      const txId = res.data?.transaction?.demoTxId || "DEMO-TX"
      setFeedback({
        type: "success",
        txId,
        text: `Staked ${parsed.toLocaleString()} Demo Credits into ${poolInfo.title} (${txId}).`,
      })
      pushToast({
        title: "Demo Stake Opened",
        description: `${parsed.toLocaleString()} CR allocated · Ref ${txId}`,
      })
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Unable to stake demo credits.",
      })
    } finally {
      setLoading(false)
    }
  }

  const executeContractAction = async (action) => {
    if (!isConnected || !supported || !stakingAddress || !tokenAddress || !publicClient) return

    try {
      if (action === "stake") {
        let parsedWei
        try {
          parsedWei = parseUnits(cartAmount || "0", 18)
        } catch {
          setTxState({ status: "error", message: "Invalid CART token amount.", txHash: "" })
          return
        }
        if (parsedWei <= 0n) {
          setTxState({ status: "error", message: "Enter a positive CART amount.", txHash: "" })
          return
        }

        setTxState({ status: "simulating", message: "Checking CART allowance...", txHash: "" })
        const allowance = await publicClient.readContract({
          address: tokenAddress,
          abi: CRYPTO_ART_TOKEN_ABI,
          functionName: "allowance",
          args: [address, stakingAddress],
        })
        if (allowance < parsedWei) {
          const approveSim = await publicClient.simulateContract({
            address: tokenAddress,
            abi: CRYPTO_ART_TOKEN_ABI,
            functionName: "approve",
            args: [stakingAddress, parsedWei],
            account: address,
          })
          setTxState({ status: "pending", message: "Approve CART spend in wallet...", txHash: "" })
          const appHash = await writeContractAsync(approveSim.request)
          await publicClient.waitForTransactionReceipt({ hash: appHash })
        }

        setTxState({ status: "simulating", message: "Simulating stake transaction...", txHash: "" })
        const sim = await publicClient.simulateContract({
          address: stakingAddress,
          abi: CRYPTO_ART_STAKING_ABI,
          functionName: "stake",
          args: [poolIdBigInt, parsedWei],
          account: address,
        })
        setTxState({ status: "pending", message: "Confirm stake in wallet...", txHash: "" })
        const hash = await writeContractAsync(sim.request)
        await publicClient.waitForTransactionReceipt({ hash })
        await Promise.all([refetchPos(), refetchReward()])
        setTxState({
          status: "confirmed",
          message: `Staked ${cartAmount} CART on-chain.`,
          txHash: hash,
        })
      } else if (action === "claim") {
        setTxState({ status: "simulating", message: "Simulating reward claim...", txHash: "" })
        const sim = await publicClient.simulateContract({
          address: stakingAddress,
          abi: CRYPTO_ART_STAKING_ABI,
          functionName: "claimRewards",
          args: [poolIdBigInt],
          account: address,
        })
        setTxState({ status: "pending", message: "Confirm reward claim in wallet...", txHash: "" })
        const hash = await writeContractAsync(sim.request)
        await publicClient.waitForTransactionReceipt({ hash })
        await Promise.all([refetchPos(), refetchReward()])
        setTxState({ status: "confirmed", message: "On-chain rewards claimed.", txHash: hash })
      } else if (action === "unstake") {
        const stakedWei = userPosition?.[0] || 0n
        if (stakedWei <= 0n) return
        setTxState({ status: "simulating", message: "Simulating unstake...", txHash: "" })
        const sim = await publicClient.simulateContract({
          address: stakingAddress,
          abi: CRYPTO_ART_STAKING_ABI,
          functionName: "unstake",
          args: [poolIdBigInt, stakedWei],
          account: address,
        })
        setTxState({ status: "pending", message: "Confirm unstake in wallet...", txHash: "" })
        const hash = await writeContractAsync(sim.request)
        await publicClient.waitForTransactionReceipt({ hash })
        await Promise.all([refetchPos(), refetchReward()])
        setTxState({ status: "confirmed", message: "Unstaked principal on-chain.", txHash: hash })
      }
    } catch (err) {
      setTxState({ status: "error", message: formatChainError(err), txHash: "" })
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-ca-bg text-ca-text flex items-center justify-center px-4 py-12">
      <div className="bg-ca-surface border border-ca-border p-6 sm:p-8 rounded-2xl w-full max-w-xl space-y-6">
        <button
          type="button"
          onClick={() => navigate("/stake")}
          className="cursor-pointer inline-flex items-center gap-2 text-xs font-medium text-ca-text-muted hover:text-ca-text transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to Staking Vaults
        </button>

        <div className="flex items-start justify-between gap-4 border-b border-ca-divider pb-5">
          <div>
            <h1 className="text-2xl font-semibold text-ca-text capitalize">{poolInfo.title}</h1>
            <p className="text-xs text-ca-text-muted mt-1">
              Schedule: {poolInfo.lockDays === 0 ? "Flexible" : `${poolInfo.lockDays} Days`} ·{" "}
              {poolInfo.asset}
            </p>
          </div>
          <StatusBadge tone="accent" className="tabular-nums">
            {poolInfo.baseApy}% APR
          </StatusBadge>
        </div>

        <Tabs
          value={mode}
          onChange={setMode}
          layoutId="stake-execution-mode"
          ariaLabel="Staking execution mode"
          className="w-full grid grid-cols-2"
          items={[
            { value: "demo", label: "Demo Credits Vault" },
            { value: "onchain", label: "On-Chain Vault (CART)" },
          ]}
        />

        {mode === "demo" ? (
          <form onSubmit={handleDemoStake} className="space-y-4">
            {isDemoActive && (
              <div className="flex items-center justify-between text-xs px-3.5 py-2.5 rounded-xl bg-ca-bg border border-ca-border font-mono tabular-nums">
                <span className="text-ca-text-muted">Available Demo Balance</span>
                <span className="text-ca-accent font-semibold">
                  {Number(wallet?.balanceCredits || 0).toLocaleString()} CR
                </span>
              </div>
            )}

            <Input
              id="stake-amount-input"
              type="number"
              min="1"
              step="1"
              label="Stake Amount (Whole Demo Credits)"
              placeholder="250"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="font-mono tabular-nums"
              hint="Persisted to your MongoDB Demo Wallet; unstake anytime from Staking Vaults."
            />

            {feedback && (
              <div
                role="status"
                className={`p-3.5 rounded-xl text-xs border space-y-1.5 ${
                  feedback.type === "error"
                    ? "bg-ca-negative-bg text-ca-negative border-ca-border-strong"
                    : "bg-ca-positive-bg text-ca-positive border-ca-accent-border"
                }`}
              >
                <p>{feedback.text}</p>
                {feedback.txId && (
                  <Link to="/stake" className="inline-block underline font-mono text-ca-accent">
                    Manage Active Positions →
                  </Link>
                )}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={!databaseConnected}
              className="w-full"
            >
              {!databaseConnected
                ? "Database Unavailable"
                : !isDemoActive
                ? "Start Demo Session to Stake"
                : "Stake Demo Credits"}
            </Button>
          </form>
        ) : !isConnected ? (
          <div className="p-5 rounded-xl bg-ca-bg border border-ca-border space-y-3">
            <p className="text-xs text-ca-text-secondary">
              Connect an EVM browser wallet to stake test CART in CryptoArtStaking.
            </p>
            <Button variant="secondary" size="sm" onClick={() => openWalletModal("evm")}>
              Connect EVM Wallet
            </Button>
          </div>
        ) : !supported ? (
          <div className="p-4 rounded-xl bg-ca-warning-bg border border-ca-border-strong text-xs text-ca-warning">
            Unsupported chain ({chainId}). Switch to Hardhat Local (31337) or Sepolia (11155111).
          </div>
        ) : !stakingAddress ? (
          <div className="p-4 rounded-xl bg-ca-bg border border-ca-border text-xs text-ca-text-muted leading-relaxed">
            CryptoArtStaking is not deployed for Chain {chainId}. Run{" "}
            <code className="font-mono text-ca-text">npm run contracts:deploy:local</code> first.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-ca-bg border border-ca-border text-xs font-mono tabular-nums space-y-1.5 text-ca-text-muted">
              <div className="flex justify-between">
                <span>Your Staked Principal</span>
                <span className="text-ca-text font-semibold">
                  {userPosition ? `${Number(formatUnits(userPosition[0], 18)).toFixed(4)} CART` : "0 CART"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Pending Rewards</span>
                <span className="text-ca-accent font-semibold">
                  {pendingReward !== undefined
                    ? `${Number(formatUnits(pendingReward, 18)).toFixed(6)} CART`
                    : "0 CART"}
                </span>
              </div>
            </div>

            <Input
              id="onchain-cart-stake"
              type="text"
              inputMode="decimal"
              label="CART Amount (Testnet Prototype)"
              value={cartAmount}
              onChange={(e) => setCartAmount(e.target.value)}
              className="font-mono tabular-nums"
            />

            <TxStatusBanner
              status={txState.status}
              message={txState.message}
              txHash={txState.txHash}
              chainId={chainId}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Button
                variant="primary"
                size="sm"
                loading={txState.status === "pending" || txState.status === "simulating"}
                onClick={() => executeContractAction("stake")}
              >
                Approve &amp; Stake
              </Button>
              <Button
                variant="soft"
                size="sm"
                disabled={!pendingReward || pendingReward === 0n || txState.status === "pending"}
                onClick={() => executeContractAction("claim")}
              >
                Claim Rewards
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!userPosition || userPosition[0] === 0n || txState.status === "pending"}
                onClick={() => executeContractAction("unstake")}
              >
                Unstake All
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default StakePage
