use client
import { Clock, XCircle, CheckCircle2, Rocket, Loader2, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useStacks } from "@/components/fundx/StacksProvider"
import { useAllCampaigns } from "@/lib/hooks/useStacksContract"
import { OnChainCampaign } from "@/lib/stacks-contract"
import { FUNDX_CONTRACT_FQN, STACKS_NETWORK, parseTokenFqn } from "@/lib/stacks-config"
import { waitForTx } from "@/lib/utils"
import { toast } from "sonner"

function formatMoney(amount: number, currency: string) {
  return `${amount.toLocaleString()} ${currency}`
}

const getWithdrawalButtonState = (campaign: OnChainCampaign, withdrawingId: string | null) => {
  const canWithdraw = campaign.status !== "active" && !campaign.withdrawn && (campaign.fundingModel === "Flexible Model" || campaign.raised >= campaign.goal)
  const isWithdrawing = withdrawingId === campaign.id
  return { canWithdraw, isWithdrawing }
}

export function CreatorTab() {
  const { walletData } = useStacks()
  const userAddress = walletData?.stxAddress
  const { campaigns, isLoading, refetch } = useAllCampaigns()
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null)
  const myCampaigns = campaigns.filter((c) => userAddress && c.creator.toLowerCase() === userAddress.toLowerCase())

  const handleWithdraw = async (campaign: OnChainCampaign) => {
    try {
      setWithdrawingId(campaign.id)
      toast.loading("Awaiting wallet signature...", { id: `w-${campaign.id}` })
      const { request } = await import("@stacks/connect")
      const { uintCV, contractPrincipalCV } = await import("@stacks/transactions")
      const isStx = campaign.currency === "STX"
      const fnArgs = isStx ? [uintCV(Number(campaign.id))] : (() => {
        const [a, nme] = parseTokenFqn(campaign.token);
        return [contractPrincipalCV(a, nme), uintCV(Number(campaign.id))]
      })()
      const result = await request("stx_callContract", {
        contract: FUNDX_CONTRACT_FQN as `${string}.${string}`,
        functionName: isStx ? "withdraw-stx" : "withdraw-ft",
        functionArgs: fnArgs,
        network: STACKS_NETWORK as any,
        postConditionMode: "allow",
      } as any)
      toast.loading("Confirming on-chain...", { id: `w-${campaign.id}` })
      const status = await waitForTx((result as any)?.txid ?? "")
      if (status === "success") {
        toast.success("Withdrawal confirmed!", { id: `w-${campaign.id}` })
        refetch()
      } else if (status === "failed") {
        toast.error("Withdrawal failed on-chain", { id: `w-${campaign.id}` })
      } else {
        toast.info("Still confirming — check your wallet", { id: `w-${campaign.id}` })
        refetch()
      }
    } catch (err) {
      console.error(err)
      toast.error("Withdrawal Failed", { id: `w-${campaign.id}`, description: "Transaction cancelled or failed." })
    } finally {
      setWithdrawingId(null)
    }
  }

  if (isLoading) {
    return (
      <TabsContent value="campaigns">
        <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading your campaigns...</span>
        </div>
      </TabsContent>
    )
  }

  if (myCampaigns.length === 0) {
    return (
      <TabsContent value="campaigns">
        <div className="text-center py-20">
          <Rocket className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No campaigns yet</h3>
          <p className="text-slate-500 mb-8">You haven't deployed any campaigns on Stacks.</p>
          <Link href="/create">
            <Button className="h-12 px-8 rounded-xl bg-slate-900 text-white font-bold">
              <PlusCircle className="w-4 h-4 mr-2" />
              Launch a Campaign
            </Button>
          </Link>
        </div>
      </TabsContent>
    )
  }

  return (
    <TabsContent value="campaigns" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {myCampaigns.map((campaign) => {
        const progress = Math.min((campaign.raised / campaign.goal) * 100, 100)
        const { canWithdraw, isWithdrawing } = getWithdrawalButtonState(campaign, withdrawingId)
        if (campaign.status === "successful" || (campaign.status !== "active" && campaign.fundingModel === "Flexible Model")) {
          return (
            // ... rest of the code remains the same ...
          )
        }
        // ... rest of the code remains the same ...
      })}
    </TabsContent>
  )
}
