import React from "react"
import tiers from "../data/AffiliateProgramData"

const AffiliateProgram = () => {


  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 px-6 md:px-16 py-24">

      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-20">
        <h1 className="text-5xl font-bold font-mono text-amber-500">
          Affiliate Program
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-3xl mx-auto">
          Earn commissions by referring users to our platform.
          The more active traders you bring, the higher your rewards.
        </p>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 mb-24">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-4 text-white">
            1. Share Your Link
          </h3>
          <p className="text-gray-400">
            Receive a unique referral link from your dashboard
            and share it across your network.
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-4 text-white">
            2. Users Trade
          </h3>
          <p className="text-gray-400">
            When your referred users trade on the platform,
            you earn a percentage of their trading fees.
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-4 text-white">
            3. Earn Commission
          </h3>
          <p className="text-gray-400">
            Commissions are credited automatically
            and can be withdrawn according to payout terms.
          </p>
        </div>
      </div>

      {/* Commission Tiers */}
      <div className="max-w-6xl mx-auto mb-24">
        <h2 className="text-3xl font-semibold text-white mb-10">
          Commission Structure
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-10 text-center hover:border-amber-500 transition"
            >
              <h3 className="text-2xl font-semibold mb-4 text-white">
                {tier.level}
              </h3>

              <p className="text-4xl font-bold text-amber-500 mb-6">
                {tier.commission}
              </p>

              <p className="text-gray-400">
                {tier.requirement}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-6xl mx-auto mb-24">
        <h2 className="text-3xl font-semibold text-white mb-8">
          Why Join?
        </h2>

        <ul className="space-y-4 text-gray-400 text-lg">
          <li>• Real-time referral tracking dashboard</li>
          <li>• Transparent commission reporting</li>
          <li>• Monthly automated payouts</li>
          <li>• Scalable earning potential</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto text-center border-t border-gray-800 pt-16">
        <h2 className="text-3xl font-semibold text-white mb-6">
          Ready to Start Earning?
        </h2>
        <p className="text-gray-400 mb-8">
          Join our affiliate network and grow with the platform.
        </p>

        <a
          href="/signup"
          className="px-10 py-4 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition"
        >
          Become an Affiliate
        </a>
      </div>

    </div>
  )
}

export default AffiliateProgram