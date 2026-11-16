import React, { useCallback, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { X } from "lucide-react"
import { ToastContext } from "../../context/toastContextObject"

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const pushToast = useCallback((toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const entry = {
      id,
      title: toast.title || "",
      description: toast.description || "",
      tone: toast.tone || "neutral",
    }
    setToasts((prev) => [...prev.slice(-3), entry])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, toast.durationMs || 4500)
  }, [])

  return (
    <ToastContext.Provider value={{ pushToast, dismiss }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0 pointer-events-none"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-auto rounded-xl bg-ca-surface-raised border border-ca-border-strong p-4 shadow-xl flex items-start justify-between gap-3"
            >
              <div className="space-y-0.5 text-xs">
                {toast.title && (
                  <p className="font-semibold text-ca-text">{toast.title}</p>
                )}
                {toast.description && (
                  <p className="text-ca-text-secondary leading-relaxed">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="cursor-pointer p-1 rounded text-ca-text-muted hover:text-ca-text"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
