import React, { useContext, useEffect, useState } from "react"
import { motion } from "motion/react"
import { LenisContext } from "../../context/lenisContextObject"

const AboutChapterNav = ({ chapters = [] }) => {
  const lenisRef = useContext(LenisContext)
  const [activeId, setActiveId] = useState(chapters[0]?.id || "")

  useEffect(() => {
    if (!chapters.length) return undefined

    const handleScroll = () => {
      const offset = 180
      let current = chapters[0].id
      for (const ch of chapters) {
        const el = document.getElementById(ch.id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= offset) {
          current = ch.id
        }
      }
      setActiveId(current)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [chapters])

  const scrollToChapter = (id) => {
    const target = document.getElementById(id)
    if (!target) return
    setActiveId(id)

    if (lenisRef?.current) {
      lenisRef.current.scrollTo(target, { offset: -80, duration: 1.0 })
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <nav
      aria-label="About Us page chapters"
      className="sticky top-16 z-30 bg-ca-bg/90 backdrop-blur-md border-b border-ca-divider"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar">
          {chapters.map((chapter) => {
            const isActive = activeId === chapter.id
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => scrollToChapter(chapter.id)}
                className={`relative cursor-pointer shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "text-ca-accent font-semibold"
                    : "text-ca-text-muted hover:text-ca-text"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="about-chapter-pill"
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 rounded-lg bg-ca-accent-soft border border-ca-accent-border"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10 font-mono text-[11px] opacity-80">
                  {chapter.number}
                </span>
                <span className="relative z-10">{chapter.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default AboutChapterNav
