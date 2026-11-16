import React from "react"

export const Input = ({ id, label, hint, error, className = "", ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-ca-text-secondary">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3.5 py-2.5 rounded-xl bg-ca-bg border text-sm text-ca-text placeholder:text-ca-text-muted focus:outline-none transition-colors ${
          error ? "border-ca-border-strong" : "border-ca-border focus:border-ca-accent"
        } ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-ca-text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs text-ca-negative">
          {error}
        </p>
      )}
    </div>
  )
}

export const Textarea = ({ id, label, hint, error, className = "", ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-ca-text-secondary">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full px-3.5 py-2.5 rounded-xl bg-ca-bg border text-sm text-ca-text placeholder:text-ca-text-muted focus:outline-none transition-colors ${
          error ? "border-ca-border-strong" : "border-ca-border focus:border-ca-accent"
        } ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-ca-text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs text-ca-negative">
          {error}
        </p>
      )}
    </div>
  )
}
