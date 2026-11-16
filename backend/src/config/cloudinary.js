import { v2 as cloudinary } from "cloudinary"

export function createCloudinaryService({ cloudName, apiKey, apiSecret }) {
  const configured = Boolean(cloudName && apiKey && apiSecret)

  if (configured) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    })
  }

  return {
    isConfigured() {
      return configured
    },

    async uploadImageBuffer(buffer, { folder = "cryptoart/demo-nfts", publicId } = {}) {
      if (!configured) {
        const err = new Error(
          "Cloudinary credentials are not configured on the backend (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)."
        )
        err.status = 503
        err.provider = "cloudinary"
        throw err
      }

      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: publicId,
            resource_type: "image",
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            transformation: [{ quality: "auto", fetch_format: "auto" }],
          },
          (error, result) => {
            if (error) {
              const err = new Error(`Cloudinary upload failed: ${error.message}`)
              err.status = 502
              err.provider = "cloudinary"
              reject(err)
              return
            }
            resolve({
              publicId: result.public_id,
              secureUrl: result.secure_url,
              width: result.width,
              height: result.height,
              format: result.format,
              bytes: result.bytes,
            })
          }
        )
        stream.end(buffer)
      })
    },

    async deleteImage(publicId) {
      if (!configured || !publicId) return { skipped: true }
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true,
      })
      return result
    },
  }
}
