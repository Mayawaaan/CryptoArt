import React, { useState } from "react"
import helpData from "../data/helpData"

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState(
    helpData.categories[0].id
  )
  const [expanded, setExpanded] = useState({})
  const [search, setSearch] = useState("")

  const toggle = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const filteredArticles = helpData.categories
    .find((cat) => cat.id === activeCategory)
    ?.articles.filter((article) =>
      article.question.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 md:px-16 py-24">

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold font-mono text-amber-500">
          Help Center
        </h1>
        <p className="mt-6 text-gray-400 text-lg">
          Find answers, guides, and support resources.
        </p>

        {/* Search */}
        <input
          type="text"
          placeholder="Search help articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-8 w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-16">

        {/* Categories Sidebar */}
        <aside className="md:col-span-1 space-y-4">
          {helpData.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`block w-full text-left px-4 py-3 rounded-lg transition ${
                activeCategory === category.id
                  ? "bg-amber-500 text-black font-semibold"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {category.title}
            </button>
          ))}
        </aside>

        {/* Articles */}
        <main className="md:col-span-3 space-y-6">
          {filteredArticles?.map((article, index) => (
            <div
              key={index}
              className="border border-gray-800 rounded-xl p-6 bg-gray-800/50"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full text-left flex justify-between items-center text-xl font-semibold"
              >
                {article.question}
                <span className="text-amber-500">
                  {expanded[index] ? "-" : "+"}
                </span>
              </button>

              {expanded[index] && (
                <p className="mt-4 text-gray-400 leading-relaxed">
                  {article.answer}
                </p>
              )}
            </div>
          ))}
        </main>
      </div>

      {/* Support CTA */}
      <div className="max-w-4xl mx-auto mt-24 text-center border-t border-gray-800 pt-12">
        <h2 className="text-3xl font-semibold mb-4">
          Still need help?
        </h2>
        <p className="text-gray-400 mb-8">
          If you can't find what you're looking for, submit a support request.
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

export default HelpCenter