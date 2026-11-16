require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config({ path: require("path").resolve(__dirname, ".env") })

const sepoliaUrl = process.env.SEPOLIA_RPC_URL || ""
const deployerKey = process.env.DEPLOYER_PRIVATE_KEY || ""
const localRpcUrl = process.env.HARDHAT_LOCAL_RPC_URL || "http://127.0.0.1:8545"

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "cancun",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: localRpcUrl,
      chainId: 31337,
    },
    ...(sepoliaUrl && deployerKey
      ? {
          sepolia: {
            url: sepoliaUrl,
            chainId: 11155111,
            accounts: [deployerKey],
          },
        }
      : {}),
  },
}
