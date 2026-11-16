import React from "react"

const PageHeader = ({ eyebrow, title, description, actions, className = "" }) => {
  return (
    <header
      className={`pb-6 border-b border-ca-divider flex flex-col md:flex-row md:items-end justify-between gap-6 ${className}`}
    >
      <div className="space-y-2 max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-ca-accent font-medium">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ca-text">
          {title}
        </h1>
        {description && (
          <p className="text-sm sm:text-base text-ca-text-secondary leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>}
    </header>
  )
}

export default PageHeader
