import React, { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import StatusBadge from "../ui/StatusBadge"

const AboutArchitectureSection = ({ architecture }) => {
  const [selectedLayerId, setSelectedLayerId] = useState(architecture.layers[0]?.id)
  const activeLayer =
    architecture.layers.find((l) => l.id === selectedLayerId) || architecture.layers[0]

  return (
    <section
      id="about-architecture"
      aria-labelledby="about-architecture-heading"
      className="py-16 sm:py-24 border-b border-ca-divider bg-ca-surface/30"
    >
      <div className="container mx-auto px-4 sm:px-6 space-y-14">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-ca-accent font-semibold">
            {architecture.eyebrow}
          </p>
          <h2
            id="about-architecture-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-ca-text"
          >
            {architecture.title}
          </h2>
          <p className="text-sm sm:text-base text-ca-text-secondary leading-relaxed">
            {architecture.description}
          </p>
        </div>

        {/* Interactive Layered Architecture Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Stack Selector */}
          <div
            role="tablist"
            aria-label="Architecture layers"
            className="lg:col-span-5 flex flex-col justify-between gap-2.5"
          >
            {architecture.layers.map((layer) => {
              const isSelected = layer.id === activeLayer.id
              return (
                <button
                  key={layer.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`relative cursor-pointer text-left p-4 sm:p-5 rounded-2xl border transition-colors ${
                    isSelected
                      ? "bg-ca-surface-raised border-ca-accent"
                      : "bg-ca-surface border-ca-border hover:border-ca-border-strong"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-ca-accent font-semibold">
                      {layer.code}
                    </span>
                    <span className="text-[11px] font-mono text-ca-text-muted">
                      {layer.directory}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-ca-text">
                    {layer.name}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Right Active Layer Specification Inspector */}
          <div className="lg:col-span-7 bg-ca-surface border border-ca-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLayer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-ca-divider">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-ca-accent">
                      {activeLayer.code} · Active Inspection
                    </p>
                    <h3 className="text-xl sm:text-2xl font-semibold text-ca-text mt-1">
                      {activeLayer.name}
                    </h3>
                  </div>
                  <StatusBadge tone="neutral">{activeLayer.directory}</StatusBadge>
                </div>

                <p className="text-sm sm:text-base text-ca-text font-medium leading-relaxed">
                  {activeLayer.summary}
                </p>

                <div className="space-y-2.5">
                  <p className="text-xs font-mono uppercase tracking-wider text-ca-text-muted">
                    Verified Stack &amp; Modules
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeLayer.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-lg bg-ca-bg border border-ca-border text-xs font-mono text-ca-accent"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-ca-divider">
                  <p className="text-xs font-mono uppercase tracking-wider text-ca-text-muted">
                    Layer Responsibilities
                  </p>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-ca-text-secondary leading-relaxed">
                    {activeLayer.responsibilities.map((resp) => (
                      <li key={resp} className="flex items-start gap-2.5">
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-ca-accent mt-2 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Full 5-Layer Reference Ledger (Always Visible) */}
        <div className="bg-ca-surface border border-ca-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 bg-ca-bg border-b border-ca-border flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-ca-text">
              Complete Repository Layer Map
            </h3>
            <span className="text-xs font-mono text-ca-text-muted">
              frontend/ · backend/ · contracts/
            </span>
          </div>
          <div className="divide-y divide-ca-divider">
            {architecture.layers.map((layer) => (
              <div
                key={layer.id}
                className="p-5 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
              >
                <div className="md:col-span-3">
                  <span className="text-xs font-mono text-ca-accent font-semibold block">
                    {layer.code}
                  </span>
                  <span className="text-sm font-semibold text-ca-text">{layer.name}</span>
                </div>
                <div className="md:col-span-5 text-xs sm:text-sm text-ca-text-secondary leading-relaxed">
                  {layer.summary}
                </div>
                <div className="md:col-span-4 flex flex-wrap gap-1.5 md:justify-end">
                  {layer.stack.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 rounded bg-ca-bg border border-ca-border text-[11px] font-mono text-ca-text-muted"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Request & Settlement Data-Flow Pipelines */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-ca-text">
            End-to-End Request &amp; Settlement Pipelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {architecture.dataFlows.map((flow, idx) => (
              <div
                key={flow.title}
                className="bg-ca-surface border border-ca-border rounded-2xl p-5 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs font-mono text-ca-accent">
                  <span>PIPELINE 0{idx + 1}</span>
                </div>
                <h4 className="text-sm font-semibold text-ca-text">{flow.title}</h4>
                <p className="text-xs font-mono text-ca-text-secondary leading-relaxed bg-ca-bg border border-ca-divider rounded-xl p-3">
                  {flow.path}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutArchitectureSection
