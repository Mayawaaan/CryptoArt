import React, { useEffect, useRef } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { LenisContext } from "./lenisContextObject"

gsap.registerPlugin(ScrollTrigger)

export const LenisProvider = ({ children }) => {
  const lenisRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      return undefined
    }

    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      syncTouch: false,
      autoRaf: false,
       infinite: false,
    })

    lenis.on("scroll", ScrollTrigger.update)

    const onTick = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    lenisRef.current = lenis

    // Keep Lenis dimensions and ScrollTrigger synced when lazy content or accordions resize the DOM
    let resizeTimer = null
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize()
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh()
      }, 120)
    })

    if (document.body) {
      resizeObserver.observe(document.body)
    }

    // Smoothly handle in-page hash anchor clicks (#section)
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest?.('a[href^="#"]')
      if (!anchor) return
      const hash = anchor.getAttribute("href")
      if (!hash || hash === "#") return
      const targetEl = document.getElementById(hash.slice(1))
      if (targetEl) {
        e.preventDefault()
        lenis.scrollTo(targetEl, { offset: -88, duration: 1.05 })
      }
    }

    document.addEventListener("click", handleAnchorClick)

    return () => {
      clearTimeout(resizeTimer)
      resizeObserver.disconnect()
      document.removeEventListener("click", handleAnchorClick)
      gsap.ticker.remove(onTick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  )
}
