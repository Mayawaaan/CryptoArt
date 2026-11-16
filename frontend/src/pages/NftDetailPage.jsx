import React, { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Trash2 } from "lucide-react"

import Button from "../components/ui/Button"
import StatusBadge from "../components/ui/StatusBadge"
import { Input } from "../components/ui/Input"
import Select from "../components/ui/Select"
import Dialog from "../components/ui/Dialog"
import DataTable from "../components/ui/DataTable"
import EmptyState from "../components/ui/EmptyState"
import {
  deleteNftListing,
  fetchNftDetail,
  placeDemoNftBid,
  purchaseDemoNft,
  updateNftListing,
} from "../services/demoApi"
import { useDemoWallet } from "../hooks/useDemoWallet"
import { useToast } from "../hooks/useToast"

const NftDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { wallet, isActive: isDemoActive, refreshWallet, openWalletModal } = useDemoWallet()
  const { pushToast } = useToast()

  const detailQuery = useQuery({
    queryKey: ["nft-detail", id],
    queryFn: ({ signal }) => fetchNftDetail(id, signal),
    enabled: Boolean(id),
    retry: false,
  })

  const nft = detailQuery.data?.data?.nft
  const bids = detailQuery.data?.data?.bids || []
  const isOwner = Boolean(wallet && nft && wallet.accountId === nft.ownerAccountId)

  const [bidInput, setBidInput] = useState("")
  const [confirmBuyOpen, setConfirmBuyOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editPrice, setEditPrice] = useState("")
  const [editStatus, setEditStatus] = useState("active")
  const [actionError, setActionError] = useState("")
  const [lastReceiptTx, setLastReceiptTx] = useState("")

  const purchaseMutation = useMutation({
    mutationFn: () => purchaseDemoNft(id),
    onSuccess: (res) => {
      setConfirmBuyOpen(false)
      setActionError("")
      const txId = res.data?.transaction?.demoTxId || "DEMO-TX"
      setLastReceiptTx(txId)
      queryClient.invalidateQueries({ queryKey: ["nft-detail", id] })
      queryClient.invalidateQueries({ queryKey: ["nfts"] })
      queryClient.invalidateQueries({ queryKey: ["my-nfts"] })
      refreshWallet()
      pushToast({
        title: "NFT Purchased (Demo Credits)",
        description: `Ownership transferred to ${wallet?.displayAlias} · Ref ${txId}`,
      })
    },
    onError: (err) => {
      setActionError(err.message || "Purchase failed.")
    },
  })

  const bidMutation = useMutation({
    mutationFn: (amount) => placeDemoNftBid(id, amount),
    onSuccess: (res) => {
      setBidInput("")
      setActionError("")
      const txId = res.data?.transaction?.demoTxId || "DEMO-TX"
      setLastReceiptTx(txId)
      queryClient.invalidateQueries({ queryKey: ["nft-detail", id] })
      queryClient.invalidateQueries({ queryKey: ["nfts"] })
      refreshWallet()
      pushToast({
        title: "Demo Bid Recorded",
        description: `Escrowed in Demo Credits · Ref ${txId}`,
      })
    },
    onError: (err) => {
      setActionError(err.message || "Bid failed.")
    },
  })

  const patchMutation = useMutation({
    mutationFn: (payload) => updateNftListing(id, payload),
    onSuccess: () => {
      setEditing(false)
      setActionError("")
      queryClient.invalidateQueries({ queryKey: ["nft-detail", id] })
      queryClient.invalidateQueries({ queryKey: ["nfts"] })
      queryClient.invalidateQueries({ queryKey: ["my-nfts"] })
      pushToast({ title: "Listing Updated" })
    },
    onError: (err) => {
      setActionError(err.message || "Unable to update listing.")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteNftListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nfts"] })
      queryClient.invalidateQueries({ queryKey: ["my-nfts"] })
      pushToast({ title: "Listing Deleted" })
      navigate("/nft-gallery")
    },
    onError: (err) => {
      setConfirmDeleteOpen(false)
      setActionError(err.message || "Unable to delete listing.")
    },
  })

  if (detailQuery.isLoading) {
    return (
      <main className="min-h-screen bg-ca-bg text-ca-text px-4 sm:px-6 py-12">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-8">
          <div className="aspect-square rounded-2xl bg-ca-surface border border-ca-border animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 rounded bg-ca-surface animate-pulse" />
            <div className="h-24 w-full rounded-2xl bg-ca-surface animate-pulse" />
          </div>
        </div>
      </main>
    )
  }

  if (detailQuery.isError || !nft) {
    return (
      <main className="min-h-screen bg-ca-bg text-ca-text px-4 sm:px-6 py-16">
        <div className="container mx-auto max-w-xl">
          <EmptyState
            title="NFT Listing Not Found"
            description={detailQuery.error?.message || "This item may have been removed."}
            action={
              <Link
                to="/nft-gallery"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-ca-accent text-ca-text-inverse"
              >
                Return to NFT Catalog
              </Link>
            }
          />
        </div>
      </main>
    )
  }

  const minNextBid =
    nft.highestBidCredits > 0 ? nft.highestBidCredits + 1 : nft.priceCredits

  return (
    <main className="min-h-screen bg-ca-bg text-ca-text px-4 sm:px-6 py-10">
      <div className="container mx-auto max-w-6xl space-y-8">
        <Link
          to="/nft-gallery"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ca-text-muted hover:text-ca-text"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to NFT Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Artwork Image */}
          <div className="lg:col-span-6 bg-ca-surface border border-ca-border rounded-2xl overflow-hidden">
            <div className="aspect-square bg-ca-bg">
              <img
                src={nft.media?.secureUrl}
                alt={nft.media?.altText || nft.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone="neutral">{nft.category}</StatusBadge>
                <StatusBadge
                  tone={
                    nft.listingStatus === "active"
                      ? "accent"
                      : nft.listingStatus === "sold"
                      ? "positive"
                      : "warning"
                  }
                >
                  {nft.listingStatus} · {nft.listingType}
                </StatusBadge>
                <StatusBadge tone="neutral">Simulated · No Gas</StatusBadge>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-ca-text">
                {nft.title}
              </h1>

              {nft.description && (
                <p className="text-sm text-ca-text-secondary leading-relaxed">
                  {nft.description}
                </p>
              )}

              {Array.isArray(nft.tags) && nft.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {nft.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-ca-surface border border-ca-border text-ca-text-muted"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Ownership & Price Summary */}
            <div className="bg-ca-surface border border-ca-border rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-ca-divider pb-4">
                <div>
                  <span className="text-ca-text-muted block mb-1">Creator</span>
                  <span className="font-semibold text-ca-text block">{nft.creatorAlias}</span>
                  <span className="font-mono text-[11px] text-ca-text-muted">
                    {nft.creatorAccountId}
                  </span>
                </div>
                <div>
                  <span className="text-ca-text-muted block mb-1">Current Owner</span>
                  <span className="font-semibold text-ca-text block">{nft.ownerAlias}</span>
                  <span className="font-mono text-[11px] text-ca-text-muted">
                    {nft.ownerAccountId}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-ca-text-muted">
                  {nft.listingType === "auction"
                    ? nft.highestBidCredits > 0
                      ? "Current Highest Bid"
                      : "Reserve Price"
                    : "Fixed Price"}
                </span>
                <span className="text-2xl font-mono tabular-nums font-semibold text-ca-accent">
                  {Number(
                    nft.listingType === "auction" && nft.highestBidCredits > 0
                      ? nft.highestBidCredits
                      : nft.priceCredits
                  ).toLocaleString()}{" "}
                  CR
                </span>
              </div>

              {actionError && (
                <p role="alert" className="text-xs text-ca-negative">
                  {actionError}
                </p>
              )}

              {lastReceiptTx && (
                <div className="p-3 rounded-xl bg-ca-positive-bg border border-ca-accent-border text-xs space-y-1">
                  <p className="text-ca-positive font-semibold">
                    Transaction Confirmed ({lastReceiptTx})
                  </p>
                  <div className="flex gap-3 font-mono">
                    <Link to="/collection" className="underline text-ca-accent">
                      My Collection
                    </Link>
                    <Link to="/demo-activity" className="underline text-ca-accent">
                      Demo Activity
                    </Link>
                  </div>
                </div>
              )}

              {/* Buyer / Bidder CTA */}
              {!isOwner && nft.listingStatus === "active" && (
                <div className="pt-1 space-y-3">
                  {nft.listingType === "fixed" ? (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        if (!isDemoActive) {
                          openWalletModal("demo")
                          return
                        }
                        setActionError("")
                        setConfirmBuyOpen(true)
                      }}
                    >
                      {isDemoActive
                        ? `Buy Now for ${Number(nft.priceCredits).toLocaleString()} Demo Credits`
                        : "Start Demo Wallet to Purchase"}
                    </Button>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (!isDemoActive) {
                          openWalletModal("demo")
                          return
                        }
                        const val = Number.parseInt(bidInput, 10)
                        if (!Number.isInteger(val) || val < minNextBid) {
                          setActionError(`Enter an integer bid of at least ${minNextBid} CR.`)
                          return
                        }
                        bidMutation.mutate(val)
                      }}
                      className="flex flex-col sm:flex-row gap-2.5"
                    >
                      <div className="flex-1">
                        <Input
                          id="demo-nft-bid"
                          type="number"
                          min={minNextBid}
                          step="1"
                          placeholder={`Min bid ${minNextBid} CR`}
                          value={bidInput}
                          onChange={(e) => setBidInput(e.target.value)}
                          className="font-mono tabular-nums"
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="primary"
                        loading={bidMutation.isPending}
                      >
                        {isDemoActive ? "Place Demo Bid" : "Start Demo to Bid"}
                      </Button>
                    </form>
                  )}
                </div>
              )}

              {/* Owner Controls */}
              {isOwner && (
                <div className="pt-2 border-t border-ca-divider space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-ca-text">Owner Controls</span>
                    <div className="flex gap-2">
                      {!editing && nft.listingStatus !== "sold" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditPrice(String(nft.priceCredits))
                            setEditStatus(nft.listingStatus)
                            setEditing(true)
                          }}
                        >
                          Edit Listing
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmDeleteOpen(true)}
                      >
                        <Trash2 size={13} aria-hidden="true" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  {editing && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        patchMutation.mutate({
                          priceCredits: Number.parseInt(editPrice, 10),
                          listingStatus: editStatus,
                        })
                      }}
                      className="p-4 rounded-xl bg-ca-bg border border-ca-border space-y-3"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          id="edit-nft-price"
                          type="number"
                          min="1"
                          step="1"
                          label="Price (CR)"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="font-mono tabular-nums"
                        />
                        <Select
                          id="edit-nft-status"
                          label="Listing Status"
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          options={[
                            { value: "active", label: "Active" },
                            { value: "unlisted", label: "Unlisted" },
                          ]}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          size="sm"
                          loading={patchMutation.isPending}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Auction Bids Table */}
            {(nft.listingType === "auction" || bids.length > 0) && (
              <div className="bg-ca-surface border border-ca-border rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-ca-border bg-ca-bg flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-ca-text">Demo Bid History</h2>
                  <span className="text-xs font-mono text-ca-text-muted">
                    {bids.length} bids
                  </span>
                </div>
                <DataTable
                  rowKey="_id"
                  rows={bids}
                  emptyText="No bids placed on this work yet."
                  columns={[
                    {
                      key: "bidderAlias",
                      label: "Bidder",
                      render: (row) => (
                        <span className="text-ca-text font-medium">{row.bidderAlias}</span>
                      ),
                    },
                    {
                      key: "amountCredits",
                      label: "Bid",
                      align: "right",
                      cellClassName: "font-mono tabular-nums text-ca-accent font-semibold",
                      render: (row) => `${Number(row.amountCredits).toLocaleString()} CR`,
                    },
                    {
                      key: "status",
                      label: "State",
                      render: (row) => (
                        <StatusBadge
                          tone={row.status === "leading" ? "positive" : "neutral"}
                        >
                          {row.status}
                        </StatusBadge>
                      ),
                    },
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Confirm Dialog */}
      <Dialog
        isOpen={confirmBuyOpen}
        onClose={() => setConfirmBuyOpen(false)}
        title="Confirm Simulated Purchase"
        subtitle="Executes atomically in MongoDB using Demo Credits (no blockchain gas)."
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-ca-bg border border-ca-border text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-ca-text-muted">Artwork</span>
              <span className="font-semibold text-ca-text">{nft.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ca-text-muted">Price</span>
              <span className="font-mono text-ca-accent font-semibold">
                {Number(nft.priceCredits).toLocaleString()} CR
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ca-text-muted">Your Demo Balance</span>
              <span className="font-mono text-ca-text">
                {Number(wallet?.balanceCredits || 0).toLocaleString()} CR
              </span>
            </div>
          </div>

          {actionError && (
            <p role="alert" className="text-xs text-ca-negative">
              {actionError}
            </p>
          )}

          <div className="flex justify-end gap-2.5">
            <Button variant="outline" size="sm" onClick={() => setConfirmBuyOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={purchaseMutation.isPending}
              onClick={() => purchaseMutation.mutate()}
            >
              Confirm Purchase
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Delete NFT Listing"
        subtitle="Removes this item from the MongoDB catalog and cleans up unused Cloudinary media."
      >
        <div className="space-y-4">
          <p className="text-xs text-ca-text-secondary leading-relaxed">
            Delete <strong>{nft.title}</strong> permanently? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2.5">
            <Button variant="outline" size="sm" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </main>
  )
}

export default NftDetailPage
