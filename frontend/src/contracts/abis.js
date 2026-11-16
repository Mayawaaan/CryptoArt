import { parseAbi } from "viem"

export const CRYPTO_ART_TOKEN_ABI = parseAbi([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function faucet()",
  "function faucetClaimed(address account) view returns (uint256)",
])

export const CRYPTO_ART_STAKING_ABI = parseAbi([
  "function poolCount() view returns (uint256)",
  "function pools(uint256 poolId) view returns (string name, uint256 aprBps, uint256 lockSeconds, uint256 totalStaked, bool active)",
  "function positions(uint256 poolId, address user) view returns (uint256 amount, uint256 rewardDebt, uint256 lastUpdate, uint256 unlockAt)",
  "function pendingRewards(uint256 poolId, address user) view returns (uint256)",
  "function rewardReserve() view returns (uint256)",
  "function stake(uint256 poolId, uint256 amount)",
  "function unstake(uint256 poolId, uint256 amount)",
  "function claimRewards(uint256 poolId)",
])

export const CRYPTO_ART_SWAP_POOL_ABI = parseAbi([
  "function ethReserve() view returns (uint256)",
  "function tokenReserve() view returns (uint256)",
  "function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) view returns (uint256)",
  "function swapEthForCart(uint256 minCartOut) payable returns (uint256)",
  "function swapCartForEth(uint256 cartIn, uint256 minEthOut) returns (uint256)",
])

export const CRYPTO_ART_MARKETPLACE_ABI = parseAbi([
  "function nextTokenId() view returns (uint256)",
  "function auctions(uint256 tokenId) view returns (uint256 tokenId, address seller, uint256 reservePrice, uint256 highestBid, address highestBidder, uint256 endTime, bool settled, string title)",
  "function pendingReturns(address user) view returns (uint256)",
  "function placeBid(uint256 tokenId) payable",
  "function withdrawOutbid()",
  "function settleAuction(uint256 tokenId)",
])
