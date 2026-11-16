const fs = require("node:fs")
const path = require("node:path")
const hre = require("hardhat")

async function main() {
  const [deployer] = await hre.ethers.getSigners()
  const network = await hre.ethers.provider.getNetwork()
  const chainId = Number(network.chainId)

  if (chainId === 1) {
    throw new Error("Refusing automatic deployment to Ethereum mainnet.")
  }

  console.log(`Deploying CryptoArt prototype suite to chainId=${chainId} (${hre.network.name}) with ${deployer.address}`)

  const Token = await hre.ethers.getContractFactory("CryptoArtToken")
  const token = await Token.deploy(deployer.address)
  await token.waitForDeployment()
  const tokenAddress = await token.getAddress()

  const Staking = await hre.ethers.getContractFactory("CryptoArtStaking")
  const staking = await Staking.deploy(tokenAddress, deployer.address)
  await staking.waitForDeployment()
  const stakingAddress = await staking.getAddress()

  const pools = [
    { name: "BTC Staking Pool", aprBps: 845, lockSeconds: 30 * 24 * 3600 },
    { name: "ETH 2.0 Validator", aprBps: 1220, lockSeconds: 0 },
    { name: "CORE Native Pool", aprBps: 2450, lockSeconds: 90 * 24 * 3600 },
    { name: "Stable Liquidity", aprBps: 520, lockSeconds: 0 },
  ]
  for (const pool of pools) {
    const tx = await staking.createPool(pool.name, pool.aprBps, pool.lockSeconds)
    await tx.wait()
  }

  const reserveAmount = hre.ethers.parseEther("250000")
  await (await token.approve(stakingAddress, reserveAmount)).wait()
  await (await staking.fundRewardReserve(reserveAmount)).wait()

  const SwapPool = await hre.ethers.getContractFactory("CryptoArtSwapPool")
  const swapPool = await SwapPool.deploy(tokenAddress, deployer.address)
  await swapPool.waitForDeployment()
  const swapPoolAddress = await swapPool.getAddress()

  const initialCartLiquidity = hre.ethers.parseEther("50000")
  const initialEthLiquidity = hre.ethers.parseEther("5")
  await (await token.approve(swapPoolAddress, initialCartLiquidity)).wait()
  await (
    await swapPool.addLiquidity(initialCartLiquidity, { value: initialEthLiquidity })
  ).wait()

  const Marketplace = await hre.ethers.getContractFactory("CryptoArtNFTMarketplace")
  const marketplace = await Marketplace.deploy(deployer.address)
  await marketplace.waitForDeployment()
  const marketplaceAddress = await marketplace.getAddress()

  // Seed 3 prototype NFT auctions matching gallery items
  const seedListings = [
    {
      title: "Neural Nexus #842",
      uri: "ipfs://cryptoart-prototype/neural-nexus-842",
      reserve: hre.ethers.parseEther("0.05"),
    },
    {
      title: "Ethereal Wave #12",
      uri: "ipfs://cryptoart-prototype/ethereal-wave-12",
      reserve: hre.ethers.parseEther("0.03"),
    },
    {
      title: "Future Walker #21",
      uri: "ipfs://cryptoart-prototype/future-walker-21",
      reserve: hre.ethers.parseEther("0.08"),
    },
  ]
  for (const item of seedListings) {
    await (
      await marketplace.mintAndList(item.title, item.uri, item.reserve, 7 * 24 * 3600)
    ).wait()
  }

  if (hre.network.name === "hardhat") {
    console.log("Ephemeral Hardhat dry-run succeeded; skipping src/contracts/deployments.json write.")
    return
  }

  const deploymentsPath = path.resolve(__dirname, "../../frontend/src/contracts/deployments.json")
  fs.mkdirSync(path.dirname(deploymentsPath), { recursive: true })

  let existing = {}
  if (fs.existsSync(deploymentsPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"))
    } catch {
      existing = {}
    }
  }

  existing[String(chainId)] = {
    network: hre.network.name,
    chainId,
    deployedAt: new Date().toISOString(),
    prototypeDisclaimer: "UNAUDITED TESTNET/LOCAL PROTOTYPE ONLY",
    contracts: {
      CryptoArtToken: tokenAddress,
      CryptoArtStaking: stakingAddress,
      CryptoArtSwapPool: swapPoolAddress,
      CryptoArtNFTMarketplace: marketplaceAddress,
    },
  }

  fs.writeFileSync(deploymentsPath, JSON.stringify(existing, null, 2), "utf8")
  console.log("Deployment manifest written to src/contracts/deployments.json")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
