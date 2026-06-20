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

const extractWalletData = (addresses: any[]) => {
  const stxEntry = addresses.find((addr: any) => addr.address?.startsWith('SP') || addr.address?.startsWith('ST'))
  const btcEntry = addresses.find((addr: any) => addr.address?.startsWith('bc1') || addr.address?.startsWith('tb1'))
  if (stxEntry?.address) {
    return {
      stxAddress: stxEntry.address,
      btcAddress: btcEntry?.address,
    }
  }
  return null
}

const getLocalStorageData = async () => {
  try {
    const { getLocalStorage } = await import("@stacks/connect")
    const data = getLocalStorage()
    if (data?.addresses?.stx?.[0]?.address) {
      return {
        stxAddress: data.addresses.stx[0].address,
        btcAddress: data.addresses.btc?.[0]?.address,
      }
    }
  } catch (error) {
    console.error("Failed to get local storage data:", error)
  }
  return null
}

export function StacksProvider({ children }: { children: ReactNode }) {
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [isSignedIn, setIsSignedIn] = useState(false)

  // Check connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { isConnected } = await import("@stacks/connect")
        if (isConnected()) {
          const data = await getLocalStorageData()
          if (data) {
            setWalletData(data)
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
      const response = await connect()
      const data = extractWalletData(response.addresses)
      if (data) {
        setWalletData(data)
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
