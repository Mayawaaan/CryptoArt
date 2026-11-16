import React from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"
import SectionHeader from "../ui/SectionHeader"
import StatusBadge from "../ui/StatusBadge"
import Button from "../ui/Button"
import { SkeletonCard } from "../ui/Skeleton"
import { fetchNfts } from "../../services/demoApi"
import { useDemoWallet } from "../../hooks/useDemoWallet"

const NftShowcaseSection = () => {
  const { databaseConnected, isActive, openWalletModal } = useDemoWallet()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["nfts", { limit: 4, homeShowcase: true }],
    queryFn: ({ signal }) => fetchNfts({ limit: 4, sort: "newest" }, signal),
    enabled: databaseConnected,
    retry: false,
    staleTime: 30_000,
  })

  const items = data?.data?.items || []

  return (
    <section className="bg-ca-bg py-16 lg:py-24 px-4 sm:px-6 border-b border-ca-divider">
      <div className="container mx-auto space-y-10">
        <SectionHeader
          eyebrow="Creator Marketplace"
          title="Curated & Community NFTs"
          description="Explore digital works listed by creators with instant simulated Demo Credit checkout or auction bidding."
          actions={
            <div className="flex flex-wrap gap-2.5">
              <Button variant="soft" size="sm" onClick={() => openWalletModal("demo")}>
                {isActive ? "Demo Wallet Ready" : "Start Demo Wallet"}
              </Button>
              <Link
                to="/nft-gallery/create"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-ca-accent text-ca-text-inverse hover:bg-ca-accent-hover transition-colors"
              >
                Create NFT
              </Link>
              <Link
                to="/nft-gallery"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-ca-surface-raised border border-ca-border text-ca-text hover:border-ca-accent transition-colors"
              >
                Full Catalog
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>
          }
        />

        {!databaseConnected ? (
          <div className="rounded-2xl bg-ca-surface border border-ca-border p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <StatusBadge tone="warning">Catalog Offline</StatusBadge>
              <p className="text-sm text-ca-text-secondary max-w-2xl">
                Connect MongoDB in <code className="font-mono text-ca-text">backend/.env</code>{" "}
                and run <code className="font-mono text-ca-text">npm run seed:nfts</code> to
                display persistent creator listings and enable Demo Credit purchases.
              </p>
            </div>
            <Link
              to="/nft-gallery"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-ca-surface-raised border border-ca-border text-ca-text hover:border-ca-accent transition-colors"
            >
              Open NFT Gallery
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl bg-ca-surface border border-ca-border p-6 text-sm text-ca-text-secondary">
            {error?.message || "Unable to load featured NFTs."}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl bg-ca-surface border border-ca-border p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-base font-semibold text-ca-text">No artworks listed yet</p>
              <p className="text-sm text-ca-text-muted">
                Be the first to publish an artwork using Demo Credits and Cloudinary upload.
              </p>
            </div>
            <Link
              to="/nft-gallery/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-ca-accent text-ca-text-inverse hover:bg-ca-accent-hover transition-colors"
            >
              Create First NFT
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map((nft) => (
              <Link
                key={nft._id}
                to={`/nft-gallery/${nft._id}`}
                className="group rounded-2xl bg-ca-surface border border-ca-border hover:border-ca-accent overflow-hidden flex flex-col transition-colors"
              >
                <div className="aspect-square bg-ca-bg overflow-hidden">
                  <img
                    src={nft.media?.secureUrl}
                    alt={nft.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between gap-3 flex-1">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-ca-text-muted">
                        {nft.category}
                      </span>
                      <StatusBadge tone={nft.listingStatus === "sold" ? "neutral" : "accent"}>
                        {nft.listingStatus === "sold" ? "Sold" : nft.listingType}
                      </StatusBadge>
                    </div>
                    <h3 className="text-sm font-semibold text-ca-text truncate">{nft.title}</h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-ca-divider text-xs">
                    <span className="text-ca-text-muted">
                      {nft.listingType === "auction" ? "Top / Reserve" : "Price"}
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-ca-accent">
                      {Number(
                        nft.highestBidCredits > 0 ? nft.highestBidCredits : nft.priceCredits
                      ).toLocaleString()}{" "}
                      CR
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default NftShowcaseSection
