import React, { useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import aboutData from "../data/aboutdata"
import AboutChapterNav from "../components/about/AboutChapterNav"
import AboutHeroSection from "../components/about/AboutHeroSection"
import AboutJourneySection from "../components/about/AboutJourneySection"
import AboutPurposeSection from "../components/about/AboutPurposeSection"
import AboutEcosystemSection from "../components/about/AboutEcosystemSection"
import AboutArchitectureSection from "../components/about/AboutArchitectureSection"
import AboutPrinciplesSection from "../components/about/AboutPrinciplesSection"
import AboutTeamSection from "../components/about/AboutTeamSection"
import AboutNextChapterSection from "../components/about/AboutNextChapterSection"

gsap.registerPlugin(ScrollTrigger)

const AboutUs = () => {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion || !rootRef.current) return undefined

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".about-reveal").forEach((el) => {
        gsap.from(el, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            once: true,
          },
        })
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={rootRef} className="min-h-screen bg-ca-bg text-ca-text overflow-x-clip">
      <AboutChapterNav chapters={aboutData.chapters} />
      <AboutHeroSection hero={aboutData.hero} />
      <AboutJourneySection journey={aboutData.journey} />
      <AboutPurposeSection purpose={aboutData.purpose} />
      <AboutEcosystemSection ecosystem={aboutData.ecosystem} />
      <AboutArchitectureSection architecture={aboutData.architecture} />
      <AboutPrinciplesSection principles={aboutData.principles} />
      <AboutTeamSection team={aboutData.team} />
      <AboutNextChapterSection nextChapter={aboutData.nextChapter} />
    </main>
  )
}

export default AboutUs
