use client

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

interface WalletData {
  stxAddress: string
  btcAddress?: string
}

interface StacksContextValue {
  walletData: WalletData | null
  authenticate: () => Promise<void>
  signOut: () => void
  isSignedIn: boolean
}

const StacksContext = createContext<StacksContextValue | undefined>(undefined)

const extractWalletData = (data: any) => {
  if (data?.addresses?.stx?.[0]?.address) {
    return {
      stxAddress: data.addresses.stx[0].address,
      btcAddress: data.addresses.btc?.[0]?.address,
    }
  }
  return null
}

const findAddressEntry = (addresses: any[], prefix: string) => {
  return addresses.find((addr) => addr.address?.startsWith(prefix))
}

export function StacksProvider({ children }: { children: ReactNode }) {
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [isSignedIn, setIsSignedIn] = useState(false)

  // Check connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { isConnected, getLocalStorage } = await import("@stacks/connect")
        if (isConnected()) {
          const data = getLocalStorage()
          const extractedData = extractWalletData(data)
          if (extractedData) {
            setWalletData(extractedData)
            setIsSignedIn(true)
          }
        }
      } catch (error) {
        console.error("Failed to check connection:\