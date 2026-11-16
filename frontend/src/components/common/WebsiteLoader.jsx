import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

const WebsiteLoader = () => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  })
  const [progress, setProgress] = useState(18)

  useEffect(() => {
    if (!visible) return undefined

    const step1 = setTimeout(() => setProgress(58), 140)
    const step2 = setTimeout(() => setProgress(88), 320)
    const step3 = setTimeout(() => setProgress(100), 480)
    const finish = setTimeout(() => setVisible(false), 680)

    return () => {
      clearTimeout(step1)
      clearTimeout(step2)
      clearTimeout(step3)
      clearTimeout(finish)
    }
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="ca-website-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-live="polite"
          aria-label="Loading CryptoArt workspace"
          className="fixed inset-0 z-[10000] bg-ca-bg flex flex-col items-center justify-between p-8 select-none"
        >
          <div className="w-full container mx-auto flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-ca-text-muted">
            <span>CryptoArt Workspace</span>
            <span className="tabular-nums text-ca-accent">{progress}%</span>
          </div>

          <div className="flex flex-col items-center text-center space-y-5 my-auto">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative p-4 rounded-2xl bg-ca-surface border border-ca-border shadow-2xl"
            >
              <img
                src="/logo/logoMark.png"
                alt=""
                aria-hidden="true"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
              />
            </motion.div>

            <div className="space-y-1.5">
              <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-ca-text">
                Crypto<span className="text-ca-accent">Art</span>
              </p>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-ca-text-muted">
                Markets · Exchange · Creator Studio
              </p>
            </div>

            <div className="w-56 sm:w-64 h-1 rounded-full bg-ca-surface-raised overflow-hidden border border-ca-divider">
              <motion.div
                className="h-full bg-ca-accent"
                initial={{ width: "18%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-ca-text-muted">
            Synchronizing Market &amp; Web3 Modules
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default WebsiteLoader
