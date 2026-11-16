import React, { useCallback, useEffect, useState } from "react"
import { ThemeContext } from "./themeContextObject"
import { resolveThemeTokens } from "../utils/themeTokens"

const THEME_STORAGE_KEY = "ca-theme-mode"

function tokensEqual(a, b) {
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  for (const key of keysA) {
    if (a[key] !== b[key]) return false
  }
  return true
}

function getInitialColorMode() {
  if (typeof window === "undefined") return "dark"
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === "light" || saved === "dark") return saved
  } catch {
    // Ignore storage read errors
  }
  const attr = document.documentElement.getAttribute("data-theme")
  if (attr === "light" || attr === "dark") return attr
  return "dark"
}

/**
 * Provides reactive resolved CSS design tokens for non-CSS consumers
 * (Three.js materials/lights, Recharts SVG props) derived strictly
 * from --ca-base, --ca-text, and --ca-accent, plus dark/light mode state.
 */
export const ThemeProvider = ({ children }) => {
  const [colorMode, setColorMode] = useState(getInitialColorMode)
  const [tokens, setTokens] = useState(() => resolveThemeTokens())

  const refreshTokens = useCallback(() => {
    const next = resolveThemeTokens()
    setTokens((prev) => (tokensEqual(prev, next) ? prev : next))
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute("data-theme", colorMode)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, colorMode)
    } catch {
      // Ignore storage write errors
    }
    refreshTokens()
    window.dispatchEvent(new Event("ca-theme-change"))
  }, [colorMode, refreshTokens])

  useEffect(() => {
    refreshTokens()

    const root = document.documentElement
    const observer = new MutationObserver(() => {
      refreshTokens()
    })

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["style", "class", "data-theme"],
    })

    const headObserver = new MutationObserver(() => {
      refreshTokens()
    })
    if (document.head) {
      headObserver.observe(document.head, {
        childList: true,
      })
    }

    window.addEventListener("ca-theme-change", refreshTokens)
    return () => {
      observer.disconnect()
      headObserver.disconnect()
      window.removeEventListener("ca-theme-change", refreshTokens)
    }
  }, [refreshTokens])

  const toggleColorMode = useCallback(() => {
    setColorMode((prev) => (prev === "dark" ? "light" : "dark"))
  }, [])

  const theme = {
    background: "var(--ca-background)",
    primary: "var(--ca-surface)",
    surfaceRaised: "var(--ca-surface-raised)",
    text: "var(--ca-text-primary)",
    textSecondary: "var(--ca-text-secondary)",
    textMuted: "var(--ca-text-muted)",
    accent: "var(--ca-interactive)",
    border: "var(--ca-border)",
    tokens,
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        tokens,
        colorMode,
        setColorMode,
        toggleColorMode,
        refreshTokens,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
