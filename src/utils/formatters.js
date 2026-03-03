export const formatINR = (num) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num)

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

export const getStatusColor = (status) => {
  switch (status) {
    case "Confirmed":
      return "text-emerald-500"
    case "Pending":
      return "text-yellow-500"
    case "Failed":
      return "text-red-500"
    default:
      return ""
  }
}