import React from "react"

const EmptyState = ({ title, description, action, className = "" }) => {
  return (
    <div
      className={`rounded-2xl bg-ca-surface border border-ca-border p-10 text-center space-y-3 ${className}`}
    >
      <h3 className="text-lg font-semibold text-ca-text">{title}</h3>
      {description && (
        <p className="text-sm text-ca-text-muted max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}

export default EmptyState
