import React, { useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import StatusBadge from "../ui/StatusBadge"

gsap.registerPlugin(ScrollTrigger)

const AboutJourneySection = ({ journey }) => {
  const sectionRef = useRef(null)
  const timelineRef = useRef(null)
  const progressLineRef = useRef(null)

  useLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion || !sectionRef.current) return undefined

    const ctx = gsap.context(() => {
      if (progressLineRef.current && timelineRef.current) {
        gsap.fromTo(
          progressLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 70%",
              end: "bottom 40%",
              scrub: 0.3,
            },
          }
        )
      }

      gsap.utils.toArray(".journey-milestone").forEach((el) => {
        gsap.from(el, {
          y: 22,
          opacity: 0,
          duration: 0.55,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: el,
            start: "top 84%",
            once: true,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about-journey"
      ref={sectionRef}
      aria-labelledby="about-journey-heading"
      className="py-16 sm:py-24 border-b border-ca-divider bg-ca-bg"
    >
      <div className="container mx-auto px-4 sm:px-6 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-ca-accent font-semibold">
            {journey.eyebrow}
          </p>
          <h2
            id="about-journey-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-ca-text"
          >
            {journey.title}
          </h2>
          <p className="text-sm sm:text-base text-ca-text-secondary leading-relaxed">
            {journey.subtitle}
          </p>
        </div>

        {/* Editorial Timeline with Vertical Progress Spine */}
        <div ref={timelineRef} className="relative">
          {/* Background Track Line */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-ca-border"
          />
          <div
            aria-hidden="true"
            className="lg:hidden absolute left-4 top-4 bottom-4 w-px bg-ca-border"
          />

          {/* Animated Progress Indicator Line */}
          <div
            ref={progressLineRef}
            aria-hidden="true"
            style={{ transformOrigin: "top center" }}
            className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-ca-accent"
          />

          <div className="space-y-12 lg:space-y-16">
            {journey.milestones.map((item, idx) => {
              const isRight = item.alignment === "right"
              return (
                <article
                  key={item.id}
                  className="journey-milestone relative pl-10 lg:pl-0 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start"
                >
                  {/* Timeline Node Marker */}
                  <div
                    aria-hidden="true"
                    className="lg:hidden absolute left-[11px] top-2 h-3 w-3 rounded-full bg-ca-accent border-2 border-ca-bg"
                  />
                  <div
                    aria-hidden="true"
                    className="hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 h-8 w-8 rounded-full bg-ca-surface border border-ca-accent items-center justify-center text-[11px] font-mono text-ca-accent font-semibold z-10"
                  >
                    0{idx + 1}
                  </div>

                  {/* Year Display Column */}
                  <div
                    className={`lg:col-span-5 ${
                      isRight
                        ? "lg:order-2 lg:pl-10 text-left"
                        : "lg:pr-10 lg:text-right"
                    }`}
                  >
                    <div
                      className={`inline-flex flex-col ${
                        isRight ? "lg:items-start" : "lg:items-end"
                      }`}
                    >
                      <StatusBadge tone="accent">{item.phase}</StatusBadge>
                      <span className="text-4xl sm:text-6xl font-mono tabular-nums font-semibold tracking-tight text-ca-text mt-2">
                        {item.year}
                      </span>
                    </div>
                  </div>

                  {/* Milestone Content Card */}
                  <div
                    className={`lg:col-span-7 ${
                      isRight ? "lg:order-1 lg:pr-12" : "lg:pl-12"
                    }`}
                  >
                    <div className="bg-ca-surface border border-ca-border rounded-2xl p-6 sm:p-8 space-y-4">
                      <h3 className="text-xl sm:text-2xl font-semibold text-ca-text">
                        {item.title}
                      </h3>

                      <p className="text-sm sm:text-base text-ca-text font-medium leading-relaxed">
                        {item.summary}
                      </p>

                      <p className="text-xs sm:text-sm text-ca-text-secondary leading-relaxed">
                        {item.narrative}
                      </p>

                      <div className="pt-4 border-t border-ca-divider space-y-2">
                        <p className="text-[11px] font-mono uppercase tracking-wider text-ca-accent font-semibold">
                          Key Engineering Milestones
                        </p>
                        <ul className="space-y-1.5 text-xs text-ca-text-muted">
                          {item.technicalFocus.map((point) => (
                            <li key={point} className="flex items-start gap-2">
                              <span
                                className="h-1.5 w-1.5 rounded-full bg-ca-accent mt-1.5 shrink-0"
                                aria-hidden="true"
                              />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        {/* Reflective Origin Notes */}
        <div className="pt-8 border-t border-ca-divider space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-ca-text-muted">
                Perspective Shift
              </p>
              <h3 className="text-xl sm:text-2xl font-semibold text-ca-text mt-1">
                Reflections From the Rebuild
              </h3>
            </div>
            <p className="text-xs font-mono text-ca-text-muted">
              Preserved notes from the 2022–2026 project archive
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {journey.reflections.map((note) => (
              <div
                key={note.id}
                className="journey-milestone bg-ca-surface/70 border border-ca-border rounded-2xl p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-ca-accent font-semibold">
                    {note.tag}
                  </span>
                  <h4 className="text-base font-semibold text-ca-text">{note.title}</h4>
                  <p className="text-xs sm:text-sm text-ca-text-secondary leading-relaxed">
                    {note.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutJourneySection
