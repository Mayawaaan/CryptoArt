import React from "react"
import { Link } from "react-router-dom"
import endpoints from "../data/apiData"
import PageHeader from "../components/ui/PageHeader"
import StatusBadge from "../components/ui/StatusBadge"

const API = () => {
  return (
    <main className="min-h-screen bg-ca-bg text-ca-text-secondary px-4 sm:px-6 py-10">
      <div className="container mx-auto space-y-10">
        <PageHeader
          eyebrow="Developer Platform"
          title="CryptoArt REST API"
          description="Express backend normalizing live market data providers, Cloudinary media uploads, MongoDB NFT inventory, and simulated Demo Wallet state."
          actions={
            <Link
              to="/market-track"
              className="px-4 py-2 rounded-xl bg-ca-accent text-ca-text-inverse text-xs font-semibold hover:bg-ca-accent-hover transition-colors"
            >
              Inspect Live Feeds
            </Link>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="hidden lg:block lg:col-span-3 bg-ca-surface border border-ca-border rounded-2xl p-6 sticky top-20 space-y-3 text-sm">
            <p className="text-xs font-mono uppercase tracking-wider text-ca-accent font-semibold">
              Sections
            </p>
            <nav aria-label="API sections" className="space-y-2">
              <a href="#envelope" className="block text-ca-text-muted hover:text-ca-text transition-colors">
                Response Envelope
              </a>
              <a href="#endpoints" className="block text-ca-text-muted hover:text-ca-text transition-colors">
                Endpoints ({endpoints.length})
              </a>
              <a href="#security" className="block text-ca-text-muted hover:text-ca-text transition-colors">
                Auth &amp; Rate Limits
              </a>
            </nav>
          </aside>

          <div className="lg:col-span-9 space-y-12">
            <section id="envelope" className="space-y-4">
              <h2 className="text-xl font-semibold text-ca-text">Normalized Envelope</h2>
              <p className="text-sm text-ca-text-secondary leading-relaxed">
                Read endpoints include explicit provider attribution, ISO timestamps, and cache
                staleness markers. Error responses carry machine-readable codes under{" "}
                <code className="font-mono text-ca-text">error.code</code>.
              </p>
              <pre className="bg-ca-surface border border-ca-border rounded-2xl p-5 font-mono text-xs sm:text-sm text-ca-text-secondary overflow-x-auto">
{`{
  "data": [...],
  "source": "coingecko | binance | frankfurter | dexscreener | cryptoart-db",
  "asOf": "2026-11-16T08:00:00.000Z",
  "stale": false
}`}
              </pre>
            </section>

            <section id="endpoints" className="space-y-4">
              <h2 className="text-xl font-semibold text-ca-text">Available Endpoints</h2>
              <div className="space-y-3">
                {endpoints.map((endpoint) => (
                  <div
                    key={endpoint.path}
                    className="border border-ca-border rounded-2xl p-5 bg-ca-surface space-y-2"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge tone="accent">{endpoint.method}</StatusBadge>
                      <code className="font-mono text-xs sm:text-sm text-ca-text">
                        {endpoint.path}
                      </code>
                    </div>
                    <p className="text-xs sm:text-sm text-ca-text-secondary leading-relaxed">
                      {endpoint.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section id="security" className="space-y-3 border-t border-ca-divider pt-8">
              <h2 className="text-xl font-semibold text-ca-text">Auth, CSRF &amp; Rate Limiting</h2>
              <p className="text-sm text-ca-text-secondary leading-relaxed">
                Demo account sessions use an HMAC-SHA256 HTTP-only{" "}
                <code className="font-mono text-ca-text">ca_demo_session</code> cookie with
                SameSite=Lax and Origin/Referer verification on every mutation. Public routes
                enforce rate limits (120 requests/minute).
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

export default API
