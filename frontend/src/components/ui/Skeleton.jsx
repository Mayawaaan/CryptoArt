import React from "react"

const Skeleton = ({ className = "h-10 w-full" }) => {
  return (
    <div
      aria-hidden="true"
      className={`rounded-xl bg-ca-surface-raised border border-ca-divider animate-pulse ${className}`}
    />
  )
}

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3" aria-hidden="true">
    {Array.from({ length: rows }).map((_, idx) => (
      <div
        key={idx}
        className="h-12 rounded-xl bg-ca-surface-raised border border-ca-divider animate-pulse"
      />
    ))}
  </div>
)

export const SkeletonCard = () => (
  <div
    aria-hidden="true"
    className="rounded-2xl bg-ca-surface border border-ca-border overflow-hidden p-4 space-y-3"
  >
    <div className="aspect-square rounded-xl bg-ca-surface-raised animate-pulse" />
    <div className="h-4 w-2/3 rounded bg-ca-surface-raised animate-pulse" />
    <div className="h-3 w-1/2 rounded bg-ca-surface-raised animate-pulse" />
  </div>
)

export default Skeleton
