import React, { useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import helpData from "../data/helpData"
import PageHeader from "../components/ui/PageHeader"
import { Input } from "../components/ui/Input"

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState(helpData.categories[0].id)
  const [expanded, setExpanded] = useState({})
  const [search, setSearch] = useState("")

  const toggle = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const filteredArticles =
    helpData.categories
      .find((cat) => cat.id === activeCategory)
      ?.articles.filter((article) =>
        article.question.toLowerCase().includes(search.toLowerCase())
      ) || []

  return (
    <main className="min-h-screen bg-ca-bg text-ca-text px-4 sm:px-6 py-10">
      <div className="container mx-auto space-y-8">
        <PageHeader
          eyebrow="Documentation"
          title="Help Center"
          description="Search platform guidance for live market feeds, Demo Credits, NFT creation, and EVM testnets."
          actions={
            <Link
              to="/submit-request"
              className="px-4 py-2 rounded-xl bg-ca-accent text-ca-text-inverse text-xs font-semibold hover:bg-ca-accent-hover transition-colors"
            >
              Contact Support
            </Link>
          }
        />

        <div className="max-w-lg">
          <Input
            id="help-center-search"
            type="text"
            aria-label="Search help articles"
            placeholder="Search help articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          <aside className="md:col-span-3 space-y-2">
            {helpData.categories.map((category) => (
              <button
                type="button"
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`cursor-pointer block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
                  activeCategory === category.id
                    ? "bg-ca-accent-soft text-ca-accent border-ca-accent-border font-semibold"
                    : "bg-ca-surface border-ca-border text-ca-text-secondary hover:bg-ca-surface-raised"
                }`}
              >
                {category.title}
              </button>
            ))}
          </aside>

          <div className="md:col-span-9 space-y-3">
            {filteredArticles.map((article, index) => {
              const key = `${activeCategory}-${index}`
              const isOpen = Boolean(expanded[key])
              return (
                <div
                  key={key}
                  className="border border-ca-border rounded-2xl p-5 bg-ca-surface"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggle(key)}
                    className="cursor-pointer w-full text-left flex justify-between items-center gap-4 text-base font-semibold text-ca-text"
                  >
                    <span>{article.question}</span>
                    <span className="text-ca-accent font-mono shrink-0">
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
                        <p className="pt-3 text-sm text-ca-text-secondary leading-relaxed">
                          {article.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}

            {filteredArticles.length === 0 && (
              <p className="text-sm text-ca-text-muted p-6 rounded-2xl bg-ca-surface border border-ca-border">
                No matching articles found in this category.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default HelpCenter
