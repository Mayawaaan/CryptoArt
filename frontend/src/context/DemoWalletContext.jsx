import React, { useCallback, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { DemoWalletContext } from "./demoWalletContextObject"
import {
  fetchBackendHealth,
  fetchDemoWallet,
  resetDemoWallet,
  startDemoSession,
} from "../services/demoApi"

export const DemoWalletProvider = ({ children }) => {
  const queryClient = useQueryClient()
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [walletModalTab, setWalletModalTab] = useState("demo")

  const healthQuery = useQuery({
    queryKey: ["backend-health"],
    queryFn: ({ signal }) => fetchBackendHealth(signal),
    retry: 1,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })

  const healthData = healthQuery.data?.data
  const backendReachable = !healthQuery.isError && Boolean(healthData)
  const databaseConnected = Boolean(healthData?.database?.connected)
  const cloudinaryConfigured = Boolean(healthData?.cloudinary?.configured)

  const walletQuery = useQuery({
    queryKey: ["demo-wallet"],
    queryFn: async ({ signal }) => {
      try {
        const res = await fetchDemoWallet(signal)
        return res.data
      } catch (err) {
        if (err.status === 401 || err.status === 503) {
          return null
        }
        throw err
      }
    },
    enabled: databaseConnected,
    retry: false,
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  })

  const startMutation = useMutation({
    mutationFn: (displayAlias) => startDemoSession(displayAlias),
    onSuccess: (res) => {
      queryClient.setQueryData(["demo-wallet"], res.data)
      queryClient.invalidateQueries({ queryKey: ["demo-transactions"] })
      queryClient.invalidateQueries({ queryKey: ["demo-staking"] })
      queryClient.invalidateQueries({ queryKey: ["my-nfts"] })
    },
  })

  const resetMutation = useMutation({
    mutationFn: () => resetDemoWallet(),
    onSuccess: (res) => {
      if (res?.data?.wallet) {
        queryClient.setQueryData(["demo-wallet"], res.data.wallet)
      } else {
        queryClient.invalidateQueries({ queryKey: ["demo-wallet"] })
      }
      queryClient.invalidateQueries({ queryKey: ["demo-transactions"] })
    },
  })

  const refreshWallet = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["demo-wallet"] })
    queryClient.invalidateQueries({ queryKey: ["demo-transactions"] })
    queryClient.invalidateQueries({ queryKey: ["demo-staking"] })
    queryClient.invalidateQueries({ queryKey: ["my-nfts"] })
  }, [queryClient])

  const openWalletModal = useCallback((initialTab = "demo") => {
    setWalletModalTab(initialTab)
    setWalletModalOpen(true)
  }, [])

  const closeWalletModal = useCallback(() => {
    setWalletModalOpen(false)
  }, [])

  let unavailableReason = null
  if (healthQuery.isError) {
    unavailableReason = "Backend API server is unreachable."
  } else if (healthData && !databaseConnected) {
    unavailableReason =
      healthData.database?.message ||
      "MongoDB is not connected. Configure MONGODB_URI in backend/.env to enable demo wallets and persistent NFT listings."
  }

  return (
    <DemoWalletContext.Provider
      value={{
        wallet: walletQuery.data || null,
        isActive: Boolean(walletQuery.data),
        isLoading: healthQuery.isLoading || (databaseConnected && walletQuery.isLoading),
        backendReachable,
        databaseConnected,
        cloudinaryConfigured,
        unavailableReason,
        health: healthData || null,
        startSession: startMutation.mutateAsync,
        isStarting: startMutation.isPending,
        resetWallet: resetMutation.mutateAsync,
        isResetting: resetMutation.isPending,
        refreshWallet,
        refreshHealth: () => healthQuery.refetch(),
        walletModalOpen,
        walletModalTab,
        setWalletModalTab,
        openWalletModal,
        closeWalletModal,
      }}
    >
      {children}
    </DemoWalletContext.Provider>
  )
}
