const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5 MB
const MAX_DIMENSION = 8192
const MIN_DIMENSION = 16

const ALLOWED_MIMES = new Set(["image/jpeg", "image/png", "image/webp"])

function detectImageSignature(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return null

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    if (buffer.length < 24) return null
    const width = buffer.readUInt32BE(16)
    const height = buffer.readUInt32BE(20)
    return { format: "png", mime: "image/png", width, height }
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    let offset = 2
    while (offset + 4 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1
        continue
      }
      const marker = buffer[offset + 1]
      // SOF0..SOF2 markers carry dimensions
      if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
        if (offset + 9 <= buffer.length) {
          const height = buffer.readUInt16BE(offset + 5)
          const width = buffer.readUInt16BE(offset + 7)
          return { format: "jpeg", mime: "image/jpeg", width, height }
        }
        break
      }
      if (marker === 0xd8 || marker === 0xd9 || marker === 0x00) {
        offset += 2
        continue
      }
      const segLen = buffer.readUInt16BE(offset + 2)
      if (segLen < 2) break
      offset += 2 + segLen
    }
    return { format: "jpeg", mime: "image/jpeg", width: null, height: null }
  }

  // WebP: RIFF....WEBP
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    const chunk = buffer.toString("ascii", 12, 16)
    let width = null
    let height = null
    if (chunk === "VP8X" && buffer.length >= 30) {
      width = 1 + buffer.readUIntLE(24, 3)
      height = 1 + buffer.readUIntLE(27, 3)
    } else if (chunk === "VP8 " && buffer.length >= 30) {
      width = buffer.readUInt16LE(26) & 0x3fff
      height = buffer.readUInt16LE(28) & 0x3fff
    } else if (chunk === "VP8L" && buffer.length >= 25) {
      const bits = buffer.readUInt32LE(21)
      width = (bits & 0x3fff) + 1
      height = ((bits >> 14) & 0x3fff) + 1
    }
    return { format: "webp", mime: "image/webp", width, height }
  }

  return null
}

export function validateUploadedImage(file) {
  if (!file || !Buffer.isBuffer(file.buffer) || file.buffer.length === 0) {
    return { valid: false, code: "MISSING_FILE", message: "An image file upload is required." }
  }

  if (file.size > MAX_UPLOAD_BYTES || file.buffer.length > MAX_UPLOAD_BYTES) {
    return {
      valid: false,
      code: "FILE_TOO_LARGE",
      message: "Image must be 5 MB or smaller.",
    }
  }

  if (file.mimetype && !ALLOWED_MIMES.has(file.mimetype.toLowerCase())) {
    return {
      valid: false,
      code: "UNSUPPORTED_MIME",
      message: "Only JPEG, PNG, and WebP images are permitted.",
    }
  }

  const detected = detectImageSignature(file.buffer)
  if (!detected) {
    return {
      valid: false,
      code: "INVALID_IMAGE_CONTENT",
      message: "File content does not match a valid JPEG, PNG, or WebP signature.",
    }
  }

  if (
    detected.width !== null &&
    detected.height !== null &&
    (detected.width < MIN_DIMENSION ||
      detected.height < MIN_DIMENSION ||
      detected.width > MAX_DIMENSION ||
      detected.height > MAX_DIMENSION)
  ) {
    return {
      valid: false,
      code: "INVALID_IMAGE_DIMENSIONS",
      message: `Image dimensions must be between ${MIN_DIMENSION}px and ${MAX_DIMENSION}px.`,
    }
  }

  return {
    valid: true,
    ...detected,
    bytes: file.buffer.length,
  }
}
