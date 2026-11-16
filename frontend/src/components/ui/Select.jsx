import React from "react"

const Select = ({ id, label, options = [], className = "", children, ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-ca-text-secondary">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-3.5 py-2.5 rounded-xl bg-ca-bg border border-ca-border text-sm text-ca-text focus:outline-none focus:border-ca-accent transition-colors ${className}`}
        {...props}
      >
        {children ||
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </select>
    </div>
  )
}

export default Select
