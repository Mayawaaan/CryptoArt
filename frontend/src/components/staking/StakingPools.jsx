import PoolCard from "./PoolCard"
import pools from "../../data/StakingPoolData"

const StakingPools = () => {
  return (
    <section>
      <h2 className="text-xl font-semibold text-ca-text mb-6">
        Available Staking Pools
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pools.map((pool) => (
          <PoolCard
            key={pool.slug}
            slug={pool.slug}
            title={pool.title}
            asset={pool.asset}
            description={pool.description}
            baseApy={pool.baseApy}
            lockDays={pool.lockDays}
            minStake={pool.minStake}
            tvlInr={pool.tvlInr}
          />
        ))}
      </div>
    </section>
  )
}

export default StakingPools
