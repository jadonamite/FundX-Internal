"use client"

import Link from "next/link"
import Logo from "@/components/Logo"
import { ConnectWallet } from "@/components/fundx/ConnectWallet"
import { useStacks } from "@/components/fundx/StacksProvider"

export function Navbar() {
  // Pull in the connection status to know if we should show the Dashboard link
  const { isSignedIn } = useStacks()

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="flex w-full max-w-6xl items-center justify-between rounded-full bg-white/80 px-6 py-3 shadow-soft-md backdrop-blur-md border border-white/20">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Logo className="h-10 w-24" />
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <Link href="/explore" className="hover:text-primary transition-colors">Campaigns</Link>
          <Link href="/create" className="hover:text-primary transition-colors">Create Campaign</Link>
          <Link href="https://bridge.stacks.co/usdc/eth/stx" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Bridge</Link>
          
       
          {isSignedIn && (
            <Link href="/dashboard" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
          )}
        </div>

        {/* Wallet Button (Handles its own connected/disconnected state visually) */}
        <ConnectWallet />
        
      </nav>
    </div>
  )
}

// ⟳ echo · src/components/ui/select.tsx
//         className={cn(
//           "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
//           position === "popper" &&