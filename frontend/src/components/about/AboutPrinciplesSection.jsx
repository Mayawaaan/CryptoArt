import React from "react"

const AboutPrinciplesSection = ({ principles }) => {
  return (
    <section
      id="about-principles"
      aria-labelledby="about-principles-heading"
      className="py-16 sm:py-24 border-b border-ca-divider bg-ca-bg"
    >
      <div className="container mx-auto px-4 sm:px-6 space-y-14">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-ca-accent font-semibold">
            {principles.eyebrow}
          </p>
          <h2
            id="about-principles-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-ca-text"
          >
            {principles.title}
          </h2>
          <p className="text-sm sm:text-base text-ca-text-secondary leading-relaxed">
            {principles.description}
          </p>
        </div>

        <div className="divide-y divide-ca-divider border-t border-b border-ca-divider">
          {principles.items.map((item) => (
            <article
              key={item.number}
              className="about-reveal py-10 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start"
            >
              <div className="lg:col-span-4 space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-ca-accent font-semibold block">
                  PRINCIPLE {item.number}
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-ca-text tracking-tight">
                  {item.number} — {item.title}
                </h3>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <p className="text-base sm:text-lg font-medium text-ca-text leading-snug">
                  {item.thesis}
                </p>
                <p className="text-sm sm:text-base text-ca-text-secondary leading-relaxed">
                  {item.body}
                </p>
                <div className="border-l-2 border-ca-accent pl-4 py-1">
                  <p className="text-xs font-mono text-ca-text-muted">{item.practice}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutPrinciplesSection
