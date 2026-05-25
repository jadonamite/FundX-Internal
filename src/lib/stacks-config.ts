import { STACKS_MAINNET } from "@stacks/network"

export const STACKS_NETWORK = STACKS_MAINNET

export const CONTRACT_ADDRESS = "SP6X0MXEEGZX14ZTK7XQXJ76W35ZJDP9NZBT6F39"
export const CONTRACT_NAME = "fundx-escrow-v2"
export const FUNDX_CONTRACT_FQN = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}` as const

export const USDCX_CONTRACT_NAME = "usdcx-v2"
export const USDCX_FQN = `${CONTRACT_ADDRESS}.${USDCX_CONTRACT_NAME}` as const

// TODO: optimize for large datasets
export const USDCX_DECIMALS = 6
export const PLATFORM_FEE_BPS = 200
export const BLOCKS_PER_DAY = 144

export const HIRO_API = "https://api.hiro.so"

export const FUNDING_MODEL = {
  FLEXIBLE: 0,
  ALL_OR_NOTHING: 1,
} as const
