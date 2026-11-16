import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from "wagmi"
import { formatEther, parseEther } from "viem"
import { Plus } from "lucide-react"

import PageHeader from "../components/ui/PageHeader"
import Tabs from "../components/ui/Tabs"
import { Input } from "../components/ui/Input"
import Select from "../components/ui/Select"
import Button from "../components/ui/Button"
import StatusBadge from "../components/ui/StatusBadge"
import EmptyState from "../components/ui/EmptyState"
import Dialog from "../components/ui/Dialog"
import { SkeletonCard } from "../components/ui/Skeleton"
import TxStatusBanner from "../components/web3/TxStatusBanner"

import { fetchNfts } from "../services/demoApi"
import { useDemoWallet } from "../hooks/useDemoWallet"
import { CRYPTO_ART_MARKETPLACE_ABI } from "../contracts/abis"
import {
  formatChainError,
  getChainContracts,
  isSupportedChainId,
} from "../web3/wagmiConfig"

const CATEGORIES = ["All", "Art", "Collectibles", "Music", "Gaming", "Domain Names"]

const TESTNET_AUCTIONS = [
  {
    id: 1,
    title: "Meridian Geometry I",
    subtitle: "Contract Lot #1 · Seeded Reserve",
    image: "/seed-nfts/sample-1.svg",
  },
  {
    id: 2,
    title: "Harmonic Lattice IV",
    subtitle: "Contract Lot #2 · Seeded Reserve",
    image: "/seed-nfts/sample-2.svg",
  },
  {
    id: 3,
    title: "Orbital Relay Series",
    subtitle: "Contract Lot #3 · Seeded Reserve",
    image: "/seed-nfts/sample-3.svg",
  },
]

