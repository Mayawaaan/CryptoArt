import React from "react"
import { Loader2 } from "lucide-react"

const VARIANT_CLASSES = {
  primary:
    "bg-ca-accent text-ca-text-inverse hover:bg-ca-accent-hover border border-transparent font-semibold",
  secondary:
    "bg-ca-surface-raised text-ca-text border border-ca-border-strong hover:border-ca-accent hover:text-ca-accent font-medium",
  soft:
    "bg-ca-accent-soft text-ca-accent border border-ca-accent-border hover:bg-ca-accent hover:text-ca-text-inverse font-semibold",
  ghost:
    "bg-transparent text-ca-text-secondary border border-transparent hover:bg-ca-surface-raised hover:text-ca-text font-medium",
  outline:
    "bg-transparent text-ca-text-secondary border border-ca-border hover:border-ca-border-strong hover:text-ca-text font-medium",
}

const SIZE_CLASSES = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-sm rounded-xl gap-2",
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`cursor-pointer inline-flex items-center justify-center transition-colors duration-150 disabled:opacity-45 disabled:cursor-not-allowed ${
        VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary
      } ${SIZE_CLASSES[size] || SIZE_CLASSES.md} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={15} className="animate-spin shrink-0" aria-hidden="true" />}
      {children}
    </button>
  )
}

export default Button
