import { useEffect, useState } from "react"
import { getStakingHistory } from "../services/stakingService"

export const useStakingHistory = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getStakingHistory()
        setTransactions(data)
      } catch (err) {
        setError("Failed to load staking history",err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { transactions, loading, error }
}