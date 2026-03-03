import React from "react"
import plans from "../data/FeesData"


const Fees = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 md:px-16 py-24">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-5xl md:text-6xl font-bold font-mono text-amber-500">
          Pricing & Fees
        </h1>
        <p className="mt-6 text-xl text-gray-400">
          Transparent pricing built for scalability — whether you're
          experimenting or building seriously.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">

        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-2xl p-10 border transition-all duration-500 
              ${
                plan.recommended
                  ? "border-amber-500 bg-gray-800 shadow-[0_0_30px_rgba(245,158,11,0.15)] scale-105"
                  : "border-gray-700 bg-gray-800/60 hover:border-amber-500 hover:-translate-y-2"
              }`}
          >

            {plan.recommended && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-1 text-sm font-semibold rounded-full">
                Recommended
              </span>
            )}

            <h2 className="text-3xl font-semibold mb-4">
              {plan.name}
            </h2>

            <p className="text-4xl font-bold mb-4 text-amber-500">
              {plan.price}
            </p>

            <p className="text-gray-400 mb-8">
              {plan.description}
            </p>

            <ul className="space-y-4 mb-10 text-gray-300">
              {plan.features.map((feature, i) => (
                <li key={i}>• {feature}</li>
              ))}
            </ul>

            <button className="w-full py-3 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition">
              Get Started
            </button>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Fees