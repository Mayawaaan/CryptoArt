import React, { useEffect, useState } from "react"
import securityData from "../data/securityData"

const Security = () => {
  const [activeSection, setActiveSection] = useState(null)
  const [expanded, setExpanded] = useState({})

  const formattedDate = new Date(
    securityData.lastUpdated
  ).toLocaleDateString()

  // Scrollspy
  useEffect(() => {
    const handleScroll = () => {
      const sections = securityData.sections.map((s) =>
        document.getElementById(s.id)
      )

      sections.forEach((section) => {
        if (!section) return
        const rect = section.getBoundingClientRect()
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(section.id)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleSection = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 px-6 md:px-16 py-20 print:bg-white print:text-black">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16">
        <h1 className="text-5xl font-bold font-mono text-amber-500">
          Security
        </h1>
        <p className="mt-4 text-gray-400">
          Last Updated: {formattedDate}
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-16">

        {/* Sticky TOC */}
        <aside className="hidden md:block md:col-span-1 sticky top-24 self-start">
          <nav className="space-y-4 text-sm">
            {securityData.sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`block transition ${
                  activeSection === section.id
                    ? "text-amber-500 font-semibold"
                    : "text-gray-400 hover:text-amber-400"
                }`}
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="md:col-span-3 space-y-12">
          {securityData.sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="border-b border-gray-800 pb-8"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full text-left text-2xl font-semibold text-white flex justify-between items-center"
              >
                {section.title}
                <span className="text-amber-500">
                  {expanded[section.id] ? "-" : "+"}
                </span>
              </button>

              {expanded[section.id] && (
                <p className="mt-6 text-gray-400 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              )}
            </div>
          ))}
        </main>
      </div>

      {/* Security Badge Section */}
      <div className="max-w-6xl mx-auto mt-24 text-center border-t border-gray-800 pt-12">
        <h2 className="text-3xl font-semibold text-white mb-4">
          Commitment to Security
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto">
          Security is not a feature — it is foundational. Our platform
          continuously evolves to strengthen protection, improve monitoring,
          and maintain trust.
        </p>
      </div>

    </div>
  )
}

export default Security