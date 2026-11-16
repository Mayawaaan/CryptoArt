import React from "react"

const SectionHeader = ({ eyebrow, title, description, actions, className = "" }) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 ${className}`}
    >
      <div className="space-y-1.5 max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-ca-text-muted font-semibold">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ca-text">
          {title}
        </h2>
        {description && (
          <p className="text-sm sm:text-base text-ca-text-secondary leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  )
}

export default SectionHeader
