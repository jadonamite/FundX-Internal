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

const handleRefundRequest = async (
  c: Contribution,
  setPending: (pending: boolean) => void,
  onSuccess: () => void
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
    const result = await request(
      "stx_callContract",
      {
        contract: FUNDX_CONTRACT_FQN as `${string}.${string}`,
        functionName: isStx ? "claim-refund-stx" : "claim-refund-ft",
        functionArgs: fnArgs,
        network: STACKS_NETWORK as any,
        postConditionMode: "allow",
      } as any
    )
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
  const handleRefund = async () => {
    await handleRefundRequest(c, setPending, onSuccess)
  }
  return (
    // ...
  )
}
function ActiveCard({ c }: { c: Contribution }) {
  // ...
}