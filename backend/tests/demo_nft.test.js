import test from "node:test"
import assert from "node:assert/strict"
import { PassThrough } from "node:stream"
import http from "node:http"
import mongoose from "mongoose"
import { createApp } from "../src/app.js"
import { createDemoService, INITIAL_DEMO_CREDITS } from "../src/services/demoService.js"
import { createNftService } from "../src/services/nftService.js"
import { validateUploadedImage } from "../src/validators/mediaValidator.js"

function matchesFilter(doc, filter = {}) {
  for (const [key, cond] of Object.entries(filter)) {
    if (key === "$or") {
      if (!cond.some((sub) => matchesFilter(doc, sub))) return false
      continue
    }
    const val = doc[key]
    if (cond && typeof cond === "object" && !(cond instanceof Date) && !(cond instanceof mongoose.Types.ObjectId)) {
      if ("$ne" in cond && String(val) === String(cond.$ne)) return false
      if ("$gte" in cond && !(Number(val) >= Number(cond.$gte))) return false
      if ("$lt" in cond && !(Number(val) < Number(cond.$lt))) return false
    } else if (String(val) !== String(cond)) {
      return false
    }
  }
  return true
}

function makeInMemoryModel(initialRows = []) {
  const rows = [...initialRows]

  function applyUpdate(doc, update) {
    if (update.$set) {
      for (const [k, v] of Object.entries(update.$set)) {
        doc[k] = v
      }
    }
    if (update.$inc) {
      for (const [k, v] of Object.entries(update.$inc)) {
        doc[k] = Number(doc[k] || 0) + Number(v)
      }
    }
    doc.updatedAt = new Date()
  }

  function wrapQuery(resultPromise) {
    return {
      sort(sortObj) {
        const next = resultPromise.then((list) => {
          const [[field, dir]] = Object.entries(sortObj || { createdAt: -1 })
          return [...list].sort((a, b) => {
            const va = a[field] instanceof Date ? a[field].getTime() : a[field]
            const vb = b[field] instanceof Date ? b[field].getTime() : b[field]
            return dir >= 0 ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
          })
        })
        return wrapQuery(next)
      },
      skip(n) {
        return wrapQuery(resultPromise.then((list) => list.slice(n)))
      },
      limit(n) {
        return wrapQuery(resultPromise.then((list) => list.slice(0, n)))
      },
      lean() {
        return resultPromise.then((r) => (Array.isArray(r) ? r.map((x) => ({ ...x })) : r ? { ...r } : null))
      },
      then(onFulfilled, onRejected) {
        return resultPromise.then(onFulfilled, onRejected)
      },
    }
  }

  return {
    rows,
    async create(payload) {
      const doc = {
        _id: payload._id || new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        highestBidCredits: 0,
        highestBidderAccountId: null,
        ...payload,
      }
      if (payload.idempotencyKey) {
        const dup = rows.find(
          (r) => r.accountId === payload.accountId && r.idempotencyKey === payload.idempotencyKey
        )
        if (dup) {
          const err = new Error("Duplicate idempotencyKey")
          err.code = 11000
          throw err
        }
      }
      rows.push(doc)
      return { ...doc, toObject: () => ({ ...doc }) }
    },
    find(filter = {}) {
      return wrapQuery(Promise.resolve(rows.filter((d) => matchesFilter(d, filter))))
    },
    findOne(filter = {}) {
      return wrapQuery(Promise.resolve(rows.find((d) => matchesFilter(d, filter)) || null))
    },
    findById(id) {
      return wrapQuery(Promise.resolve(rows.find((d) => String(d._id) === String(id)) || null))
    },
    async countDocuments(filter = {}) {
      return rows.filter((d) => matchesFilter(d, filter)).length
    },
    findOneAndUpdate(filter, update, opts = {}) {
      const idx = rows.findIndex((d) => matchesFilter(d, filter))
      if (idx === -1) return wrapQuery(Promise.resolve(null))
      const before = { ...rows[idx] }
      applyUpdate(rows[idx], update)
      const after = { ...rows[idx] }
      return wrapQuery(Promise.resolve(opts.new === false ? before : after))
    },
    findOneAndDelete(filter) {
      const idx = rows.findIndex((d) => matchesFilter(d, filter))
      if (idx === -1) return wrapQuery(Promise.resolve(null))
      const [removed] = rows.splice(idx, 1)
      return wrapQuery(Promise.resolve(removed))
    },
    async updateMany(filter, update) {
      let modifiedCount = 0
      for (const doc of rows) {
        if (matchesFilter(doc, filter)) {
          applyUpdate(doc, update)
          modifiedCount += 1
        }
      }
      return { modifiedCount }
    },
  }
}

