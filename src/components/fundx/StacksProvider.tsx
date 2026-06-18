"use client"
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

const extractWalletData = (data: any): WalletData | null => {
  if (!data?.addresses?.stx?.[0]?.address) return null
  return {
    stxAddress: data.addresses.stx[0].address,
    btcAddress: data.addresses.btc?.[0]?.address,
  }
}

const findAddressEntry = (addresses: any[], prefix: string): string | undefined => {
  return addresses.find((addr: any) => addr.address?.startsWith(prefix))?.address
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
        console.error("Failed to check connection:", error)
      }
    }
    checkConnection()
  }, [])

  const authenticate = async () => {
    try {
      const { connect } = await import("@stacks/connect")
      // connect() returns { addresses: AddressEntry[] } - a flat array
      const response = await connect()
      const stxAddress = findAddressEntry(response.addresses, 'SP') || findAddressEntry(response.addresses, 'ST')
      const btcAddress = findAddressEntry(response.addresses, 'bc1') || findAddressEntry(response.addresses, 'tb1')
      if (stxAddress) {
        setWalletData({ stxAddress, btcAddress })
        setIsSignedIn(true)
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const signOut = async () => {
    try {
      const { disconnect } = await import("@stacks/connect")
      disconnect()
      setWalletData(null)
      setIsSignedIn(false)
    } catch (error) {
      console.error("Failed to disconnect:", error)
    }
  }

  return (
    <StacksContext.Provider value={{ walletData, authenticate, signOut, isSignedIn }}>
      {children}
    </StacksContext.Provider>
  )
}

export function useStacks() {
  const context = useContext(StacksContext)
  if (!context) {
    throw new Error("useStacks must be used within a StacksProvider")
  }
  return context
}
