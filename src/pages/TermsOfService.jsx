import React, { useEffect, useState } from "react"
import termsData from "../data/termsData"

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState(null)
  const [expanded, setExpanded] = useState({})
  const [acceptOpen, setAcceptOpen] = useState(false)

  const formattedDate = new Date(
    termsData.lastUpdated
  ).toLocaleDateString()

  // Scrollspy
  useEffect(() => {
    const handleScroll = () => {
      const sections = termsData.sections.map((s) =>
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
          Terms of Service
        </h1>
        <p className="mt-4 text-gray-400">
          Last Updated: {formattedDate}
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-16">

        {/* Sticky TOC */}
        <aside className="hidden md:block md:col-span-1 sticky top-24 self-start">
          <nav className="space-y-4 text-sm">
            {termsData.sections.map((section) => (
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

          <button
            onClick={() => setAcceptOpen(true)}
            className="mt-10 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition"
          >
            Review Acceptance
          </button>
        </aside>

        {/* Content */}
        <main className="md:col-span-3 space-y-12">
          {termsData.sections.map((section) => (
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

      {/* Acceptance Modal */}
      {acceptOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-6 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-10 max-w-md w-full">
            <h3 className="text-2xl font-semibold mb-6 text-amber-500">
              Terms Acceptance
            </h3>

            <p className="text-gray-400 mb-8">
              By continuing to use this platform, you confirm that you
              understand and agree to these Terms of Service.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setAcceptOpen(false)}
                className="px-4 py-2 border border-gray-600 rounded-lg"
              >
                Close
              </button>

              <button
                onClick={() => setAcceptOpen(false)}
                className="px-4 py-2 bg-amber-500 text-black rounded-lg"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default TermsOfService