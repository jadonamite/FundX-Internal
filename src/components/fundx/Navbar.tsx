use client
import Link from "next/link"
import Logo from "@/components/Logo"
import { ConnectWallet } from "@/components/fundx/ConnectWallet"
import { useStacks } from "@/components/fundx/StacksProvider"

const renderLinks = (isSignedIn: boolean) => [
  { href: "/explore", label: "Campaigns" },
  { href: "/create", label: "Create Campaign" },
  { href: "https://bridge.stacks.co/usdc/eth/stx", label: "Bridge", target: "_blank", rel: "noopener noreferrer" },
  ...(isSignedIn ? [{ href: "/dashboard", label: "Dashboard" }] : []),
]

export function Navbar() {
  // Pull in the connection status to know if we should show the Dashboard link
  const { isSignedIn } = useStacks()
  const links = renderLinks(isSignedIn)

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="flex w-full max-w-6xl items-center justify-between rounded-full bg-white/80 px-6 py-3 shadow-soft-md backdrop-blur-md border border-white/20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Logo className="h-10 w-24" />
        </Link>
        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              target={link.target}
              rel={link.rel}
              className="hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        {/* Wallet Button (Handles its own connected/disconnected state visually) */}
        <ConnectWallet />
      </nav>
    </div>
  )
}