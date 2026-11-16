import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import PageHeader from "../ui/PageHeader"

const DocumentLayout = ({
  title,
  eyebrow = "Documentation",
  lastUpdated,
  sections,
  sidebarAction,
  footerCta,
}) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? null)
  const [expanded, setExpanded] = useState(() => {
    const firstId = sections[0]?.id
    return firstId ? { [firstId]: true } : {}
  })

  const formattedDate = new Date(lastUpdated).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  useEffect(() => {
    const handleScroll = () => {
      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= 160 && rect.bottom >= 160) {
          setActiveSection(s.id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const toggleSection = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <main className="min-h-screen bg-ca-bg text-ca-text-secondary px-4 sm:px-6 py-10">
      <div className="container mx-auto space-y-10">
        <PageHeader
          eyebrow={eyebrow}
          title={title}
          description={`Last updated ${formattedDate}`}
        />

        <div className="grid md:grid-cols-12 gap-10 items-start">
          <aside className="hidden md:block md:col-span-3 sticky top-24 bg-ca-surface border border-ca-border rounded-2xl p-5 space-y-4">
            <nav aria-label={`${title} sections`} className="space-y-2 text-sm">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() =>
                    setExpanded((prev) => ({ ...prev, [section.id]: true }))
                  }
                  className={`block py-1 transition-colors ${
                    activeSection === section.id
                      ? "text-ca-accent font-semibold"
                      : "text-ca-text-muted hover:text-ca-text"
                  }`}
                >
                  {section.title}
                </a>
              ))}
            </nav>

            {sidebarAction && <div className="pt-2 border-t border-ca-divider">{sidebarAction}</div>}
          </aside>

          <div className="md:col-span-9 space-y-3">
            {sections.map((section) => {
              const isOpen = Boolean(expanded[section.id])
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="bg-ca-surface border border-ca-border rounded-2xl p-5 sm:p-6"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleSection(section.id)}
                    className="cursor-pointer w-full text-left text-lg font-semibold text-ca-text flex justify-between items-center gap-4 hover:text-ca-accent transition-colors"
                  >
                    <span>{section.title}</span>
                    <span className="text-ca-accent font-mono text-base shrink-0">
                      {isOpen ? "-" : "+"}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <p className="pt-4 text-ca-text-secondary leading-relaxed whitespace-pre-line text-sm sm:text-base">
                          {section.content.trim()}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              )
            })}
          </div>
        </div>

        {footerCta}
      </div>
    </main>
  )
}

export default DocumentLayout