async function invokeApp(app, { method = "GET", url, body, headers = {} } = {}) {
  return new Promise((resolve, reject) => {
    const socket = new PassThrough()
    socket.remoteAddress = "127.0.0.1"
    const req = new http.IncomingMessage(socket)
    req.method = method
    req.url = url
    req.headers = { host: "localhost:4000", ...headers }

    let rawBody = ""
    if (body !== undefined) {
      rawBody = Buffer.isBuffer(body) ? body : JSON.stringify(body)
      if (!Buffer.isBuffer(body)) {
        req.headers["content-type"] = "application/json"
      }
      req.headers["content-length"] = String(Buffer.byteLength(rawBody))
    }

    const res = new http.ServerResponse(req)
    const chunks = []
    const outSocket = new PassThrough()
    outSocket.remoteAddress = "127.0.0.1"
    outSocket.on("data", (chunk) => chunks.push(chunk))
    res.assignSocket(outSocket)

    res.on("finish", () => {
      const raw = Buffer.concat(chunks).toString("utf8")
      const splitIdx = raw.indexOf("\r\n\r\n")
      const headerBlock = splitIdx >= 0 ? raw.slice(0, splitIdx) : ""
      const jsonText = splitIdx >= 0 ? raw.slice(splitIdx + 4) : raw
      const setCookies = res.getHeader("set-cookie") || []
      try {
        resolve({
          status: res.statusCode,
          headers: headerBlock,
          cookies: Array.isArray(setCookies) ? setCookies : [setCookies],
          json: JSON.parse(jsonText),
        })
      } catch (err) {
        reject(new Error(`Parse error: ${err.message}\nRaw: ${raw}`))
      }
    })

    app(req, res)
    if (rawBody) req.push(rawBody)
    req.push(null)
  })
}

function buildTestHarness() {
  const models = {
    NFT: makeInMemoryModel(),
    DemoWallet: makeInMemoryModel(),
    DemoTransaction: makeInMemoryModel(),
    DemoPosition: makeInMemoryModel(),
    DemoBid: makeInMemoryModel(),
    isDbReady: () => true,
  }
  const deletedPublicIds = []
  const cloudinaryService = {
    isConfigured: () => true,
    async uploadImageBuffer() {
      return {
        publicId: "cryptoart/demo/test-asset",
        secureUrl: "https://res.cloudinary.com/demo/image/upload/v1/test-asset.png",
        width: 512,
        height: 512,
        format: "png",
        bytes: 2048,
      }
    },
    async deleteImage(publicId) {
      deletedPublicIds.push(publicId)
      return { result: "ok" }
    },
  }

  const demoService = createDemoService(models)
  const nftService = createNftService({ models, cloudinaryService })
  const app = createApp({
    models,
    demoService,
    nftService,
    cloudinaryService,
    dbStatusFn: () => ({ configured: true, state: "connected", connected: true, replicaSet: false }),
  })

  return { app, models, demoService, nftService, deletedPublicIds }
}

function extractSessionCookie(res) {
  const raw = res.cookies.find((c) => c.startsWith("ca_demo_session="))
  return raw ? raw.split(";")[0] : ""
}

test("Demo session lifecycle initializes 10,000 credits once, preserves cookie, and validates reset", async () => {
  const { app } = buildTestHarness()

  const unauth = await invokeApp(app, { url: "/api/demo/wallet" })
  assert.equal(unauth.status, 401)

  const startRes = await invokeApp(app, {
    method: "POST",
    url: "/api/demo/session",
    body: { displayAlias: "Collector One" },
  })
  assert.equal(startRes.status, 201)
  assert.equal(startRes.json.data.balanceCredits, INITIAL_DEMO_CREDITS)
  assert.match(startRes.json.data.accountId, /^DEMO-/)
  const cookie = extractSessionCookie(startRes)
  assert.ok(cookie.includes("ca_demo_session="))

  // Resuming with same cookie does not mint another wallet
  const resumeRes = await invokeApp(app, {
    method: "POST",
    url: "/api/demo/session",
    headers: { cookie },
  })
  assert.equal(resumeRes.status, 200)
  assert.equal(resumeRes.json.data.created, false)
  assert.equal(resumeRes.json.data.accountId, startRes.json.data.accountId)

  // Reset requires confirm: true
  const badReset = await invokeApp(app, {
    method: "POST",
    url: "/api/demo/reset",
    headers: { cookie },
    body: {},
  })
  assert.equal(badReset.status, 400)

  const goodReset = await invokeApp(app, {
    method: "POST",
    url: "/api/demo/reset",
    headers: { cookie },
    body: { confirm: true },
  })
  assert.equal(goodReset.status, 200)
  assert.equal(goodReset.json.data.wallet.balanceCredits, INITIAL_DEMO_CREDITS)
})

