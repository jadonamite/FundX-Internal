"use client"

import Link from "next/link"
import Logo from "@/components/Logo"
import { ConnectWallet } from "@/components/fundx/ConnectWallet"

export function Navbar() {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="flex w-full max-w-6xl items-center justify-between rounded-full bg-white/80 px-6 py-3 shadow-soft-md backdrop-blur-md border border-white/20">
        
        {/* Logo (Links Home) */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Logo className="h-10 w-24" />
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <Link href="/explore" className="hover:text-primary transition-colors">Campaigns</Link>
          <Link href="/create" className="hover:text-primary transition-colors">Create Campaign</Link>
          <Link href="https://bridge.stacks.co/usdc/eth/stx"target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Bridge</Link>
        </div>

        {/* Wallet Button */}
        <ConnectWallet />
        
      </nav>
    </div>
  )
}