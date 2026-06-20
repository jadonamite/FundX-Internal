use client
import { Clock, CheckCircle2, Rocket, RefreshCcw, ShieldAlert, Loader2, PackageOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { useState, useMemo } from "react"
import { useStacks } from "@/components/fundx/StacksProvider"
import { useAllCampaigns, useUserDonations } from "@/lib/hooks/useStacksContract"
import { OnChainCampaign } from "@/lib/stacks-contract"
import { FUNDX_CONTRACT_FQN, STACKS_NETWORK, parseTokenFqn } from "@/lib/stacks-config"
import { waitForTx } from "@/lib/utils"
import { toast } from "sonner"

function formatMoney(amount: number, currency: string) {
  return `${amount.toLocaleString()} ${currency}`
}

interface Contribution {
  campaign: OnChainCampaign
  myContribution: number
  status: "active" | "successful" | "refund_available"
}

const handleRefund = async (
  c: Contribution,
  onSuccess: () => void,
  setPending: (pending: boolean) => void
) => {
  try {
    setPending(true)
    toast.loading("Awaiting wallet signature...", { id: `r-${c.campaign.id}` })
    const { request } = await import("@stacks/connect")
    const { uintCV, contractPrincipalCV } = await import("@stacks/transactions")
    const isStx = c.campaign.currency === "STX"
    const fnArgs = isStx ? [uintCV(Number(c.campaign.id))] : (
      () => {
        const [a, nme] = parseTokenFqn(c.campaign.token)
        return [contractPrincipalCV(a, nme), uintCV(Number(c.campaign.id))]
      }
    )()
    const result = await request("stx_callContract", {
      contract: FUNDX_CONTRACT_FQN as `${string}.${string}`,
      functionName: isStx ? "claim-refund-stx" : "claim-refund-ft",
      functionArgs: fnArgs,
      network: STACKS_NETWORK as any,
      postConditionMode: "allow",
    } as any)
    toast.loading("Confirming on-chain...", { id: `r-${c.campaign.id}` })
    const status = await waitForTx((result as any)?.txid ?? "")
    if (status === "success") {
      toast.success(`${c.myContribution} ${c.campaign.currency} refunded!`, { id: `r-${c.campaign.id}` })
      onSuccess()
    } else if (status === "failed") {
      toast.error("Refund failed on-chain", { id: `r-${c.campaign.id}` })
    } else {
      toast.info("Still confirming — check your wallet", { id: `r-${c.campaign.id}` })
      onSuccess()
    }
  } catch (err) {
    console.error(err)
    toast.error("Refund Failed", { id: `r-${c.campaign.id}`, description: "Transaction cancelled or failed." })
  } finally {
    setPending(false)
  }
}

function RefundCard({ c, onSuccess }: { c: Contribution; onSuccess: () => void }) {
  const [pending, setPending] = useState(false)
  return (
    <div
      className="bg-white p-8 md:p-10 min-h-[240px] rounded-[2rem] border border-blue-200 shadow-[0_12px_28px_-6px_rgba(59,130,246,0.12)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300"
    >
      <div className="absolute -right-4 -bottom-10 text-[120px] font-black text-blue-50 opacity-80 z-0 select-none pointer-events-none tracking-tighter leading-none">REFUND</div>
      <RefreshCcw strokeWidth={1} className="absolute right-10 -bottom-12 w-72 h-72 text-blue-500 opacity-5 z-0 pointer-events-none" />
      <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 z-10" />
      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full pl-2 relative z-10">
        <div className="relative w-full sm:w-40 h-52 sm:h-40 shrink-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm grayscale-[0.2]">
          <Image src={c.campaign.image} alt={c.campaign.title} fill className="object-cover" />
        </div>
        <div className="space-y-3 w-full">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-100/50 text-blue-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
              Goal Missed
            </span>
            <span className="text-slate-400 text-sm font-semibold">{c.campaign.fundingModel}</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{c.campaign.title}</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm mt-4">
            <div className="font-semibold text-blue-900 bg-blue-50 px-5 py-2.5 rounded-xl border border-blue-200/60 text-base">
              My Contribution: <span className="text-blue-600 font-extrabold">{formatMoney(c.myContribution, c.campaign.currency)}</span>
            </div>
            <div className="text-slate-500 font-medium text-base">
              Project raised {formatMoney(c.campaign.raised, c.campaign.currency)}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-auto shrink-0 relative z-10 mt-6 md:mt-0">
        <Button
          onClick={() => handleRefund(c, onSuccess, setPending)}
          disabled={pending}
          className="w-full md:w-auto h-16 px-10 rounded-xl bg-gradient-to-b from-blue-400 to-blue-500 border border-blue-600 text-white font-bold text-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
        >
          {pending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <RefreshCcw className="w-5 h-5" />
              Claim Refund
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function ActiveCard({ c }: { c: Contribution }) {
  const progress = Math.min((c.campaign.raised / c.campaign.goal) * 100, 100)
  return (
    // ... (rest of the code remains the same)
  )
}