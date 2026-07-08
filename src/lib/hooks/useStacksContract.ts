import { useEffect, useState, useCallback } from "react"
import {
  fetchAllCampaigns,
  getCampaignRaw,
  getRegistryMeta,
  getDonation,
  getBlockHeight,
  mapCampaign,
  OnChainCampaign,
} from "@/lib/stacks-contract"
import { USDCX_DECIMALS } from "@/lib/stacks-config"

export function useAllCampaigns() {
  const [campaigns, setCampaigns] = useState<OnChainCampaign[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [refetchToken, setRefetchToken] = useState(0)

  const refetch = useCallback(() => setRefetchToken((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    fetchAllCampaigns()
      .then(({ campaigns, count }) => {
        if (cancelled) return
        setCampaigns(campaigns)
        setCount(count)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e : new Error(String(e)))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [refetchToken])

  return { campaigns, count, isLoading, error, refetch }
}

export function useCampaign(id: number) {
  const [campaign, setCampaign] = useState<OnChainCampaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [refetchToken, setRefetchToken] = useState(0)

  const refetch = useCallback(() => setRefetchToken((t) => t + 1), [])

  useEffect(() => {
    if (!id || isNaN(id) || id < 1) {
      setIsLoading(false)
      setCampaign(null)
      return
    }
    let cancelled = false
    setIsLoading(true)
    setError(null)
    Promise.all([getCampaignRaw(id), getBlockHeight(), getRegistryMeta(id)])
      .then(([raw, blockHeight, meta]) => {
        if (cancelled) return
        setCampaign(raw ? mapCampaign(raw, id, blockHeight, meta) : null)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e : new Error(String(e)))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, refetchToken])

  return { campaign, isLoading, error, refetch }
}

const calculateDonationAmount = (amount: bigint) => {
  const divisor = BigInt(10) ** BigInt(USDCX_DECIMALS)
  const whole = amount / divisor
  const fraction = amount % divisor
  return Number(whole) + Number(fraction) / Number(divisor)
}

export function useUserDonations(donor: string | undefined, campaignIds: number[]) {
  const [donations, setDonations] = useState<Record<number, number>>({})
  const [isLoading, setIsLoading] = useState(false)

  const idKey = campaignIds.join(\