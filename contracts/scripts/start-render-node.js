const http = require("node:http")
const fs = require("node:fs")
const path = require("node:path")
const { spawn } = require("node:child_process")

const PUBLIC_PORT = Number.parseInt(process.env.PORT || "8545", 10)
const INTERNAL_RPC_PORT =
  PUBLIC_PORT === 8546 ? 8547 : Number.parseInt(process.env.HARDHAT_INTERNAL_PORT || "8546", 10)
const INTERNAL_RPC_URL = `http://127.0.0.1:${INTERNAL_RPC_PORT}`
const DEPLOYMENTS_FILE = path.resolve(__dirname, "../deployments.json")

let deploymentState = {
  ready: false,
  deployedAt: null,
  error: null,
  deployments: {},
}

function readDeploymentsManifest() {
  try {
    if (fs.existsSync(DEPLOYMENTS_FILE)) {
      return JSON.parse(fs.readFileSync(DEPLOYMENTS_FILE, "utf8"))
    }
  } catch {
    // Ignore parse error
  }
  return {}
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

function waitForRpc(url, timeoutMs = 45000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const check = () => {
      const payload = JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_chainId",
        params: [],
        id: 1,
      })
      const req = http.request(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(payload),
          },
        },
        (res) => {
          res.resume()
          if (res.statusCode === 200) {
            resolve()
          } else if (Date.now() - start > timeoutMs) {
            reject(new Error(`Hardhat RPC returned status ${res.statusCode}`))
          } else {
            setTimeout(check, 500)
          }
        }
      )
      req.on("error", () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error("Timed out waiting for internal Hardhat RPC node."))
        } else {
          setTimeout(check, 500)
        }
      })
      req.write(payload)
      req.end()
    }
    check()
  })
}

function runDeployScript() {
  return new Promise((resolve, reject) => {
    const hardhatBin = path.resolve(
      __dirname,
      "../node_modules/hardhat/internal/cli/cli.js"
    )
    const child = spawn(
      process.execPath,
      [hardhatBin, "run", "scripts/deploy.js", "--network", "localhost"],
      {
        cwd: path.resolve(__dirname, ".."),
        stdio: "inherit",
        env: {
          ...process.env,
          HARDHAT_LOCAL_RPC_URL: INTERNAL_RPC_URL,
        },
      }
    )
    child.on("exit", (code) => {
      if (code === 0) resolve()
      else reject(new Error(`deploy.js exited with code ${code}`))
    })
  })
}

async function start() {
  const hardhatBin = path.resolve(
    __dirname,
    "../node_modules/hardhat/internal/cli/cli.js"
  )

  console.log(
    `[Contracts Service] Starting internal Hardhat EVM node on 127.0.0.1:${INTERNAL_RPC_PORT}...`
  )
  const nodeProc = spawn(
    process.execPath,
    [hardhatBin, "node", "--hostname", "127.0.0.1", "--port", String(INTERNAL_RPC_PORT)],
    {
      cwd: path.resolve(__dirname, ".."),
      stdio: "inherit",
    }
  )

  const server = http.createServer((req, res) => {
    setCorsHeaders(res)

    if (req.method === "OPTIONS") {
      res.writeHead(204)
      res.end()
      return
    }

    const urlPath = (req.url || "/").split("?")[0]

    if (req.method === "GET" && (urlPath === "/health" || urlPath === "/")) {
      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(
        JSON.stringify({
          status: "ok",
          service: "cryptoart-contracts-rpc",
          chainId: 31337,
          ready: deploymentState.ready,
          deployedAt: deploymentState.deployedAt,
          error: deploymentState.error,
          deployments: deploymentState.deployments,
        })
      )
      return
    }

    if (req.method === "GET" && urlPath === "/deployments") {
      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(JSON.stringify(deploymentState.deployments))
      return
    }

    // Proxy JSON-RPC requests to the internal Hardhat node
    const proxyReq = http.request(
      {
        hostname: "127.0.0.1",
        port: INTERNAL_RPC_PORT,
        path: req.url,
        method: req.method,
        headers: {
          ...req.headers,
          host: `127.0.0.1:${INTERNAL_RPC_PORT}`,
        },
      },
      (proxyRes) => {
        setCorsHeaders(res)
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers)
        proxyRes.pipe(res)
      }
    )

    proxyReq.on("error", (err) => {
      res.writeHead(502, { "Content-Type": "application/json" })
      res.end(
        JSON.stringify({
          jsonrpc: "2.0",
          error: { code: -32603, message: `Internal RPC unavailable: ${err.message}` },
          id: null,
        })
      )
    })

    req.pipe(proxyReq)
  })

  server.listen(PUBLIC_PORT, "0.0.0.0", () => {
    console.log(
      `[Contracts Service] Public RPC & Deployment Gateway listening on 0.0.0.0:${PUBLIC_PORT}`
    )
  })

  try {
    await waitForRpc(INTERNAL_RPC_URL)
    console.log("[Contracts Service] Internal RPC ready; deploying & seeding contracts...")
    await runDeployScript()
    deploymentState = {
      ready: true,
      deployedAt: new Date().toISOString(),
      error: null,
      deployments: readDeploymentsManifest(),
    }
    console.log("[Contracts Service] Contracts deployed and ready for connections.")
  } catch (err) {
    console.error("[Contracts Service] Deployment error:", err.message)
    deploymentState.error = err.message
  }

  const shutdown = () => {
    server.close()
    nodeProc.kill("SIGTERM")
    process.exit(0)
  }
  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)
}

start()
