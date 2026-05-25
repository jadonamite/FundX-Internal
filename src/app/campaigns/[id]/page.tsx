"use client"

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
import { getCampaign } from "@/lib/data"
import { useCampaign, useDonation } from "@/lib/hooks/useStacksContract"
import {
  FUNDX_CONTRACT_FQN,
  USDCX_FQN,
  CONTRACT_ADDRESS,
  CONTRACT_NAME,
  USDCX_DECIMALS,
  STACKS_NETWORK,
} from "@/lib/stacks-config"

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

  const { id } = use(params)
  const campaignIndex = Number(id)
  const isMockId = isNaN(campaignIndex)

  useEffect(() => setMounted(true), [])

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

  // --- MOCK CAMPAIGN (slug ID) ---
  if (isMockId) {
    if (!mockCampaign) return notFound()
    const mockProgress = Math.min((mockCampaign.raised / mockCampaign.goal) * 100, 100)
    return (
      <main className="min-h-screen bg-slate-50 selection:bg-orange-100 font-sans">
        <Navbar />
        <div className="container mx-auto max-w-6xl px-4 pt-32 pb-20">
          <Link href="/explore" className="inline-flex items-center text-slate-400 hover:text-slate-900 mb-8 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to campaigns
          </Link>
          <div className="mb-10">
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge variant="secondary" className="text-orange-600 bg-orange-50 border-orange-100 px-3 py-1 text-sm">Demo Campaign</Badge>
              <Badge variant="secondary" className="text-slate-500 bg-slate-50 border-slate-200 px-3 py-1 text-sm">{mockCampaign.category}</Badge>
              <div className="flex items-center text-slate-500 text-sm font-medium"><MapPin className="w-3 h-3 mr-1" />{mockCampaign.location}</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">{mockCampaign.title}</h1>
            <p className="text-xl text-slate-500 max-w-3xl">{mockCampaign.description}</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-slate-200 shadow-sm border border-slate-100">
                <Image src={mockCampaign.image} alt={mockCampaign.title} fill className="object-cover" />
              </div>
              <div className="flex items-center gap-4 border-y border-slate-200 py-6">
                <Avatar className="h-14 w-14 border-4 border-white shadow-sm">
                  <AvatarImage src={mockCampaign.creatorImage} />
                  <AvatarFallback>{mockCampaign.creator.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Organized by</p>
                  <p className="font-bold text-slate-900 text-lg">{mockCampaign.creator}</p>
                </div>
              </div>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                <p>{mockCampaign.description}</p>
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 not-prose mt-6">
                  <h4 className="font-bold text-orange-800 mb-2">Demo Campaign</h4>
                  <p className="text-orange-700/80 text-sm">This is a showcase campaign. On-chain donations are only available for live deployed campaigns.</p>
                </div>
              </div>
            </div>
            <div className="relative h-full">
              <div className="sticky top-32 p-8 rounded-[2rem] bg-white border border-slate-200 shadow-xl space-y-6">
                <div className="space-y-5">
                  <div>
                    <div className="text-4xl font-black text-slate-900">${mockCampaign.raised.toLocaleString()} <span className="text-xl font-bold text-slate-400">{mockCampaign.currency}</span></div>
                    <div className="text-base text-slate-400">of ${mockCampaign.goal.toLocaleString()} goal</div>
                  </div>
                  <Progress value={mockProgress} className="h-3 bg-slate-100" />
                  <div className="flex justify-between text-sm font-bold">
                    <span>{Math.round(mockProgress)}% funded</span>
                    <span className="flex items-center gap-1 text-orange-500"><Clock className="w-4 h-4" />{mockCampaign.daysLeft}d left</span>
                  </div>
                </div>
                <Separator />
                <Button disabled className="w-full h-14 rounded-xl bg-slate-200 text-slate-400 text-lg font-bold cursor-not-allowed">
                  Demo — Not Live
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-3 h-3" /> Deploy a real campaign to accept donations
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // --- ON-CHAIN CAMPAIGN (numeric ID) ---
  if (!campaign) return notFound()

  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100)
  const isPast = campaign.status !== "active"
  const isFlexible = campaign.fundingModel === "Flexible Model"
  const goalReached = campaign.raised >= campaign.goal

  const isCreator = !!userAddress && campaign.creator.toLowerCase() === userAddress.toLowerCase()
  const canWithdraw = isCreator && isPast && !campaign.withdrawn && (isFlexible || goalReached)
  const canRefund = !isFlexible && isPast && !goalReached && userDonation > 0
  const image = PLACEHOLDER_IMAGES[(campaignIndex - 1) % PLACEHOLDER_IMAGES.length]
  const creatorShort = `${campaign.creator.slice(0, 6)}...${campaign.creator.slice(-4)}`

  let donateDisabledReason = ""
  if (isPast) donateDisabledReason = "Campaign Ended"
  else if (!campaign.active) donateDisabledReason = "Campaign Closed"
  else if (!isFlexible && goalReached) donateDisabledReason = "Goal Reached"

  // --- Handlers ---
  const callContract = async (functionName: string, functionArgs: any[], postConditions: any[] = []) => {
    const { request } = await import("@stacks/connect")
    const result = await request("stx_callContract", {
      contract: FUNDX_CONTRACT_FQN as `${string}.${string}`,
      functionName,
      functionArgs,
      network: STACKS_NETWORK as any,
      postConditions: postConditions as any,
      postConditionMode: "deny",
    } as any)
    return result
  }

  const handleDonate = async () => {
    if (!isSignedIn || !userAddress) {
      authenticate()
      return
    }
    if (!donateAmount || Number(donateAmount) <= 0) {
      toast.error("Invalid Amount", { description: "Please enter a valid donation amount." })
      return
    }

    try {
      setTxPending(true)
      toast.loading("Awaiting wallet signature...", { id: "donate" })

      const { uintCV, Pc } = await import("@stacks/transactions")
      const amountUnits = toUnits(donateAmount)

      const pc = Pc.principal(userAddress)
        .willSendLte(amountUnits)
        .ft(USDCX_FQN as `${string}.${string}`, "usdcx")

      await callContract(
        "donate",
        [uintCV(campaignIndex), uintCV(amountUnits)],
        [pc]
      )

      toast.success("Donation broadcast — confirming on-chain...", { id: "donate" })
      setDonateAmount("")
      setTimeout(() => refetch(), 8000)
    } catch (err) {
      console.error(err)
      toast.error("Donation Failed", { id: "donate", description: "Transaction cancelled or failed." })
    } finally {
      setTxPending(false)
    }
  }

  const handleWithdraw = async () => {
    try {
      setTxPending(true)
      toast.loading("Awaiting wallet signature...", { id: "withdraw" })
      const { uintCV } = await import("@stacks/transactions")
      await callContract("withdraw", [uintCV(campaignIndex)])
      toast.success("Withdrawal broadcast — confirming on-chain...", { id: "withdraw" })
      setTimeout(() => refetch(), 8000)
    } catch (err) {
      console.error(err)
      toast.error("Withdrawal Failed", { id: "withdraw", description: "Transaction cancelled or failed." })
    } finally {
      setTxPending(false)
    }
  }

  const handleRefund = async () => {
    try {
      setTxPending(true)
      toast.loading("Awaiting wallet signature...", { id: "refund" })
      const { uintCV } = await import("@stacks/transactions")
      await callContract("claim-refund", [uintCV(campaignIndex)])
      toast.success(`Refund of ${userDonation} USDCx broadcast...`, { id: "refund" })
      setTimeout(() => refetch(), 8000)
    } catch (err) {
      console.error(err)
      toast.error("Refund Failed", { id: "refund", description: "Transaction cancelled or failed." })
    } finally {
      setTxPending(false)
    }
  }

  const statusBadge = {
    active: { label: "Active", className: "text-green-600 bg-green-50 border-green-100" },
    successful: { label: "Funded", className: "text-blue-600 bg-blue-50 border-blue-100" },
    failed: { label: "Failed", className: "text-red-600 bg-red-50 border-red-100" },
  }[campaign.status]

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-orange-100 font-sans">
      <Navbar />

      <div className="container mx-auto max-w-6xl px-4 pt-32 pb-20">
        <Link href="/explore" className="inline-flex items-center text-slate-400 hover:text-slate-900 mb-8 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to campaigns
        </Link>

        <div className="mb-10">
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge variant="secondary" className={`px-3 py-1 text-sm border ${statusBadge.className}`}>
              {campaign.status === "active" && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
              {campaign.status === "failed" && <XCircle className="w-3 h-3 mr-1 inline" />}
              {statusBadge.label}
            </Badge>
            <Badge variant="secondary" className="text-slate-500 bg-slate-50 border-slate-200 px-3 py-1 text-sm">
              {campaign.fundingModel}
            </Badge>
            <div className="flex items-center text-slate-500 text-sm font-medium">
              <MapPin className="w-3 h-3 mr-1" /> Stacks Mainnet
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Campaign #{id}
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl">
            A verified on-chain campaign raising USDCx on Stacks.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-slate-200 shadow-sm border border-slate-100">
              <Image src={image} alt={`Campaign #${id}`} fill className="object-cover" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-y border-slate-200 py-6 gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-4 border-white shadow-sm">
                  <AvatarFallback>{creatorShort.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Deployed by</p>
                  <p className="font-bold text-slate-900 font-mono text-base">{creatorShort}</p>
                </div>
              </div>
              <div className="flex gap-6 text-slate-600 font-medium">
                <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-500" /> Verified</div>
                {userDonation > 0 && (
                  <div className="flex items-center gap-2 text-orange-500">
                    <Wallet className="w-5 h-5" /> You contributed {userDonation} USDCx
                  </div>
                )}
              </div>
            </div>

            <Tabs defaultValue="story" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-slate-200 rounded-none h-auto p-0 mb-8">
                <TabsTrigger value="story" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 px-6 py-3 text-base">
                  Campaign Info
                </TabsTrigger>
                <TabsTrigger value="updates" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 px-6 py-3 text-base">
                  Updates
                </TabsTrigger>
              </TabsList>

              <TabsContent value="story" className="prose prose-slate prose-lg max-w-none text-slate-600">
                <div className="grid grid-cols-2 gap-6 not-prose mb-8">
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Funding Model</p>
                    <p className="text-lg font-bold text-slate-900">{isFlexible ? "Flexible" : "All-or-Nothing"}</p>
                    <p className="text-xs text-slate-400 mt-1">{isFlexible ? "Creator can withdraw at any time after deadline" : "Refunds issued if goal not met"}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Token</p>
                    <p className="text-lg font-bold text-slate-900">USDCx</p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">SIP-010 stablecoin</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Deadline Block</p>
                    <p className="text-lg font-bold text-slate-900">#{campaign.deadline.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-1">{isPast ? "Ended" : `~${campaign.daysLeft} days remaining`}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contract</p>
                    <p className="text-sm font-bold text-slate-900 font-mono">{CONTRACT_ADDRESS.slice(0, 8)}...{CONTRACT_ADDRESS.slice(-4)}</p>
                    <p className="text-xs text-slate-400 mt-1">{CONTRACT_NAME}</p>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 not-prose">
                  <h4 className="font-bold text-orange-800 mb-2">Smart Contract Enforced</h4>
                  <p className="text-orange-700/80 text-sm">
                    All fund movements are governed by the FundX Escrow contract on Stacks. No custodians, no discretion.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="updates" className="py-8 text-center text-slate-500">
                No updates yet.
              </TabsContent>
            </Tabs>
          </div>

          {/* Sticky funding panel */}
          <div className="relative h-full">
            <div className="sticky top-32 p-8 rounded-[2rem] bg-white border border-slate-200 shadow-xl space-y-6">
              <div className="space-y-5">
                <div className="space-y-1">
                  <div className="text-4xl font-black text-slate-900 tracking-tight">
                    {campaign.raised.toLocaleString()} <span className="text-xl font-bold text-slate-400">USDCx</span>
                  </div>
                  <div className="text-base font-medium text-slate-400">of {campaign.goal.toLocaleString()} goal</div>
                </div>

                <Progress value={progress} className="h-3 bg-slate-100" />

                <div className="flex justify-between text-sm font-bold pt-1">
                  <span className="text-slate-900">{Math.round(progress)}% funded</span>
                  <span className="flex items-center gap-1 text-orange-500">
                    <Clock className="w-4 h-4" />
                    {isPast ? "Ended" : `${campaign.daysLeft}d left`}
                  </span>
                </div>
              </div>

              <Separator />

              {canWithdraw && (
                <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                  <p className="text-sm font-bold text-green-800 mb-1">You are the creator</p>
                  <p className="text-xs text-green-600 mb-4">
                    {campaign.raised > 0 ? `${campaign.raised.toLocaleString()} USDCx is ready to withdraw.` : "No funds to withdraw."}
                  </p>
                  <Button
                    onClick={handleWithdraw}
                    disabled={txPending || campaign.raised === 0}
                    className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold"
                  >
                    {txPending ? <Loader2 className="w-4 h-4 animate-spin" /> : `Withdraw ${campaign.raised.toLocaleString()} USDCx`}
                  </Button>
                </div>
              )}

              {canRefund && (
                <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                  <p className="text-sm font-bold text-red-800 mb-1">Refund available</p>
                  <p className="text-xs text-red-600 mb-4">
                    Goal was not reached. You can reclaim your {userDonation} USDCx.
                  </p>
                  <Button
                    onClick={handleRefund}
                    disabled={txPending}
                    className="w-full h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold"
                  >
                    {txPending ? <Loader2 className="w-4 h-4 animate-spin" /> : `Claim ${userDonation} USDCx Refund`}
                  </Button>
                </div>
              )}

              {!isCreator && campaign.status === "active" && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Make a contribution</h4>
                    <p className="text-sm text-slate-500">Support this campaign.</p>
                  </div>

                  <div className={`transition-all duration-300 ${!isSignedIn ? "opacity-50 grayscale pointer-events-none" : ""}`}>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-base text-blue-600">USDCx</span>
                      <Input
                        type="number"
                        placeholder="100"
                        value={donateAmount}
                        onChange={(e) => setDonateAmount(e.target.value)}
                        className="pl-20 h-14 rounded-xl border-slate-200 bg-slate-50 text-xl font-bold focus-visible:ring-orange-500"
                      // TODO: add input validation
                      />
                    </div>
                  </div>

                  {isSignedIn ? (
                    <Button
                      disabled={!!donateDisabledReason || txPending || !donateAmount || Number(donateAmount) <= 0}
                      onClick={handleDonate}
                      className="w-full h-14 rounded-xl bg-slate-900 text-white hover:scale-[1.02] transition-transform text-lg font-bold"
                    >
                      {txPending ? <Loader2 className="w-5 h-5 animate-spin" /> : donateDisabledReason || "Donate Now"}
                    </Button>
                  ) : (
                    <Button
                      onClick={authenticate}
                      className="w-full h-14 rounded-xl bg-slate-900 text-white text-lg font-bold"
                    >
                      Connect Wallet to Donate
                    </Button>
                  )}
                </div>
              )}

              {isCreator && campaign.withdrawn && (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">Funds withdrawn</p>
                  <p className="text-sm text-slate-400">This campaign has been settled.</p>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-3 h-3" />
                <span>Secured by FundX Escrow on Stacks</span>
              </div>

              <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl h-12">
                <Share2 className="w-4 h-4 mr-2" /> Share this campaign
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
