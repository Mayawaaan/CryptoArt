import React, { useContext, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { motion } from "motion/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { LenisContext } from "../../context/lenisContextObject"

const PageTransition = ({ children }) => {
  const location = useLocation()
  const lenisRef = useContext(LenisContext)

  useEffect(() => {
    if (!location.hash) {
      if (lenisRef?.current) {
        lenisRef.current.scrollTo(0, { immediate: true })
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" })
    }

    const timer = setTimeout(() => {
      lenisRef?.current?.resize()
      ScrollTrigger.refresh()
    }, 180)

    return () => clearTimeout(timer)
  }, [location.pathname, location.hash, lenisRef])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
