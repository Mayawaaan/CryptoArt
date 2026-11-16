import crypto from "node:crypto"
import { sendError } from "../utils/envelope.js"

export const SESSION_COOKIE_NAME = "ca_demo_session"
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

export function hashSessionId(sessionId) {
  return crypto.createHash("sha256").update(String(sessionId)).digest("hex")
}

export function signSessionCookieValue(sessionId, secret) {
  const sig = crypto
    .createHmac("sha256", secret)
    .update(sessionId)
    .digest("hex")
  return `${sessionId}.${sig}`
}

export function verifySessionCookieValue(rawValue, secret) {
  if (!rawValue || typeof rawValue !== "string") return null
  const dotIdx = rawValue.indexOf(".")
  if (dotIdx <= 0) return null

  const sessionId = rawValue.slice(0, dotIdx)
  const providedSig = rawValue.slice(dotIdx + 1)
  if (!sessionId || !providedSig) return null

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(sessionId)
    .digest("hex")

  const bufA = Buffer.from(providedSig, "utf8")
  const bufB = Buffer.from(expectedSig, "utf8")
  if (bufA.length !== bufB.length) return null
  if (!crypto.timingSafeEqual(bufA, bufB)) return null

  return sessionId
}

export function setDemoSessionCookie(res, sessionId, { secret, isProduction }) {
  const signed = signSessionCookieValue(sessionId, secret)
  res.cookie(SESSION_COOKIE_NAME, signed, {
    httpOnly: true,
    sameSite: "lax",
    secure: Boolean(isProduction),
    path: "/",
    maxAge: SESSION_MAX_AGE_MS,
  })
}

export function createDemoAuthMiddleware({
  demoService,
  corsOrigins,
  sessionSecret,
  isProduction,
}) {
  const allowedOriginSet = new Set(corsOrigins)

  async function resolveSession(req, _res, next) {
    try {
      const rawCookie = req.cookies?.[SESSION_COOKIE_NAME]
      const sessionId = verifySessionCookieValue(rawCookie, sessionSecret)
      if (!sessionId) {
        req.demoSessionId = null
        req.demoWallet = null
        return next()
      }

      req.demoSessionId = sessionId
      req.demoWallet = await demoService.findWalletBySessionId(sessionId)
      return next()
    } catch {
      req.demoSessionId = null
      req.demoWallet = null
      return next()
    }
  }

  function requireDemoSession(req, res, next) {
    if (!demoService.isReady()) {
      return sendError(
        res,
        503,
        "DATABASE_UNAVAILABLE",
        "MongoDB is not connected. Configure MONGODB_URI in backend/.env to use Demo Wallet & NFT marketplace features."
      )
    }

    if (!req.demoWallet) {
      return sendError(
        res,
        401,
        "DEMO_SESSION_REQUIRED",
        "Start a Demo Wallet session first via POST /api/demo/session."
      )
    }
    return next()
  }

  function requireSameOriginMutation(req, res, next) {
    const origin = req.headers.origin
    if (origin && !allowedOriginSet.has(origin)) {
      return sendError(
        res,
        403,
        "FORBIDDEN_ORIGIN",
        "Cross-origin mutation blocked by CSRF origin policy."
      )
    }
    if (!origin && req.headers.referer) {
      try {
        const refOrigin = new URL(req.headers.referer).origin
        if (!allowedOriginSet.has(refOrigin)) {
          return sendError(
            res,
            403,
            "FORBIDDEN_REFERER",
            "Cross-origin mutation blocked by referer policy."
          )
        }
      } catch {
        return sendError(res, 403, "FORBIDDEN_REFERER", "Invalid referer header.")
      }
    }
    return next()
  }

  function issueSessionCookie(res, sessionId) {
    setDemoSessionCookie(res, sessionId, {
      secret: sessionSecret,
      isProduction,
    })
  }

  return {
    resolveSession,
    requireDemoSession,
    requireSameOriginMutation,
    issueSessionCookie,
  }
}
