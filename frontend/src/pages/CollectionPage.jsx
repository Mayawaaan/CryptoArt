import React from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import PageHeader from "../components/ui/PageHeader"
import Button from "../components/ui/Button"
import StatusBadge from "../components/ui/StatusBadge"
import EmptyState from "../components/ui/EmptyState"
import { SkeletonCard } from "../components/ui/Skeleton"
import { fetchMyNfts } from "../services/demoApi"
import { useDemoWallet } from "../hooks/useDemoWallet"

const CollectionPage = () => {
  const { wallet, isActive, databaseConnected, unavailableReason, openWalletModal } =
    useDemoWallet()

  const collectionQuery = useQuery({
    queryKey: ["my-nfts"],
    queryFn: ({ signal }) => fetchMyNfts({ limit: 24 }, signal),
    enabled: databaseConnected && isActive,
    retry: false,
  })

  const items = collectionQuery.data?.data?.items || []

  return (
    <main className="min-h-screen bg-ca-bg text-ca-text px-4 sm:px-6 py-10">
      <div className="container mx-auto space-y-8">
        <PageHeader
          eyebrow="Demo Collector Portfolio"
          title="My Collection"
          description="Artworks created or collected using your signed Demo Wallet session."
          actions={
            <div className="flex flex-wrap gap-2.5">
              <Link
                to="/nft-gallery/create"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-ca-accent text-ca-text-inverse hover:bg-ca-accent-hover transition-colors"
              >
                Create NFT
              </Link>
              <Link
                to="/demo-activity"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-ca-surface-raised border border-ca-border text-ca-text hover:border-ca-accent transition-colors"
              >
                Demo Activity
              </Link>
            </div>
          }
        />

        {!databaseConnected ? (
          <EmptyState
            title="Database Required"
            description={unavailableReason}
          />
        ) : !isActive ? (
          <EmptyState
            title="Start a Demo Wallet Session"
            description="Initialize a simulated 10,000 Demo Credit account to create, own, and manage NFT artworks."
            action={
              <Button variant="primary" onClick={() => openWalletModal("demo")}>
                Start Demo Session (10,000 CR)
              </Button>
            }
          />
        ) : collectionQuery.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : collectionQuery.isError ? (
          <EmptyState
            title="Unable to Load Collection"
            description={collectionQuery.error?.message}
          />
        ) : items.length === 0 ? (
          <EmptyState
            title="Your Collection is Empty"
            description="Browse the NFT catalog to collect artworks or upload a creation of your own."
            action={
              <div className="flex justify-center gap-3">
                <Link
                  to="/nft-gallery"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-ca-surface-raised border border-ca-border text-ca-text"
                >
                  Browse Catalog
                </Link>
                <Link
                  to="/nft-gallery/create"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-ca-accent text-ca-text-inverse"
                >
                  Create NFT
                </Link>
              </div>
            }
          />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-ca-surface border border-ca-border text-xs">
              <div className="font-mono text-ca-text-secondary">
                Account <span className="text-ca-text font-semibold">{wallet.accountId}</span> ·{" "}
                {items.length} artwork(s) held
              </div>
              <StatusBadge tone="accent" className="tabular-nums">
                Balance: {Number(wallet.balanceCredits || 0).toLocaleString()} CR
              </StatusBadge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {items.map((nft) => {
                const isCreator = nft.creatorAccountId === wallet.accountId
                return (
                  <Link
                    key={nft._id}
                    to={`/nft-gallery/${nft._id}`}
                    className="group rounded-2xl bg-ca-surface border border-ca-border hover:border-ca-accent overflow-hidden flex flex-col transition-colors"
                  >
                    <div className="aspect-square bg-ca-bg overflow-hidden">
                      <img
                        src={nft.media?.secureUrl}
                        alt={nft.media?.altText || nft.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <StatusBadge tone={isCreator ? "accent" : "positive"}>
                          {isCreator ? "Created" : "Collected"}
                        </StatusBadge>
                        <StatusBadge tone="neutral">{nft.listingStatus}</StatusBadge>
                      </div>
                      <h2 className="text-sm font-semibold text-ca-text truncate">{nft.title}</h2>
                      <p className="text-xs font-mono tabular-nums text-ca-text-muted">
                        List Value: {Number(nft.priceCredits).toLocaleString()} CR
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default CollectionPage
