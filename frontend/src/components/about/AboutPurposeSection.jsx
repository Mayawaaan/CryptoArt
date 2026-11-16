import React from "react"

const AboutPurposeSection = ({ purpose }) => {
  return (
    <section
      id="about-purpose"
      aria-labelledby="about-purpose-heading"
      className="py-16 sm:py-24 border-b border-ca-divider bg-ca-surface/30"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Sticky Editorial Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-ca-accent font-semibold">
              {purpose.eyebrow}
            </p>

            <h2
              id="about-purpose-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.12] text-ca-text"
            >
              {purpose.title}
            </h2>

            <p className="text-sm sm:text-base text-ca-text-secondary leading-relaxed">
              {purpose.lead}
            </p>

            <div className="p-5 rounded-2xl bg-ca-surface border border-ca-border space-y-2">
              <p className="text-xs font-mono uppercase tracking-wider text-ca-accent font-semibold">
                Architectural Boundary
              </p>
              <p className="text-xs sm:text-sm text-ca-text-secondary leading-relaxed">
                CryptoArt never requests private keys, seed phrases, or mainnet deposits. All
                simulated interactions run on server-validated Demo Credits, and all Web3
                interactions target local Hardhat or Sepolia testnets.
              </p>
            </div>
          </div>

          {/* Right Substantial Editorial Columns */}
          <div className="lg:col-span-7 divide-y divide-ca-divider">
            {purpose.columns.map((col, idx) => (
              <article
                key={col.id}
                className={` about-reveal space-y-4 ${
                  idx === 0 ? "pb-10" : idx === purpose.columns.length - 1 ? "pt-10" : "py-10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-ca-accent font-semibold px-2.5 py-0.5 rounded-md bg-ca-accent-soft border border-ca-accent-border">
                    {col.index}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-ca-text">
                    {col.heading}
                  </h3>
                </div>

                <p className="text-base sm:text-lg font-medium text-ca-accent leading-snug">
                  {col.highlight}
                </p>

                <div className="space-y-3.5 text-sm sm:text-base text-ca-text-secondary leading-relaxed">
                  {col.paragraphs.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPurposeSection
