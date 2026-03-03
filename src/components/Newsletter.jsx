import { useState } from "react"
import { Mail, CircleArrowRight, Loader2 } from "lucide-react"

const Newsletter = ({ footerContent }) => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage(null)
    setError(null)

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.")
      return
    }

    try {
      setLoading(true)

      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Subscription failed")
      }

      setMessage(data.message || "Successfully subscribed 🎉")
      setEmail("")

      setTimeout(() => {
        setMessage(null)
      }, 3000)

    } catch (err) {
      console.error(err)
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6 text-white">
        Newsletter
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={16}
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            disabled={loading}
            required
            className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-amber-400 border border-amber-400 overflow-hidden transition-all duration-300 cursor-pointer disabled:opacity-60"
        >
          <span className="absolute inset-0 bg-amber-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>

          <span className="relative z-10 group-hover:text-black transition-colors duration-300 flex items-center gap-2">
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                Subscribe
                <CircleArrowRight size={20} />
              </>
            )}
          </span>
        </button>

        {error && (
          <p className="text-red-400 text-xs mt-2">{error}</p>
        )}

        {message && (
          <p className="text-green-400 text-xs mt-2">{message}</p>
        )}
      </form>
    </div>
  )
}

export default Newsletter