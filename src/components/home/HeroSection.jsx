import React from "react"
import CurrencyCoinScene from "./CurrencyCoinScene"
import { CircleArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const HeroSection = () => {
  return (
    <section className="bg-gray-900 min-h-screen">
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16 py-4">

        {/* LEFT CONTENT */}
        <div className="w-full lg:w-1/2 text-white space-y-6">

          {/* Badge */}
          <div className="relative inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-4 py-2">
            <span className="absolute left-3 h-2.5 w-2.5 rounded-full bg-amber-600 animate-ping"></span>
            <span className="h-2.5 w-2.5 rounded-full bg-amber-600"></span>
            <span className="text-sm lg:text-base font-semibold pl-2">
              Next-Gen Asset Exchange
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-mono tracking-tight">
            The Future of{" "}
            <span className="text-amber-600">Digital Finance</span> is here
          </h1>

          {/* Paragraph */}
          <p className="text-gray-400 text-base sm:text-lg lg:text-lg max-w-xl">
            Securely buy, sell, and trade your favorite digital assets.
            Experience institutional-grade security with a seamless UI
            designed for both beginners and experts.
          </p>

          {/* CTA */}
          <Link to="/trade">
            <button className="group relative flex items-center gap-2 px-6 py-3 rounded-xl text-amber-400 border border-amber-400 overflow-hidden transition-all duration-300">
              <span className="absolute inset-0 bg-amber-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              <span className="relative z-10 group-hover:text-black transition-colors duration-300 flex items-center gap-2">
                Trade Now
                <CircleArrowRight size={20} />
              </span>
            </button>
          </Link>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 pt-6 animate-pulse">
            <div>
              <h3 className="text-3xl font-bold text-amber-400">20M+</h3>
              <p className="text-gray-500 text-sm">Active Users</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-amber-400">$10B+</h3>
              <p className="text-gray-500 text-sm">Traded</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-amber-400">0.01%</h3>
              <p className="text-gray-500 text-sm">Low Fees</p>
            </div>
          </div>

        </div>

        {/* RIGHT 3D COIN */}
        <div className="w-full lg:w-1/2 h-[350px] sm:h-[450px] lg:h-[700px] mt-10 lg:mt-0">
          <CurrencyCoinScene />
        </div>

      </div>
    </section>
  )
}

export default HeroSection