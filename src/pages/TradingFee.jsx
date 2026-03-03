import React from "react"
import feeTiers from "../data/TradingFee"

const TradingFee = () => {


  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 px-6 md:px-16 py-24 print:bg-white print:text-black">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16">
        <h1 className="text-5xl font-bold font-mono text-amber-500">
          Trading Fees
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-3xl">
          Our trading fee structure is designed to be transparent,
          competitive, and volume-based. Lower fees are applied
          automatically as your monthly trading volume increases.
        </p>
      </div>

      {/* Fee Table */}
      <div className="max-w-6xl mx-auto bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden shadow-lg">

        <div className="grid grid-cols-3 bg-gray-800 text-white font-semibold text-lg">
          <div className="p-6 border-b border-gray-700">
            Monthly Volume (USD)
          </div>
          <div className="p-6 border-b border-gray-700 text-center">
            Maker Fee
          </div>
          <div className="p-6 border-b border-gray-700 text-center">
            Taker Fee
          </div>
        </div>

        {feeTiers.map((tier, index) => (
          <div
            key={index}
            className="grid grid-cols-3 border-b border-gray-700 hover:bg-gray-800 transition"
          >
            <div className="p-6">{tier.volume}</div>
            <div className="p-6 text-center text-amber-400 font-semibold">
              {tier.maker}
            </div>
            <div className="p-6 text-center">{tier.taker}</div>
          </div>
        ))}
      </div>

      {/* Additional Notes */}
      <div className="max-w-6xl mx-auto mt-16 space-y-6">
        <h2 className="text-3xl font-semibold text-white">
          Additional Information
        </h2>

        <p className="text-gray-400 leading-relaxed">
          • Fees are calculated based on your 30-day trading volume.
        </p>
        <p className="text-gray-400 leading-relaxed">
          • Discount programs may apply for long-term users.
        </p>
        <p className="text-gray-400 leading-relaxed">
          • Platform reserves the right to update fee structures with notice.
        </p>
      </div>

      {/* Platform Links */}
      <div className="max-w-6xl mx-auto mt-24 border-t border-gray-800 pt-12">

        <h2 className="text-2xl font-semibold text-white mb-8">
          Related Platform Pages
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <a
            href="/security"
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-amber-500 hover:-translate-y-1 transition"
          >
            <h3 className="text-xl font-semibold mb-2">
              Security
            </h3>
            <p className="text-gray-400 text-sm">
              Learn how we protect user data and assets.
            </p>
          </a>

          <a
            href="/privacy-policy"
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-amber-500 hover:-translate-y-1 transition"
          >
            <h3 className="text-xl font-semibold mb-2">
              Privacy Policy
            </h3>
            <p className="text-gray-400 text-sm">
              Understand how your information is handled.
            </p>
          </a>

          <a
            href="/submit-request"
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-amber-500 hover:-translate-y-1 transition"
          >
            <h3 className="text-xl font-semibold mb-2">
              Contact Support
            </h3>
            <p className="text-gray-400 text-sm">
              Need help? Submit a support request.
            </p>
          </a>

        </div>

      </div>

    </div>
  )
}

export default TradingFee