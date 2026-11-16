import React, { useEffect } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "motion/react"
import { X } from "lucide-react"

const Dialog = ({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidth = "max-w-md",
  children,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.()
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="ca-dialog-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-[9999] bg-ca-bg/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={title || "Dialog"}
          onClick={onClose}
        >
          <motion.div
            key="ca-dialog-panel"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`bg-ca-surface border border-ca-border rounded-2xl w-full ${maxWidth} p-6 shadow-2xl my-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            {(title || onClose) && (
              <div className="flex items-start justify-between gap-4 border-b border-ca-divider pb-3.5 mb-5">
                <div>
                  {title && <h2 className="text-base font-semibold text-ca-text">{title}</h2>}
                  {subtitle && <p className="text-xs text-ca-text-muted mt-0.5">{subtitle}</p>}
                </div>
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="cursor-pointer p-1.5 rounded-lg text-ca-text-muted hover:text-ca-text hover:bg-ca-surface-raised transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Dialog
