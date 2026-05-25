import {
  fetchCallReadOnlyFunction,
  uintCV,
  standardPrincipalCV,
  cvToJSON,
  ClarityValue,
} from "@stacks/transactions"
import {
  CONTRACT_ADDRESS,
  CONTRACT_NAME,
  STACKS_NETWORK,
  USDCX_DECIMALS,
  BLOCKS_PER_DAY,
  HIRO_API,
} from "./stacks-config"

export interface RawCampaign {
  creator: string
  goal: bigint
  deadline: bigint
  totalRaised: bigint
  withdrawn: boolean
  active: boolean
  fundingModel: number
}

export interface OnChainCampaign {
  id: string
  title: string
  description: string
  image: string
  category: string
  creator: string
  currency: "USDCx"
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

async function readOnly(functionName: string, functionArgs: ClarityValue[]): Promise<any> {
  const result = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName,
    functionArgs,
    network: STACKS_NETWORK,
    senderAddress: CONTRACT_ADDRESS,
  })
  return cvToJSON(result)
}

export async function getNonce(): Promise<number> {
  const json = await readOnly("get-nonce", [])
  return Number(json.value)
}

export async function getCampaignRaw(id: number): Promise<RawCampaign | null> {
  const json = await readOnly("get-campaign", [uintCV(id)])
  if (!json || json.value === null || json.value === undefined) return null
  const tuple = json.value.value
  if (!tuple) return null
  return {
    creator: tuple.creator.value,
    goal: BigInt(tuple.goal.value),
    deadline: BigInt(tuple.deadline.value),
    totalRaised: BigInt(tuple["total-raised"].value),
    withdrawn: tuple.withdrawn.value,
    active: tuple.active.value,
    fundingModel: Number(tuple["funding-model"].value),
  }
}

export async function getDonation(campaignId: number, donor: string): Promise<bigint> {
  const json = await readOnly("get-donation", [uintCV(campaignId), standardPrincipalCV(donor)])
  if (!json || json.value === null || json.value === undefined) return BigInt(0)
  const tuple = json.value.value
  if (!tuple || !tuple.amount) return BigInt(0)
  return BigInt(tuple.amount.value)
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

export function mapCampaign(raw: RawCampaign, id: number, currentBlock: number): OnChainCampaign {
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
    title: `Campaign #${id}`,
    description: "A verified on-chain campaign raising USDCx on Stacks.",
    image: PLACEHOLDER_IMAGES[(id - 1) % PLACEHOLDER_IMAGES.length],
    category: "DeFi",
    creator: raw.creator,
    currency: "USDCx",
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
  const [nonce, blockHeight] = await Promise.all([getNonce(), getBlockHeight()])
  if (nonce === 0) return { campaigns: [], count: 0, blockHeight }

  // IDs are 1-indexed on Stacks contract (nonce starts at 0, first campaign gets ID 1)
  const ids = Array.from({ length: nonce }, (_, i) => i + 1)
  const results = await Promise.all(ids.map((id) => getCampaignRaw(id).catch(() => null)))

  const campaigns = results
    .map((raw, i) => (raw ? mapCampaign(raw, ids[i], blockHeight) : null))
    .filter(Boolean) as OnChainCampaign[]

  return { campaigns, count: nonce, blockHeight }
}
