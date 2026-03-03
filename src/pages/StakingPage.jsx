import DashboardHeader from "../components/staking/DashboardHeader"
import StatsCards from "../components/staking/StatsCards"
import StakingPools from "../components/staking/StakingPools"
import StakingHistory from "../components/staking/StakingHistory"

const StakingPage = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <DashboardHeader />
      <StatsCards />
      <StakingPools />
      <StakingHistory />
    </main>
  )
}

export default StakingPage