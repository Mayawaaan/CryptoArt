import { stakingHistoryDB } from "../data/stakingHistoryDB"

export const getStakingHistory = async () => {
  // simulate async DB read
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(stakingHistoryDB)
    }, 500)
  })
}