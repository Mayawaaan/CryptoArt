import mongoose from "mongoose"

let connectionPromise = null
let cachedReplicaSet = null

export async function connectDatabase(uri) {
  if (!uri) {
    return { connected: false, reason: "MONGODB_URI is not configured." }
  }

  if (mongoose.connection.readyState === 1) {
    return { connected: true, replicaSet: Boolean(cachedReplicaSet) }
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
      })
      .then(async (conn) => {
        try {
          const hello = await conn.connection.db.admin().command({ hello: 1 })
          cachedReplicaSet = hello?.setName || null
        } catch {
          cachedReplicaSet = null
        }
        return { connected: true, replicaSet: Boolean(cachedReplicaSet) }
      })
      .catch((err) => {
        connectionPromise = null
        return { connected: false, reason: err.message }
      })
  }

  return connectionPromise
}

export async function disconnectDatabase() {
  connectionPromise = null
  cachedReplicaSet = null
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }
}

export function getDatabaseStatus(configuredUri) {
  const readyState = mongoose.connection.readyState
  const stateLabels = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  }
  return {
    configured: Boolean(configuredUri),
    state: stateLabels[readyState] || "unknown",
    connected: readyState === 1,
    replicaSet: Boolean(cachedReplicaSet),
  }
}
