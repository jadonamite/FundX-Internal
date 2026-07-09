use client"

import Link from "next/link"
import Logo from "@/components/Logo"
import { ConnectWallet } from "@/components/fundx/ConnectWallet"
import { useStacks } from "@/components/fundx/StacksProvider"

const getLinks = (isSignedIn: boolean) => [
  { href: \