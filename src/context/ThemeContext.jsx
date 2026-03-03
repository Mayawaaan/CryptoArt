import React, { createContext, useState, useEffect } from "react"

export const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
  background: "#111827",   // Tailwind gray-900
  primary: "#1f2937",      // gray-800
  text: "#ffffff",         // white
  accent: "#d97706",       // yellow-400 (clean highlight)
  })

  useEffect(() => {
    document.body.style.backgroundColor = theme.background
    document.body.style.color = theme.text
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) =>
      prev.background === "#0f172a"
        ? {
            background: "#ffffff",
            primary: "#f1f5f9",
            text: "#0f172a",
            accent: "#2563eb",
          }
        : {
            background: "#0f172a",
            primary: "#1e293b",
            text: "#f8fafc",
            accent: "#38bdf8",
          }
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}