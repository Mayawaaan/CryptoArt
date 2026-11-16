import { spawn } from "node:child_process"
import net from "node:net"

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host: "127.0.0.1" })
    socket.once("connect", () => {
      socket.destroy()
      resolve(true)
    })
    socket.once("error", () => resolve(false))
  })
}

async function main() {
  const children = []
  const backendPort = Number(process.env.PORT || 4000)
  const contractsPort = Number(process.env.CONTRACTS_PORT || 8545)
  const skipContracts = process.argv.includes("--no-contracts")

  const backendRunning = await isPortOpen(backendPort)
  if (!backendRunning) {
    const serverProc = spawn(process.execPath, ["backend/src/index.js"], {
      stdio: "inherit",
    })
    children.push(serverProc)
  } else {
    console.log(`CryptoArt backend API already listening on port ${backendPort}.`)
  }

  if (!skipContracts) {
    const contractsRunning = await isPortOpen(contractsPort)
    if (!contractsRunning) {
      const contractsProc = spawn(
        process.execPath,
        ["contracts/scripts/start-render-node.js"],
        {
          stdio: "inherit",
          env: {
            ...process.env,
            PORT: String(contractsPort),
          },
        }
      )
      children.push(contractsProc)
    } else {
      console.log(`CryptoArt contracts RPC already listening on port ${contractsPort}.`)
    }
  }

  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm"
  const viteProc = spawn(npmCmd, ["--prefix", "frontend", "run", "dev"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  })
  children.push(viteProc)

  const shutdown = () => {
    for (const child of children) {
      try {
        child.kill("SIGTERM")
      } catch {
        // ignore
      }
    }
    process.exit(0)
  }

  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)
  viteProc.on("exit", (code) => {
    for (const child of children) {
      if (child !== viteProc) child.kill("SIGTERM")
    }
    process.exit(code ?? 0)
  })
}

main()