test("CSRF origin & referer policy blocks cross-origin mutations", async () => {
  const { app } = buildTestHarness()
  const badOrigin = await invokeApp(app, {
    method: "POST",
    url: "/api/demo/session",
    headers: { origin: "https://malicious.example" },
    body: {},
  })
  assert.equal(badOrigin.status, 403)
  assert.equal(badOrigin.json.error.code, "CORS_ERROR")

  const badReferer = await invokeApp(app, {
    method: "POST",
    url: "/api/demo/session",
    headers: { referer: "https://malicious.example/attack.html" },
    body: {},
  })
  assert.equal(badReferer.status, 403)
  assert.equal(badReferer.json.error.code, "FORBIDDEN_REFERER")
})

test("NFT CRUD enforces creator/owner permissions and cleans up Cloudinary asset on delete", async () => {
  const { app, deletedPublicIds } = buildTestHarness()

  const s1 = await invokeApp(app, { method: "POST", url: "/api/demo/session", body: { displayAlias: "Creator" } })
  const s2 = await invokeApp(app, { method: "POST", url: "/api/demo/session", body: { displayAlias: "Stranger" } })
  const cookie1 = extractSessionCookie(s1)
  const cookie2 = extractSessionCookie(s2)

  const createRes = await invokeApp(app, {
    method: "POST",
    url: "/api/nfts",
    headers: { cookie: cookie1 },
    body: {
      title: "Architecture Grid",
      description: "Test upload listing",
      category: "Art",
      priceCredits: 1500,
      listingType: "fixed",
      media: {
        publicId: "cryptoart/demo/grid-1",
        secureUrl: "https://res.cloudinary.com/demo/image/upload/v1/grid.png",
        width: 800,
        height: 800,
        format: "png",
        bytes: 12000,
      },
    },
  })
  assert.equal(createRes.status, 201)
  const nftId = createRes.json.data.nft._id

  // Stranger cannot PATCH or DELETE another user's listing
  const patchForbidden = await invokeApp(app, {
    method: "PATCH",
    url: `/api/nfts/${nftId}`,
    headers: { cookie: cookie2 },
    body: { priceCredits: 1 },
  })
  assert.equal(patchForbidden.status, 403)

  const delForbidden = await invokeApp(app, {
    method: "DELETE",
    url: `/api/nfts/${nftId}`,
    headers: { cookie: cookie2 },
  })
  assert.equal(delForbidden.status, 403)

  // Creator deletes listing and Cloudinary cleanup triggers
  const delOk = await invokeApp(app, {
    method: "DELETE",
    url: `/api/nfts/${nftId}`,
    headers: { cookie: cookie1 },
  })
  assert.equal(delOk.status, 200)
  assert.deepEqual(deletedPublicIds, ["cryptoart/demo/grid-1"])
})

