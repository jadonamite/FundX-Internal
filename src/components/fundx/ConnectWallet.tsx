use client
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useStacks } from "@/components/fundx/StacksProvider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Copy, LogOut, Wallet } from "lucide-react"
import { toast } from "sonner"
import { useWalletUtils } from "./useWalletUtils" // <--- New utility hook

export function ConnectWallet() {
  const { authenticate, signOut, isSignedIn, walletData } = useStacks()
  const [mounted, setMounted] = useState(false)
  const [justConnected, setJustConnected] = useState(false)
  const prevSignedIn = useRef<boolean | null>(null)
  const { copyAddress, handleDisconnect } = useWalletUtils(walletData, signOut, toast) // <--- Using the new utility hook

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (prevSignedIn.current === false && isSignedIn) {
      setJustConnected(true)
      toast.success("Wallet Connected", { description: "Ready to fund the future.", duration: 3000, })
      const timer = setTimeout(() => setJustConnected(false), 2000)
      prevSignedIn.current = true
      return () => clearTimeout(timer)
    }
    prevSignedIn.current = isSignedIn
  }, [isSignedIn, mounted])

  if (!mounted) {
    return (
      <Button className="rounded-full bg-slate-900 text-white px-6 opacity-50">
        Loading...
      </Button>
    )
  }

  if (isSignedIn && walletData?.stxAddress) {
    const addr = walletData.stxAddress
    const isMainnet = addr.startsWith("SP")
    return (
      <div className="relative inline-flex">
        {justConnected && (
          <span className="absolute -inset-1 rounded-full bg-green-500 opacity-75 animate-ping duration-1000" />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className={` relative z-10 rounded-full px-6 font-bold tracking-tight transition-all duration-500 ${justConnected ? "bg-green-500 border-green-400 text-white shadow-lg" : "bg-gradient-tush text-white shadow-glow hover:opacity-90 hover:scale-105"}`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isMainnet ? "bg-green-300" : "bg-orange-300"} animate-pulse`} />
                <span className="font-mono text-sm">
                  {addr.slice(0, 4)}...{addr.slice(-4)}
                </span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 rounded-xl p-2 shadow-xl border-slate-100 mt-2">
            <DropdownMenuLabel className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">
              My Wallet
            </DropdownMenuLabel>
            <div className="mx-1 px-3 py-2 mb-2 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-700">
                  {isMainnet ? " Mainnet" : "Testnet"}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono break-all leading-tight">
                {addr}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={copyAddress} className="cursor-pointer focus:bg-slate-50 font-medium text-slate-600 py-2.5">
              <Copy className="w-4 h-4 mr-2 opacity-70" />
              Copy Address
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer focus:bg-red-50 focus:text-red-600 text-red-500 font-medium py-2.5">
              <LogOut className="w-4 h-4 mr-2 opacity-70" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <Button onClick={authenticate} className="rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20 px-6 transition-all hover:scale-105">
      Connect Wallet
    </Button>
  )
}
