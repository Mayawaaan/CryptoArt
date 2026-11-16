import React from "react"

const TONE_CLASSES = {
  accent: "bg-ca-accent-soft text-ca-accent border-ca-accent-border",
  positive: "bg-ca-positive-bg text-ca-positive border-ca-accent-border",
  negative: "bg-ca-negative-bg text-ca-negative border-ca-border-strong",
  warning: "bg-ca-warning-bg text-ca-warning border-ca-border-strong",
  neutral: "bg-ca-surface-raised text-ca-text-secondary border-ca-border",
}

const StatusBadge = ({ children, tone = "neutral", className = "" }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[11px] font-mono uppercase tracking-wider font-semibold ${
        TONE_CLASSES[tone] || TONE_CLASSES.neutral
      } ${className}`}
    >
      {children}
    </span>
  )
}

export default StatusBadge
