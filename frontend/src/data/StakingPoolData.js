const pools = [
  {
    poolId: 0,
    slug: "btc-staking-pool",
    title: "BTC Staking Pool",
    asset: "WBTC / CART",
    description: "Locked 30-day prototype vault with fixed benchmark rate",
    baseApy: 8.45,
    lockDays: 30,
    minStake: 5000,
    tvlInr: 125000000,
    summary:
      "Designed for medium-term participants testing time-locked staking positions with deterministic yield accrual.",
  },
  {
    poolId: 1,
    slug: "eth-2.0-validator",
    title: "ETH 2.0 Validator",
    asset: "ETH / CART",
    description: "Flexible beacon-style prototype staking vault",
    baseApy: 12.2,
    lockDays: 0,
    minStake: 2500,
    tvlInr: 248000000,
    summary:
      "Flexible lock-free prototype pool supporting deposits and withdrawals without a fixed lockup period.",
  },
  {
    poolId: 2,
    slug: "core-native-pool",
    title: "CORE Native Pool",
    asset: "CART",
    description: "90-day native governance & staking prototype pool",
    baseApy: 24.5,
    lockDays: 90,
    minStake: 10000,
    tvlInr: 92000000,
    summary:
      "Extended 90-day lock schedule prototype configured in the CryptoArtStaking contract for protocol token testing.",
  },
  {
    poolId: 3,
    slug: "stable-liquidity",
    title: "Stable Liquidity",
    asset: "INRC / USDC",
    description: "Low-volatility flexible prototype liquidity pool",
    baseApy: 5.2,
    lockDays: 0,
    minStake: 1000,
    tvlInr: 315000000,
    summary:
      "Flexible stable-asset prototype pool intended for verifying deposit, withdrawal, and reward-claim accounting.",
  },
]

export default pools
