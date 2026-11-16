import React from "react"
import { motion } from "motion/react"

const RouteLoader = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[65vh] bg-ca-bg text-ca-text flex flex-col items-center justify-center px-6 relative"
    >
      {/* Top slim progress bar */}
      <div className="fixed top-16 left-0 right-0 h-0.5 bg-ca-divider overflow-hidden z-40">
        <motion.div
          className="h-full bg-ca-accent w-1/3"
          initial={{ x: "-100%" }}
          animate={{ x: "300%" }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="p-3 rounded-2xl bg-ca-surface border border-ca-border animate-pulse">
          <img
            src="/logo/logoMark.png"
            alt=""
            aria-hidden="true"
            className="w-10 h-10 object-contain"
          />
        </div>
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-ca-text-muted">
          Loading Workspace...
        </p>
      </div>
    </div>
  )
}

export default RouteLoader