const NFTGallery = () => {
  const { databaseConnected, unavailableReason, openWalletModal } = useDemoWallet()

  const [marketMode, setMarketMode] = useState("demo")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState("newest")
  const [statusFilter, setStatusFilter] = useState("active")
  const [page, setPage] = useState(1)

  // On-chain auction state (preserved for Hardhat / Sepolia contracts)
  const { address, isConnected, chainId } = useAccount()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()
  const supported = isSupportedChainId(chainId)
  const marketplaceAddress = getChainContracts(chainId)?.CryptoArtNFTMarketplace

  const [activeAuctionLot, setActiveAuctionLot] = useState(null)
  const [ethBidAmount, setEthBidAmount] = useState("0.06")
  const [txState, setTxState] = useState({ status: "idle", message: "", txHash: "" })

  const { data: onChainAuction, refetch: refetchAuction } = useReadContract({
    address: marketplaceAddress,
    abi: CRYPTO_ART_MARKETPLACE_ABI,
    functionName: "auctions",
    args: activeAuctionLot ? [BigInt(activeAuctionLot.id)] : undefined,
    query: {
      enabled: Boolean(
        activeAuctionLot && marketplaceAddress && marketMode === "onchain"
      ),
    },
  })

  const { data: pendingOutbidWei, refetch: refetchPendingOutbid } = useReadContract({
    address: marketplaceAddress,
    abi: CRYPTO_ART_MARKETPLACE_ABI,
    functionName: "pendingReturns",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(isConnected && address && marketplaceAddress) },
  })

  const catalogQuery = useQuery({
    queryKey: ["nfts", { search, category, sort, statusFilter, page }],
    queryFn: ({ signal }) =>
      fetchNfts(
        {
          search: search.trim(),
          category,
          sort,
          status: statusFilter,
          page,
          limit: 12,
        },
        signal
      ),
    enabled: databaseConnected && marketMode === "demo",
    retry: false,
    staleTime: 15_000,
  })

  const items = catalogQuery.data?.data?.items || []
  const pagination = catalogQuery.data?.data?.pagination || { page: 1, totalPages: 1, total: 0 }

  const handleSubmitOnChainBid = async (e) => {
    e.preventDefault()
    if (!activeAuctionLot || !marketplaceAddress || !publicClient || !address) return
    let valueWei
    try {
      valueWei = parseEther(ethBidAmount || "0")
    } catch {
      setTxState({ status: "error", message: "Invalid ETH bid amount.", txHash: "" })
      return
    }

    try {
      setTxState({
        status: "simulating",
        message: "Simulating bid on CryptoArtNFTMarketplace...",
        txHash: "",
      })
      const sim = await publicClient.simulateContract({
        address: marketplaceAddress,
        abi: CRYPTO_ART_MARKETPLACE_ABI,
        functionName: "placeBid",
        args: [BigInt(activeAuctionLot.id)],
        value: valueWei,
        account: address,
      })

      setTxState({ status: "pending", message: "Confirm bid in wallet...", txHash: "" })
      const hash = await writeContractAsync(sim.request)
      await publicClient.waitForTransactionReceipt({ hash })
      await Promise.all([refetchAuction(), refetchPendingOutbid()])
      setTxState({
        status: "confirmed",
        message: `On-chain ETH bid recorded for ${activeAuctionLot.title}.`,
        txHash: hash,
      })
    } catch (err) {
      setTxState({ status: "error", message: formatChainError(err), txHash: "" })
    }
  }

  const handleWithdrawOutbid = async () => {
    if (!marketplaceAddress || !publicClient || !address) return
    try {
      setTxState({
        status: "simulating",
        message: "Simulating outbid ETH refund...",
        txHash: "",
      })
      const sim = await publicClient.simulateContract({
        address: marketplaceAddress,
        abi: CRYPTO_ART_MARKETPLACE_ABI,
        functionName: "withdrawOutbid",
        account: address,
      })
      const hash = await writeContractAsync(sim.request)
      await publicClient.waitForTransactionReceipt({ hash })
      await refetchPendingOutbid()
      setTxState({
        status: "confirmed",
        message: "Refunded outbid ETH withdrawn.",
        txHash: hash,
      })
    } catch (err) {
      setTxState({ status: "error", message: formatChainError(err), txHash: "" })
    }
  }

  return (
    <main className="min-h-screen bg-ca-bg text-ca-text px-4 sm:px-6 py-10">
      <div className="container mx-auto space-y-8">
        <PageHeader
          eyebrow="NFT Marketplace"
          title="Digital Artwork Catalog"
          description="Browse creator uploads backed by MongoDB and Cloudinary, trade with Demo Credits, or bid on seeded testnet ETH auctions."
          actions={
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/nft-gallery/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-ca-accent text-ca-text-inverse hover:bg-ca-accent-hover transition-colors"
              >
                <Plus size={14} aria-hidden="true" />
                Create NFT
              </Link>
              <Link
                to="/collection"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-ca-surface-raised border border-ca-border text-ca-text hover:border-ca-accent transition-colors"
              >
                My Collection
              </Link>
              <Link
                to="/demo-activity"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-ca-surface border border-ca-border text-ca-text-secondary hover:border-ca-accent transition-colors"
              >
                Demo Activity
              </Link>
            </div>
          }
        />

        <Tabs
          value={marketMode}
          onChange={setMarketMode}
          layoutId="nft-market-mode"
          ariaLabel="NFT Marketplace mode"
          items={[
            { value: "demo", label: "Demo Marketplace (MongoDB)" },
            { value: "onchain", label: "Testnet Auctions (ETH Contract)" },
          ]}
        />

        {marketMode === "demo" ? (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="bg-ca-surface border border-ca-border rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-6">
                  <Input
                    id="nft-catalog-search"
                    label="Search Catalog"
                    placeholder="Search title, creator alias, or description..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setPage(1)
                    }}
                  />
                </div>
                <div className="md:col-span-3">
                  <Select
                    id="nft-status-filter"
                    label="Status"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value)
                      setPage(1)
                    }}
                    options={[
                      { value: "active", label: "Active Listings" },
                      { value: "all", label: "All Statuses" },
                      { value: "sold", label: "Sold" },
                    ]}
                  />
                </div>
                <div className="md:col-span-3">
                  <Select
                    id="nft-sort-filter"
                    label="Sort By"
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value)
                      setPage(1)
                    }}
                    options={[
                      { value: "newest", label: "Newest Listed" },
                      { value: "price_asc", label: "Price: Low to High" },
                      { value: "price_desc", label: "Price: High to Low" },
                    ]}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => {
                      setCategory(cat)
                      setPage(1)
                    }}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      category === cat
                        ? "bg-ca-accent-soft text-ca-accent border-ca-accent-border font-semibold"
                        : "bg-ca-bg text-ca-text-muted border-ca-border hover:text-ca-text"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {!databaseConnected ? (
              <EmptyState
                title="MongoDB Catalog Unavailable"
                description={
                  unavailableReason ||
                  "Configure MONGODB_URI in backend/.env and run npm run seed:nfts to browse persistent artworks."
                }
                action={
                  <Button variant="secondary" onClick={() => setMarketMode("onchain")}>
                    Inspect Testnet Contract Auctions
                  </Button>
                }
              />
            ) : catalogQuery.isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : catalogQuery.isError ? (
              <EmptyState
                title="Unable to Load Catalog"
                description={catalogQuery.error?.message}
                action={
                  <Button variant="outline" onClick={() => catalogQuery.refetch()}>
                    Retry Query
                  </Button>
                }
              />
            ) : items.length === 0 ? (
              <EmptyState
                title="No Artworks Found"
                description="Try clearing your search filter or publish the first listing in this category."
                action={
                  <Link
                    to="/nft-gallery/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-ca-accent text-ca-text-inverse hover:bg-ca-accent-hover transition-colors"
                  >
                    Create NFT Listing
                  </Link>
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {items.map((nft) => {
                    const effectiveCredits =
                      nft.listingType === "auction" && nft.highestBidCredits > 0
                        ? nft.highestBidCredits
                        : nft.priceCredits
                    return (
                      <Link
                        key={nft._id}
                        to={`/nft-gallery/${nft._id}`}
                        className="group rounded-2xl bg-ca-surface border border-ca-border hover:border-ca-accent overflow-hidden flex flex-col transition-colors"
                      >
                        <div className="aspect-square bg-ca-bg overflow-hidden relative">
                          <img
                            src={nft.media?.secureUrl}
                            alt={nft.media?.altText || nft.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        </div>

                        <div className="p-4 flex flex-col justify-between gap-4 flex-1">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-mono uppercase tracking-wider text-ca-text-muted">
                                {nft.category}
                              </span>
                              <StatusBadge
                                tone={
                                  nft.listingStatus === "sold"
                                    ? "neutral"
                                    : nft.listingStatus === "unlisted"
                                    ? "warning"
                                    : "accent"
                                }
                              >
                                {nft.listingStatus === "sold"
                                  ? "Sold"
                                  : nft.listingType === "auction"
                                  ? "Auction"
                                  : "Fixed"}
                              </StatusBadge>
                            </div>
                            <h2 className="text-base font-semibold text-ca-text truncate">
                              {nft.title}
                            </h2>
                            <p className="text-xs text-ca-text-muted truncate">
                              Creator: {nft.creatorAlias}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-ca-divider text-xs">
                            <span className="text-ca-text-muted">
                              {nft.listingType === "auction" ? "Highest Bid" : "List Price"}
                            </span>
                            <span className="font-mono tabular-nums font-semibold text-ca-accent">
                              {Number(effectiveCredits || 0).toLocaleString()} CR
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-ca-divider">
                    <span className="text-xs font-mono text-ca-text-muted">
                      Page {pagination.page} of {pagination.totalPages} ({pagination.total} items)
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl bg-ca-surface border border-ca-border p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <StatusBadge tone="accent">CryptoArtNFTMarketplace · Testnet</StatusBadge>
                <p className="text-xs text-ca-text-secondary">
                  Seeded Solidity auction lots 1–3 on Hardhat Local (31337) or Sepolia (11155111).
                </p>
              </div>
              {!isConnected && (
                <Button variant="secondary" size="sm" onClick={() => openWalletModal("evm")}>
                  Connect EVM Wallet
                </Button>
              )}
            </div>

            {isConnected && pendingOutbidWei > 0n && (
              <div className="p-4 rounded-xl bg-ca-surface border border-ca-accent-border flex flex-wrap items-center justify-between gap-3 text-xs">
                <span>
                  Outbid refund balance available:{" "}
                  <strong className="font-mono text-ca-accent">
                    {formatEther(pendingOutbidWei)} ETH
                  </strong>
                </span>
                <Button variant="primary" size="sm" onClick={handleWithdrawOutbid}>
                  Withdraw Outbid ETH
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTNET_AUCTIONS.map((lot) => (
                <div
                  key={lot.id}
                  className="rounded-2xl bg-ca-surface border border-ca-border overflow-hidden flex flex-col justify-between"
                >
                  <div className="aspect-square bg-ca-bg overflow-hidden">
                    <img
                      src={lot.image}
                      alt={lot.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-[11px] font-mono text-ca-accent">{lot.subtitle}</p>
                      <h3 className="text-base font-semibold text-ca-text mt-1">{lot.title}</h3>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setActiveAuctionLot(lot)
                        setTxState({ status: "idle", message: "", txHash: "" })
                      }}
                    >
                      Inspect &amp; Place ETH Bid
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog
        isOpen={Boolean(activeAuctionLot)}
        onClose={() => setActiveAuctionLot(null)}
        title={activeAuctionLot ? `On-Chain Auction · ${activeAuctionLot.title}` : "Auction"}
        subtitle="Executes CryptoArtNFTMarketplace.placeBid on EVM testnets."
      >
        {!isConnected ? (
          <div className="space-y-4">
            <p className="text-xs text-ca-text-secondary">
              Connect an injected EVM wallet to place on-chain ETH bids.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setActiveAuctionLot(null)
                openWalletModal("evm")
              }}
            >
              Open Wallet Switcher
            </Button>
          </div>
        ) : !supported || !marketplaceAddress ? (
          <p className="text-xs text-ca-text-muted leading-relaxed">
            CryptoArtNFTMarketplace is not deployed on Chain {chainId}. Run{" "}
            <code className="font-mono text-ca-text">npm run contracts:deploy:local</code> first.
          </p>
        ) : (
          <form onSubmit={handleSubmitOnChainBid} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-ca-bg border border-ca-border text-xs font-mono tabular-nums space-y-1.5 text-ca-text-muted">
              <div className="flex justify-between">
                <span>Reserve Price</span>
                <span className="text-ca-text">
                  {onChainAuction ? `${formatEther(onChainAuction[2])} ETH` : "--"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Highest On-Chain Bid</span>
                <span className="text-ca-accent">
                  {onChainAuction && onChainAuction[3] > 0n
                    ? `${formatEther(onChainAuction[3])} ETH`
                    : "None yet"}
                </span>
              </div>
            </div>

            <Input
              id="nft-eth-bid-amount"
              label="Bid Amount (Testnet ETH)"
              inputMode="decimal"
              value={ethBidAmount}
              onChange={(e) => setEthBidAmount(e.target.value)}
              className="font-mono tabular-nums"
            />

            <TxStatusBanner
              status={txState.status}
              message={txState.message}
              txHash={txState.txHash}
              chainId={chainId}
            />

            <div className="flex justify-end gap-2.5">
              <Button variant="outline" size="sm" onClick={() => setActiveAuctionLot(null)}>
                Close
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={txState.status === "pending" || txState.status === "simulating"}
              >
                Place ETH Bid
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </main>
  )
}

export default NFTGallery
