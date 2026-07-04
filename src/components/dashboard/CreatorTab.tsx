use client"

import { Clock, XCircle, CheckCircle2, Rocket, Loader2, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useStacks } from "@/components/fundx/StacksProvider"
import { useAllCampaigns } from "@/lib/hooks/useStacksContract"
import { OnChainCampaign } from "@/lib/stacks-contract"
import { FUNDX_CONTRACT_FQN, STACKS_NETWORK_NAME, parseTokenFqn } from "@/lib/stacks-config"
import { waitForTx } from "@/lib/utils"
import { toast } from "sonner"

function formatMoney(amount: number, currency: string) {
  return `${amount.toLocaleString()} ${currency}`
}

const getWithdrawalArgs = (campaign: OnChainCampaign) => {
  const isStx = campaign.currency === "STX"
  if (isStx) {
    return [uintCV(Number(campaign.id))]
  } else {
    const [a, nme] = parseTokenFqn(campaign.token)
    return [contractPrincipalCV(a, nme), uintCV(Number(campaign.id))]
  }
}

const handleWithdraw = async (campaign: OnChainCampaign) => {
  try {
    const { request } = await import("@stacks/connect")
    const { uintCV, contractPrincipalCV } = await import("@stacks/transactions")
    const isStx = campaign.currency === "STX"
    const fnArgs = getWithdrawalArgs(campaign)
    const result = await request("stx_callContract", {
      contract: FUNDX_CONTRACT_FQN as `${string}.${string}`,
      functionName: isStx ? "withdraw-stx" : "withdraw-ft",
      functionArgs: fnArgs,
      network: STACKS_NETWORK_NAME,
      postConditionMode: "allow",
    })
    toast.loading("Confirming on-chain...\