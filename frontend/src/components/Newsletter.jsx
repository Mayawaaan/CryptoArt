import React, { useState } from "react"
import Button from "./ui/Button"
import { Input } from "./ui/Input"
import { subscribeNewsletterEmail } from "../services/demoApi"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Newsletter = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    const trimmed = email.trim()
    if (!EMAIL_REGEX.test(trimmed)) {
      setError("Please enter a valid email address.")
      return
    }

    try {
      setLoading(true)
      const res = await subscribeNewsletterEmail(trimmed)
      setMessage(res.data?.message || "Subscribed to platform updates.")
      setEmail("")
    } catch (err) {
      setError(err.message || "Unable to subscribe right now.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-mono uppercase tracking-[0.18em] font-semibold text-ca-text">
        Newsletter
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <Input
          id="footer-newsletter-email"
          type="email"
          aria-label="Email address"
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          error={error}
          required
        />

        <Button type="submit" variant="soft" size="sm" loading={loading}>
          Subscribe
        </Button>

        {message && (
          <p role="status" className="text-xs text-ca-accent">
            {message}
          </p>
        )}
      </form>
    </div>
  )
}

export default Newsletter
