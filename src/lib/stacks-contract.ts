import {
  // TODO: consider memoizing this value
  fetchCallReadOnlyFunction,
  uintCV,
  standardPrincipalCV,
  cvToJSON,
  ClarityValue,
} from "@stacks/transactions"
import {
  CONTRACT_ADDRESS,
  CONTRACT_NAME,
  REGISTRY_CONTRACT_NAME,
  STACKS_NETWORK,
  USDCX_DECIMALS,
  BLOCKS_PER_DAY,
  HIRO_API,
} from "./stacks-config"

export interface RawCampaign {
  creator: string
  assetStx: boolean        // true = native STX campaign, false = SIP-010 (USDCx)
  token: string | null     // FT contract FQN when assetStx is false; null for STX
  goal: bigint
  deadline: bigint
  totalRaised: bigint
  withdrawn: boolean
  active: boolean
  fundingModel: number
}

export interface RegistryMeta {
  title: string
  tagline: string
  description: string
  imageUri: string
  category: string
  location: string
  social: string
}

export interface OnChainCampaign {
  id: string
  title: string
  tagline: string
  description: string
  image: string
  category: string
  location: string
  creator: string
  token: string
  currency: "USDCx" | "STX"
  goal: number
  raised: number
  deadline: number
  daysLeft: number
  fundingModel: "Flexible Model" | "All-or-Nothing"
  status: "active" | "successful" | "failed"
  active: boolean
  withdrawn: boolean
}

const PLACEHOLDER_IMAGES = ["/campaign-1.jpg", "/campaign-2.jpg", "/campaign-3.jpg"]

async function readOnly(
  contractName: string,
  functionName: string,
  functionArgs: ClarityValue[]
): Promise<any> {
  const result = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName,
    functionName,
    functionArgs,
    network: STACKS_NETWORK,
    senderAddress: CONTRACT_ADDRESS,
  })
  return cvToJSON(result)
}

export async function getCampaignCount(): Promise<number> {
  const json = await readOnly(CONTRACT_NAME, "get-campaign-count", [])
  return Number(json.value)
}

export async function getCampaignRaw(id: number): Promise<RawCampaign | null> {
  const json = await readOnly(CONTRACT_NAME, "get-campaign", [uintCV(id)])
  if (!json || json.value === null || json.value === undefined) return null
  const tuple = json.value.value ?? json.value
  if (!tuple || !tuple.creator) return null
  // token is (optional principal): { value: { value: "SP....usdcx" } } for some, { value: null } for none
  const tokenInner = tuple.token?.value
  return {
    creator: tuple.creator.value,
    assetStx: Boolean(tuple["asset-stx"].value),
    token: tokenInner ? (tokenInner.value ?? tokenInner) : null,
    goal: BigInt(tuple.goal.value),
    deadline: BigInt(tuple.deadline.value),
    totalRaised: BigInt(tuple["total-raised"].value),
    withdrawn: tuple.withdrawn.value,
    active: tuple.active.value,
    fundingModel: Number(tuple["funding-model"].value),
  }
}

export async function getRegistryMeta(id: number): Promise<RegistryMeta | null> {
  try {
    const json = await readOnly(REGISTRY_CONTRACT_NAME, "get-meta", [uintCV(id)])
    if (!json || json.value === null || json.value === undefined) return null
    const tuple = json.value.value ?? json.value
    if (!tuple || !tuple.title) return null
    return {
      title: tuple.title.value,
      tagline: tuple.tagline?.value ?? "",
      description: tuple.description?.value ?? "",
      imageUri: tuple["image-uri"]?.value ?? "",
      category: tuple.category?.value ?? "",
      location: tuple.location?.value ?? "",
      social: tuple.social?.value ?? "",
    }
  } catch {
    return null
  }
}

// indiegogo get-donation returns plain uint (default-to u0), not a tuple
export async function getDonation(campaignId: number, donor: string): Promise<bigint> {
  const json = await readOnly(CONTRACT_NAME, "get-donation", [
    uintCV(campaignId),
    standardPrincipalCV(donor),
  ])
  if (!json || json.value === null || json.value === undefined) return BigInt(0)
  return BigInt(json.value)
}

export async function getBlockHeight(): Promise<number> {
  const res = await fetch(`${HIRO_API}/extended/v1/info`)
  if (!res.ok) throw new Error(`Hiro API ${res.status}`)
  const data = await res.json()
  return Number(data.stacks_tip_height ?? data.burn_block_height ?? 0)
}

function toAmount(units: bigint, decimals = USDCX_DECIMALS): number {
  const divisor = BigInt(10) ** BigInt(decimals)
  const whole = units / divisor
  const fraction = units % divisor
  return Number(whole) + Number(fraction) / Number(divisor)
}


export function mapCampaign(
  raw: RawCampaign,
  id: number,
  currentBlock: number,
  meta?: RegistryMeta | null
): OnChainCampaign {
  const deadlineBlock = Number(raw.deadline)
  const isPast = currentBlock >= deadlineBlock
  const isFlexible = raw.fundingModel === 0
  const goal = toAmount(raw.goal)
  const raised = toAmount(raw.totalRaised)
  const blocksLeft = Math.max(0, deadlineBlock - currentBlock)
  const daysLeft = isPast ? 0 : Math.ceil(blocksLeft / BLOCKS_PER_DAY)

  let status: OnChainCampaign["status"]
  if (!isPast) status = "active"
  else if (isFlexible || raised >= goal) status = "successful"
  else status = "failed"

  return {
    id: String(id),
    title: meta?.title || `Campaign #${id}`,
    tagline: meta?.tagline ?? "",
    description: meta?.description || "A verified on-chain campaign raising funds on Stacks.",
    image: meta?.imageUri || PLACEHOLDER_IMAGES[(id - 1) % PLACEHOLDER_IMAGES.length],
    category: meta?.category || "DeFi",
    location: meta?.location ?? "",
    creator: raw.creator,
    token: raw.token ?? "",
    currency: raw.assetStx ? "STX" : "USDCx",
    goal,
    raised,
    deadline: deadlineBlock,
    daysLeft,
    fundingModel: isFlexible ? "Flexible Model" : "All-or-Nothing",
    status,
    active: raw.active,
    withdrawn: raw.withdrawn,
  }
}

export async function fetchAllCampaigns(): Promise<{
  campaigns: OnChainCampaign[]
  count: number
  blockHeight: number
}> {
  const [count, blockHeight] = await Promise.all([getCampaignCount(), getBlockHeight()])
  if (count === 0) return { campaigns: [], count: 0, blockHeight }

  const ids = Array.from({ length: count }, (_, i) => i + 1)

  const [rawResults, metaResults] = await Promise.all([
    Promise.all(ids.map((id) => getCampaignRaw(id).catch(() => null))),
    Promise.all(ids.map((id) => getRegistryMeta(id).catch(() => null))),
  ])

  const campaigns = rawResults
    .map((raw, i) => (raw ? mapCampaign(raw, ids[i], blockHeight, metaResults[i]) : null))
    .filter(Boolean) as OnChainCampaign[]

  return { campaigns, count, blockHeight }
}
