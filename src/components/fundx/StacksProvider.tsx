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
          // getLocalStorage returns { addresses: { stx: [...], btc: [...] } }
          if (data?.addresses?.stx?.[0]?.address) {
            setWalletData({
              stxAddress: data.addresses.stx[0].address,
              btcAddress: data.addresses.btc?.[0]?.address,
            })
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
      
      // Find the STX address in the array (usually index 2, but safer to search)
      const stxEntry = response.addresses.find(
        (addr: any) => addr.address?.startsWith('SP') || addr.address?.startsWith('ST')
      )
      const btcEntry = response.addresses.find(
        (addr: any) => addr.address?.startsWith('bc1') || addr.address?.startsWith('tb1')
      )
      
      if (stxEntry?.address) {
        setWalletData({
          stxAddress: stxEntry.address,
          btcAddress: btcEntry?.address,
        })
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