use client
import { useEffect, useState, useCallback } from "react"
import { fetchAllCampaigns, getCampaignRaw, getRegistryMeta, getDonation, getBlockHeight, mapCampaign, OnChainCampaign, } from "@/lib/stacks-contract"
import { USDCX_DECIMALS } from "@/lib/stacks-config"

const getDonationAmount = async (id: number, donor: string | undefined): Promise<number> => {
  if (!donor) return 0
  try {
    const raw = await getDonation(id, donor)
    const divisor = BigInt(10) ** BigInt(USDCX_DECIMALS)
    const whole = raw / divisor
    const fraction = raw % divisor
    return Number(whole) + Number(fraction) / Number(divisor)
  } catch {
    return 0
  }
}

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

export function useUserDonations(donor: string | undefined, campaignIds: number[]) {
  const [donations, setDonations] = useState<Record<number, number>>({})
  const [isLoading, setIsLoading] = useState(false)
  const idKey = campaignIds.join(",")
  useEffect(() => {
    if (!donor || campaignIds.length === 0) {
      setDonations({})
      return
    }
    let cancelled = false
    setIsLoading(true)
    Promise.all(campaignIds.map(async (id) => getDonationAmount(id, donor)))
      .then((amounts) => {
        if (cancelled) return
        const map: Record<number, number> = {}
        campaignIds.forEach((id, index) => {
          if (amounts[index] > 0) map[id] = amounts[index]
        })
        setDonations(map)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [donor, idKey])
  return { donations, isLoading }
}

export function useDonation(campaignId: number, donor: string | undefined) {
  const [donation, setDonation] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    if (!donor || !campaignId || isNaN(campaignId) || campaignId < 1) {
      setDonation(0)
      return
    }
    let cancelled = false
    setIsLoading(true)
    getDonationAmount(campaignId, donor)
      .then((amount) => {
        if (cancelled) return
        setDonation(amount)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [campaignId, donor])
  return { donation, isLoading }
}