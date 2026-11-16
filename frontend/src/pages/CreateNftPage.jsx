import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Upload } from "lucide-react"

import PageHeader from "../components/ui/PageHeader"
import { Input, Textarea } from "../components/ui/Input"
import Select from "../components/ui/Select"
import Button from "../components/ui/Button"
import StatusBadge from "../components/ui/StatusBadge"
import { createNftListing, uploadNftMedia } from "../services/demoApi"
import { useDemoWallet } from "../hooks/useDemoWallet"
import { useToast } from "../hooks/useToast"

const MAX_FILE_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"])

const CreateNftPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {
    isActive: isDemoActive,
    databaseConnected,
    cloudinaryConfigured,
    unavailableReason,
    refreshWallet,
    openWalletModal,
  } = useDemoWallet()
  const { pushToast } = useToast()

  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [uploadedMedia, setUploadedMedia] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Art")
  const [listingType, setListingType] = useState("fixed")
  const [priceCredits, setPriceCredits] = useState("150")
  const [tagsInput, setTagsInput] = useState("")
  const [description, setDescription] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setUploadError("")
    setUploadedMedia(null)

    if (!ALLOWED_MIME.has(selected.type)) {
      setUploadError("Unsupported file format. Please choose PNG, JPEG, or WebP.")
      return
    }
    if (selected.size > MAX_FILE_BYTES) {
      setUploadError("Image exceeds the 5 MB upload cap.")
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  const handleUploadMedia = async () => {
    if (!file) return null
    if (!isDemoActive) {
      openWalletModal("demo")
      return null
    }
    try {
      setUploading(true)
      setUploadError("")
      const res = await uploadNftMedia(file)
      setUploadedMedia(res.data)
      pushToast({
        title: "Artwork Uploaded",
        description: `Stored on Cloudinary (${res.data.width}×${res.data.height}px).`,
      })
      return res.data
    } catch (err) {
      setUploadError(err.message || "Media upload failed.")
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError("")

    if (!isDemoActive) {
      openWalletModal("demo")
      return
    }

    const parsedPrice = Number.parseInt(priceCredits, 10)
    if (!title.trim() || title.trim().length < 2) {
      setSubmitError("Title must be at least 2 characters.")
      return
    }
    if (!Number.isInteger(parsedPrice) || parsedPrice < 1 || parsedPrice > 1_000_000) {
      setSubmitError("Price must be a whole integer between 1 and 1,000,000 Demo Credits.")
      return
    }

    let mediaPayload = uploadedMedia
    if (!mediaPayload) {
      if (!file) {
        setSubmitError("Select an artwork file before publishing.")
        return
      }
      mediaPayload = await handleUploadMedia()
      if (!mediaPayload) return
    }

    try {
      setSubmitting(true)
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 6)

      const res = await createNftListing({
        title: title.trim(),
        description: description.trim(),
        category,
        tags,
        priceCredits: parsedPrice,
        listingType,
        media: {
          ...mediaPayload,
          altText: title.trim(),
        },
      })

      refreshWallet()
      queryClient.invalidateQueries({ queryKey: ["nfts"] })
      queryClient.invalidateQueries({ queryKey: ["my-nfts"] })

      pushToast({
        title: "NFT Listing Published",
        description: `"${res.data?.nft?.title}" is now live in the marketplace.`,
      })

      navigate(`/nft-gallery/${res.data.nft._id}`)
    } catch (err) {
      setSubmitError(err.message || "Failed to publish listing.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-ca-bg text-ca-text px-4 sm:px-6 py-10">
      <div className="container mx-auto max-w-5xl space-y-8">
        <div>
          <Link
            to="/nft-gallery"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ca-text-muted hover:text-ca-text mb-4"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to NFT Catalog
          </Link>

          <PageHeader
            eyebrow="Creator Studio"
            title="Create Demo NFT Listing"
            description="Upload verified PNG, JPEG, or WebP artwork to Cloudinary and store metadata in MongoDB under your Demo Wallet."
          />
        </div>

        {!databaseConnected && (
          <div className="p-4 rounded-2xl bg-ca-warning-bg border border-ca-border-strong text-xs text-ca-warning space-y-1">
            <p className="font-semibold">MongoDB Disconnected</p>
            <p>{unavailableReason}</p>
          </div>
        )}

        {databaseConnected && !cloudinaryConfigured && (
          <div className="p-4 rounded-2xl bg-ca-warning-bg border border-ca-border-strong text-xs text-ca-warning space-y-1">
            <p className="font-semibold">Cloudinary Credentials Not Configured</p>
            <p>
              Set <code className="font-mono">CLOUDINARY_CLOUD_NAME</code>,{" "}
              <code className="font-mono">CLOUDINARY_API_KEY</code>, and{" "}
              <code className="font-mono">CLOUDINARY_API_SECRET</code> inside{" "}
              <code className="font-mono">backend/.env</code> to upload media files.
            </p>
          </div>
        )}

        {!isDemoActive && databaseConnected && (
          <div className="p-5 rounded-2xl bg-ca-surface border border-ca-accent-border flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-ca-text">Demo Session Required</p>
              <p className="text-xs text-ca-text-muted">
                Start a Demo Wallet session to sign ownership and upload media files.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => openWalletModal("demo")}>
              Start Demo Wallet (10,000 CR)
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Media Dropzone / Preview */}
          <div className="lg:col-span-5 bg-ca-surface border border-ca-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ca-text-muted">
                Artwork Media
              </span>
              {uploadedMedia && <StatusBadge tone="positive">Uploaded</StatusBadge>}
            </div>

            <div className="aspect-square rounded-xl bg-ca-bg border border-dashed border-ca-border-strong overflow-hidden flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Selected artwork preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Upload size={22} className="mx-auto text-ca-text-muted" aria-hidden="true" />
                  <p className="text-xs text-ca-text-secondary">
                    PNG, JPEG, or WebP up to 5 MB
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              <label
                htmlFor="nft-media-input"
                className="cursor-pointer block w-full text-center px-4 py-2.5 rounded-xl text-xs font-semibold bg-ca-surface-raised border border-ca-border hover:border-ca-accent text-ca-text transition-colors"
              >
                {file ? `Replace (${file.name})` : "Choose Image File"}
              </label>
              <input
                id="nft-media-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="sr-only"
              />

              {file && !uploadedMedia && (
                <Button
                  variant="soft"
                  size="sm"
                  loading={uploading}
                  disabled={!cloudinaryConfigured || !isDemoActive}
                  onClick={handleUploadMedia}
                  className="w-full"
                >
                  Upload Artwork to Cloudinary
                </Button>
              )}

              {uploadedMedia && (
                <p className="text-[11px] font-mono text-ca-text-muted text-center">
                  {uploadedMedia.width}×{uploadedMedia.height}px ·{" "}
                  {Math.round((uploadedMedia.bytes || 0) / 1024)} KB ·{" "}
                  {uploadedMedia.format?.toUpperCase()}
                </p>
              )}

              {uploadError && (
                <p role="alert" className="text-xs text-ca-negative">
                  {uploadError}
                </p>
              )}
            </div>
          </div>

          {/* Listing Metadata */}
          <div className="lg:col-span-7 bg-ca-surface border border-ca-border rounded-2xl p-6 space-y-5">
            <Input
              id="nft-title"
              label="Artwork Title"
              placeholder="e.g., Meridian Study IV"
              required
              minLength={2}
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <Select
                id="nft-category"
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: "Art", label: "Art" },
                  { value: "Collectibles", label: "Collectibles" },
                  { value: "Music", label: "Music" },
                  { value: "Gaming", label: "Gaming" },
                  { value: "Domain Names", label: "Domain Names" },
                ]}
              />

              <Select
                id="nft-listing-type"
                label="Listing Format"
                value={listingType}
                onChange={(e) => setListingType(e.target.value)}
                options={[
                  { value: "fixed", label: "Fixed Price (Instant Demo Buy)" },
                  { value: "auction", label: "7-Day Demo Auction" },
                ]}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                id="nft-price"
                type="number"
                min="1"
                max="1000000"
                step="1"
                label={
                  listingType === "auction"
                    ? "Reserve Price (Demo Credits)"
                    : "Listing Price (Demo Credits)"
                }
                value={priceCredits}
                onChange={(e) => setPriceCredits(e.target.value)}
                className="font-mono tabular-nums"
              />

              <Input
                id="nft-tags"
                label="Tags (Comma-separated)"
                placeholder="generative, vector, study"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            <Textarea
              id="nft-description"
              label="Description"
              rows={4}
              maxLength={1200}
              placeholder="Materials, resolution notes, or provenance context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {submitError && (
              <p role="alert" className="text-xs text-ca-negative">
                {submitError}
              </p>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-ca-divider">
              <span className="text-xs text-ca-text-muted">
                Listed off-chain under simulated Demo Credits (zero gas).
              </span>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={submitting || uploading}
                disabled={!databaseConnected}
              >
                Publish Demo NFT
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}

export default CreateNftPage
