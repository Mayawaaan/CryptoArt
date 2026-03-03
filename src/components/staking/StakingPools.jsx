import PoolCard from "./PoolCard"
import pools from "../../data/StakingPoolData"


const StakingPools = () => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-6">
        Available Staking Pools
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pools.map((pool, index) => (
          <PoolCard
            key={index}
            title={pool.title}
            description={pool.description}
            baseApy={pool.baseApy}
            lockDays={pool.lockDays}
          />
        ))}
      </div>
    </div>
  )
}

export default StakingPools