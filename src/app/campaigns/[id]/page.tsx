use client
import { useState, use, useEffect } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/fundx/Navbar"
import { Footer } from "@/components/fundx/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, ShieldCheck, Share2, MapPin, ArrowLeft, Loader2, CheckCircle2, XCircle, Wallet } from "lucide-react"
import { useStacks } from "@/components/fundx/StacksProvider"
import { toast } from "sonner"
import { waitForTx } from "@/lib/utils"
import { getCampaign } from "@/lib/data"
import { useCampaign, useDonation } from "@/lib/hooks/useStacksContract"
import { fetchExtraMeta, type ExtraMeta } from "@/lib/campaign-meta"
import { FUNDX_CONTRACT_FQN, CONTRACT_ADDRESS, CONTRACT_NAME, USDCX_DECIMALS, STACKS_NETWORK, parseTokenFqn, getTokenAssetName, }
from "@/lib/stacks-config"
const PLACEHOLDER_IMAGES = ["/campaign-1.jpg", "/campaign-2.jpg", "/campaign-3.jpg"]
function toUnits(amount: string): bigint {
  const [whole, fraction = ""] = amount.split(".")
  const fractionPadded = (fraction + "0".repeat(USDCX_DECIMALS)).slice(0, USDCX_DECIMALS)
  return BigInt(whole) * BigInt(10) ** BigInt(USDCX_DECIMALS) + BigInt(fractionPadded || 0)
}
export default function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { isSignedIn, authenticate, walletData } = useStacks()
  const userAddress = walletData?.stxAddress
  const [donateAmount, setDonateAmount] = useState("")
  const [mounted, setMounted] = useState(false)
  const [txPending, setTxPending] = useState(false)
  const [extraMeta, setExtraMeta] = useState<ExtraMeta | null>(null)
  const { id } = use(params)
  const campaignIndex = Number(id)
  const isMockId = isNaN(campaignIndex)
  useEffect(() => setMounted(true), [])
  useEffect(() => {
    if (isMockId || !campaignIndex || campaignIndex < 1) return
    fetchExtraMeta(campaignIndex).then(setExtraMeta)
  }, [isMockId, campaignIndex])
  const { campaign, isLoading, refetch } = useCampaign(isMockId ? 0 : campaignIndex)
  const { donation: userDonation } = useDonation(campaignIndex, userAddress)
  const mockCampaign = isMockId ? getCampaign(id) : null
  if (!mounted || (!isMockId && isLoading)) {
    return (
      <main className="min-h-screen bg-slate-50 font-sans flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </main>
    )
  }
  if (isMockId) {
    if (!mockCampaign) return notFound()
    const mockProgress = Math.min((mockCampaign.raised / mockCampaign.goal) * 100, 100)
    return (
      // ... (rest of the mock campaign JSX)
    )
  }
  if (!campaign) return notFound()
  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100)
  const isPast = campaign.status !== "active"
  const isFlexible = campaign.fundingModel === "Flexible Model"
  const goalReached = campaign.raised >= campaign.goal
  const currency = campaign.currency
  const isCreator = !!userAddress && campaign.creator.toLowerCase() === userAddress.toLowerCase()
  const canWithdraw = isCreator && isPast && !campaign.withdrawn && (isFlexible || goalReached)
  const canRefund = !isFlexible && isPast && !goalReached && userDonation > 0
  const image = PLACEHOLDER_IMAGES[(campaignIndex - 1) % PLACEHOLDER_IMAGES.length]
  return (
    // ... (rest of the on-chain campaign JSX)
  )
}