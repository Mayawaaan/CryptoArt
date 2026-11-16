import mongoose from "mongoose"
import { NFT_CATEGORIES } from "../models/NFT.js"

const CATEGORY_SET = new Set(NFT_CATEGORIES)

export function isValidObjectId(id) {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id)
}

export function sanitizeText(value, maxLen = 120) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLen)
}

export function validateCreateNftPayload(body = {}) {
  const title = sanitizeText(body.title, 120)
  if (title.length < 2) {
    return { valid: false, code: "INVALID_TITLE", message: "Title must be at least 2 characters." }
  }

  const description = sanitizeText(body.description, 1200)
  const category = CATEGORY_SET.has(body.category) ? body.category : "Art"

  const rawPrice = Number(body.priceCredits)
  if (!Number.isFinite(rawPrice) || !Number.isInteger(rawPrice) || rawPrice < 1 || rawPrice > 1_000_000) {
    return {
      valid: false,
      code: "INVALID_PRICE",
      message: "Price must be a whole integer between 1 and 1,000,000 demo credits.",
    }
  }

  const listingType = body.listingType === "auction" ? "auction" : "fixed"

  const media = body.media
  if (!media || typeof media.secureUrl !== "string" || !media.secureUrl.startsWith("https://")) {
    return {
      valid: false,
      code: "INVALID_MEDIA",
      message: "Valid Cloudinary HTTPS media metadata is required.",
    }
  }

  const tags = Array.isArray(body.tags)
    ? body.tags
        .map((t) => sanitizeText(t, 24).toLowerCase())
        .filter(Boolean)
        .slice(0, 6)
    : []

  return {
    valid: true,
    value: {
      title,
      description,
      category,
      tags,
      priceCredits: rawPrice,
      listingType,
      media: {
        publicId: media.publicId ? sanitizeText(media.publicId, 200) : null,
        secureUrl: media.secureUrl.trim(),
        width: Number.isFinite(Number(media.width)) ? Number(media.width) : null,
        height: Number.isFinite(Number(media.height)) ? Number(media.height) : null,
        format: media.format ? sanitizeText(media.format, 16) : null,
        bytes: Number.isFinite(Number(media.bytes)) ? Number(media.bytes) : null,
        altText: sanitizeText(media.altText || title, 160),
      },
      auctionEndsAt:
        listingType === "auction"
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          : null,
    },
  }
}

export function validatePatchNftPayload(body = {}) {
  const updates = {}

  if (body.title !== undefined) {
    const title = sanitizeText(body.title, 120)
    if (title.length < 2) {
      return { valid: false, code: "INVALID_TITLE", message: "Title must be at least 2 characters." }
    }
    updates.title = title
  }

  if (body.description !== undefined) {
    updates.description = sanitizeText(body.description, 1200)
  }

  if (body.category !== undefined) {
    if (!CATEGORY_SET.has(body.category)) {
      return { valid: false, code: "INVALID_CATEGORY", message: "Unsupported NFT category." }
    }
    updates.category = body.category
  }

  if (body.priceCredits !== undefined) {
    const rawPrice = Number(body.priceCredits)
    if (!Number.isFinite(rawPrice) || !Number.isInteger(rawPrice) || rawPrice < 1 || rawPrice > 1_000_000) {
      return {
        valid: false,
        code: "INVALID_PRICE",
        message: "Price must be a whole integer between 1 and 1,000,000 demo credits.",
      }
    }
    updates.priceCredits = rawPrice
  }

  if (body.listingStatus !== undefined) {
    if (!["active", "unlisted"].includes(body.listingStatus)) {
      return {
        valid: false,
        code: "INVALID_LISTING_STATUS",
        message: "Listing status may only be updated to active or unlisted.",
      }
    }
    updates.listingStatus = body.listingStatus
  }

  if (Object.keys(updates).length === 0) {
    return { valid: false, code: "EMPTY_UPDATE", message: "No valid editable fields supplied." }
  }

  return { valid: true, value: updates }
}
