import { useContext } from "react"
import { ThemeContext } from "../../context/ThemeContext"
import { useStakingHistory } from "../../hooks/useStakingHistory"
import { formatINR, formatDate, getStatusColor } from "../../utils/formatters"

const StakingHistory = () => {
  const { theme } = useContext(ThemeContext)
  const { transactions, loading, error } = useStakingHistory()

  if (loading) {
    return <div className="p-6 text-slate-500">Loading history...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-xl font-bold">Staking History</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Transaction</th>
              <th className="px-6 py-4">Pool</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="hover:bg-slate-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-6 py-4 font-medium">{tx.type}</td>
                <td className="px-6 py-4">{tx.pool}</td>
                <td className="px-6 py-4">
                  {tx.asset === "INR"
                    ? formatINR(tx.amount)
                    : `${tx.amount} ${tx.asset}`}
                </td>
                <td
                  className={`px-6 py-4 font-semibold ${getStatusColor(
                    tx.status
                  )}`}
                >
                  {tx.status}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {formatDate(tx.date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StakingHistory