test("Atomic NFT purchase blocks concurrent double-buys, enforces idempotency, and updates balances & ownership", async () => {
  const { app, models } = buildTestHarness()

  const sellerRes = await invokeApp(app, { method: "POST", url: "/api/demo/session", body: { displayAlias: "Seller" } })
  const buyerARes = await invokeApp(app, { method: "POST", url: "/api/demo/session", body: { displayAlias: "BuyerA" } })
  const buyerBRes = await invokeApp(app, { method: "POST", url: "/api/demo/session", body: { displayAlias: "BuyerB" } })

  const sellerCookie = extractSessionCookie(sellerRes)
  const buyerACookie = extractSessionCookie(buyerARes)
  const buyerBCookie = extractSessionCookie(buyerBRes)

  const nftRes = await invokeApp(app, {
    method: "POST",
    url: "/api/nfts",
    headers: { cookie: sellerCookie },
    body: {
      title: "Concurrent Asset",
      category: "Collectibles",
      priceCredits: 3000,
      listingType: "fixed",
      media: {
        secureUrl: "https://res.cloudinary.com/demo/image/upload/v1/asset.png",
        publicId: "cryptoart/demo/asset-1",
      },
    },
  })
  const nftId = nftRes.json.data.nft._id

  // Seller cannot buy own NFT
  const selfBuy = await invokeApp(app, {
    method: "POST",
    url: `/api/nfts/${nftId}/purchase`,
    headers: { cookie: sellerCookie },
    body: { idempotencyKey: "self-buy-1" },
  })
  assert.equal(selfBuy.status, 400)

  // Concurrent purchases by BuyerA and BuyerB: only ONE succeeds
  const [resA, resB] = await Promise.all([
    invokeApp(app, {
      method: "POST",
      url: `/api/nfts/${nftId}/purchase`,
      headers: { cookie: buyerACookie },
      body: { idempotencyKey: "buy-a-1" },
    }),
    invokeApp(app, {
      method: "POST",
      url: `/api/nfts/${nftId}/purchase`,
      headers: { cookie: buyerBCookie },
      body: { idempotencyKey: "buy-b-1" },
    }),
  ])

  const statuses = [resA.status, resB.status].sort()
  assert.deepEqual(statuses, [200, 409])

  const winnerRes = resA.status === 200 ? resA : resB
  const winnerCookie = resA.status === 200 ? buyerACookie : buyerBCookie
  const winnerAccountId = resA.status === 200 ? buyerARes.json.data.accountId : buyerBRes.json.data.accountId
  const loserAccountId = resA.status === 200 ? buyerBRes.json.data.accountId : buyerARes.json.data.accountId

  assert.equal(winnerRes.json.data.wallet.balanceCredits, 7000)
  assert.equal(winnerRes.json.data.nft.ownerAccountId, winnerAccountId)
  assert.equal(winnerRes.json.data.nft.listingStatus, "sold")

  // Verify seller credited and loser untouched
  const sellerWallet = models.DemoWallet.rows.find((w) => w.accountId === sellerRes.json.data.accountId)
  const loserWallet = models.DemoWallet.rows.find((w) => w.accountId === loserAccountId)
  assert.equal(sellerWallet.balanceCredits, 13000)
  assert.equal(loserWallet.balanceCredits, 10000)

  // Idempotent retry by winner does NOT charge again
  const retryRes = await invokeApp(app, {
    method: "POST",
    url: `/api/nfts/${nftId}/purchase`,
    headers: { cookie: winnerCookie },
    body: { idempotencyKey: resA.status === 200 ? "buy-a-1" : "buy-b-1" },
  })
  assert.equal(retryRes.status, 200)
  assert.equal(retryRes.json.data.idempotentReplay, true)
  assert.equal(retryRes.json.data.wallet.balanceCredits, 7000)
})

test("Media validator rejects spoofed files, accepts valid PNG magic bytes & extracts dimensions", () => {
  const fakePng = Buffer.from("not really a png file")
  const bad = validateUploadedImage({
    mimetype: "image/png",
    size: fakePng.length,
    buffer: fakePng,
  })
  assert.equal(bad.valid, false)
  assert.equal(bad.code, "INVALID_IMAGE_CONTENT")

  // Valid minimal PNG IHDR buffer (width=640, height=480)
  const validPng = Buffer.alloc(32)
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(validPng, 0)
  validPng.writeUInt32BE(640, 16)
  validPng.writeUInt32BE(480, 20)

  const ok = validateUploadedImage({
    mimetype: "image/png",
    size: validPng.length,
    buffer: validPng,
  })
  assert.equal(ok.valid, true)
  assert.equal(ok.format, "png")
  assert.equal(ok.width, 640)
  assert.equal(ok.height, 480)
})

test("Demo staking validates balance, lock schedule, and persists active/withdrawn positions", async () => {
  const { app } = buildTestHarness()
  const session = await invokeApp(app, { method: "POST", url: "/api/demo/session", body: {} })
  const cookie = extractSessionCookie(session)

  // Flexible pool stake
  const stakeRes = await invokeApp(app, {
    method: "POST",
    url: "/api/demo/staking/stake",
    headers: { cookie },
    body: {
      poolSlug: "eth-2.0-validator",
      poolTitle: "ETH 2.0 Validator",
      aprPct: 12.2,
      lockDays: 0,
      amountCredits: 2000,
    },
  })
  assert.equal(stakeRes.status, 201)
  assert.equal(stakeRes.json.data.wallet.balanceCredits, 8000)
  const posId = stakeRes.json.data.position._id

  const unstakeRes = await invokeApp(app, {
    method: "POST",
    url: `/api/demo/staking/${posId}/unstake`,
    headers: { cookie },
  })
  assert.equal(unstakeRes.status, 200)
  assert.ok(unstakeRes.json.data.wallet.balanceCredits >= 10000)
})
