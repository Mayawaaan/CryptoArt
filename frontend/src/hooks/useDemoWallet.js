import { useContext } from "react"
import { DemoWalletContext } from "../context/demoWalletContextObject"

export function useDemoWallet() {
  const ctx = useContext(DemoWalletContext)
  if (!ctx) {
    throw new Error("useDemoWallet must be used within DemoWalletProvider")
  }
  return ctx
}
