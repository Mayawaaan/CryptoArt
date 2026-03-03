import React, { useEffect, useState } from "react"
import userGuideData from "../data/userGuideData"

const UserGuide = () => {
  const [activeSection, setActiveSection] = useState(null)
  const [expanded, setExpanded] = useState({})

  const formattedDate = new Date(
    userGuideData.lastUpdated
  ).toLocaleDateString()

  // Scrollspy
  useEffect(() => {
    const handleScroll = () => {
      userGuideData.sections.forEach((section) => {
        const el = document.getElementById(section.id)
        if (!el) return

        const rect = el.getBoundingClientRect()
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveSection(section.id)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggle = (id) => {
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
          User Guide
        </h1>
        <p className="mt-4 text-gray-400">
          Last Updated: {formattedDate}
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-16">

        {/* Sticky TOC */}
        <aside className="hidden md:block md:col-span-1 sticky top-24 self-start">
          <nav className="space-y-4 text-sm">
            {userGuideData.sections.map((section) => (
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
          {userGuideData.sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="border-b border-gray-800 pb-8"
            >
              <button
                onClick={() => toggle(section.id)}
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

      {/* CTA */}
      <div className="max-w-6xl mx-auto mt-24 text-center border-t border-gray-800 pt-12">
        <h2 className="text-3xl font-semibold text-white mb-4">
          Need More Assistance?
        </h2>
        <p className="text-gray-400 mb-6">
          If you need detailed help, explore the Help Center or contact Support.
        </p>
        <a
          href="/submit-request"
          className="px-8 py-4 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition"
        >
          Contact Support
        </a>
      </div>

    </div>
  )
}

export default UserGuide