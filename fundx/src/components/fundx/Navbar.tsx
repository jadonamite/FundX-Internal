"use client"

import Link from "next/link"
import { ConnectWallet } from "@/components/fundx/ConnectWallet" // <--- Import the new button

export function Navbar() {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="flex w-full max-w-5xl items-center justify-between rounded-full bg-white/80 px-6 py-3 shadow-soft-md backdrop-blur-md border border-white/20">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-tush flex items-center justify-center text-white font-bold shadow-sm">
            F
          </div>
          <span className="font-bold text-slate-900">FundX</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <Link href="#campaigns" className="hover:text-primary transition-colors">Campaigns</Link>
          <Link href="#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
          <Link href="#bridge" className="hover:text-primary transition-colors">Bridge</Link>
        </div>

        {/* THE ACTION: Use the smart button here */}
        <ConnectWallet />
        
      </nav>
    </div>
  )
}