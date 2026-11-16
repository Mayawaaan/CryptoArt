export const formatINR = (num) => {
  if (num === null || num === undefined || Number.isNaN(Number(num))) {
    return "—"
  }
  const value = Number(num)
  const abs = Math.abs(value)
  const maximumFractionDigits = abs >= 1000 ? 0 : abs >= 1 ? 2 : 4
  const minimumFractionDigits = abs >= 1000 ? 0 : 2

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value)
}

export const formatCompactINR = (num) => {
  if (num === null || num === undefined || Number.isNaN(Number(num))) {
    return "—"
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(Number(num))
}

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

export const getStatusClasses = (status) => {
  switch (status) {
    case "Confirmed":
      return "bg-ca-positive-bg text-ca-positive border border-ca-accent-border"
    case "Pending":
      return "bg-ca-warning-bg text-ca-warning border border-ca-border-strong"
    case "Failed":
    case "Reverted":
      return "bg-ca-negative-bg text-ca-negative border border-ca-border-strong"
    default:
      return "bg-ca-surface-raised text-ca-text-muted border border-ca-border"
  }
}
