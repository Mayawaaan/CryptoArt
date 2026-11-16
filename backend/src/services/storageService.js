import fs from "node:fs/promises"
import path from "node:path"
import crypto from "node:crypto"

const INITIAL_STORE = {
  newsletter: [],
  supportRequests: [],
  nftBids: [],
}

export function createStorageService(filePath) {
  let writeChain = Promise.resolve()

  async function ensureStore() {
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    try {
      const raw = await fs.readFile(filePath, "utf8")
      const parsed = JSON.parse(raw)
      return {
        newsletter: Array.isArray(parsed.newsletter) ? parsed.newsletter : [],
        supportRequests: Array.isArray(parsed.supportRequests) ? parsed.supportRequests : [],
        nftBids: Array.isArray(parsed.nftBids) ? parsed.nftBids : [],
      }
    } catch (err) {
      if (err.code === "ENOENT") {
        await fs.writeFile(filePath, JSON.stringify(INITIAL_STORE, null, 2), "utf8")
        return structuredClone(INITIAL_STORE)
      }
      throw err
    }
  }

  function mutateStore(mutator) {
    const task = writeChain.then(async () => {
      const store = await ensureStore()
      const result = await mutator(store)
      await fs.writeFile(filePath, JSON.stringify(store, null, 2), "utf8")
      return result
    })
    writeChain = task.catch(() => {})
    return task
  }

  return {
    async subscribeNewsletter(email) {
      const normalized = email.trim().toLowerCase()
      return mutateStore((store) => {
        const existing = store.newsletter.find((item) => item.email === normalized)
        if (existing) {
          return { alreadySubscribed: true, email: normalized, subscribedAt: existing.subscribedAt }
        }
        const entry = {
          id: crypto.randomUUID(),
          email: normalized,
          subscribedAt: new Date().toISOString(),
        }
        store.newsletter.push(entry)
        return { alreadySubscribed: false, ...entry }
      })
    },

    async createSupportRequest({ name, email, category, priority, message }) {
      return mutateStore((store) => {
        const ticketId = `CA-${crypto.randomBytes(3).toString("hex").toUpperCase()}`
        const entry = {
          ticketId,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          category,
          priority: priority || "Medium",
          message: message.trim(),
          createdAt: new Date().toISOString(),
          status: "Queued",
        }
        store.supportRequests.push(entry)
        return entry
      })
    },

    async listNftBids() {
      const store = await ensureStore()
      return store.nftBids
    },

    async addNftBid({ nftId, amountInr, bidder }) {
      return mutateStore((store) => {
        const entry = {
          id: crypto.randomUUID(),
          nftId: Number(nftId),
          amountInr: Number(amountInr),
          bidder: bidder ? String(bidder).trim() : "Demo Collector",
          createdAt: new Date().toISOString(),
          mode: "offchain-prototype",
        }
        store.nftBids.push(entry)
        return entry
      })
    },
  }
}
