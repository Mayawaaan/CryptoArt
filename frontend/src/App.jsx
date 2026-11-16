import React from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Router from "./app/router"
import WalletModal from "./components/wallet/WalletModal"

import { ThemeProvider } from "./context/ThemeContext"
import { LenisProvider } from "./context/LenisContext"
import { ToastProvider } from "./components/ui/Toast"
import { DemoWalletProvider } from "./context/DemoWalletContext"
import { wagmiConfig } from "./web3/wagmiConfig"

const queryClient = new QueryClient()

const App = () => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <LenisProvider>
          <ThemeProvider>
            <ToastProvider>
              <DemoWalletProvider>
                <Navbar />
                <Router />
                <Footer />
                <WalletModal />
              </DemoWalletProvider>
            </ToastProvider>
          </ThemeProvider>
        </LenisProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
