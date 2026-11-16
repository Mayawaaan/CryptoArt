import React from "react"
import { motion } from "motion/react"

const Tabs = ({
  items = [],
  value,
  onChange,
  layoutId = "ca-tabs-pill",
  className = "",
  ariaLabel = "Options",
}) => {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1 p-1 rounded-xl bg-ca-bg border border-ca-border ${className}`}
    >
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            type="button"
            role="tab"
            aria-selected={active}
            key={item.value}
            onClick={() => onChange?.(item.value)}
            className={`relative cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              active ? "text-ca-accent" : "text-ca-text-muted hover:text-ca-text"
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 rounded-lg bg-ca-accent-soft border border-ca-accent-border"
                aria-hidden="true"
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default Tabs
