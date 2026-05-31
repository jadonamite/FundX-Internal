import { STACKS_MAINNET } from "@stacks/network"

export const STACKS_NETWORK = STACKS_MAINNET

export const CONTRACT_ADDRESS = "SP6X0MXEEGZX14ZTK7XQXJ76W35ZJDP9NZBT6F39"
export const CONTRACT_NAME = "indiegogo-v2"
export const FUNDX_CONTRACT_FQN = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}` as const

export const USDCX_CONTRACT_ADDRESS = CONTRACT_ADDRESS
export const USDCX_CONTRACT_NAME = "usdcx-v2"
export const USDCX_FQN = `${USDCX_CONTRACT_ADDRESS}.${USDCX_CONTRACT_NAME}` as const

export const USDCX_DECIMALS = 6
export const PLATFORM_FEE_BPS = 200
export const BLOCKS_PER_DAY = 144

export const HIRO_API = "https://api.hiro.so"

export const FUNDING_MODEL = {
  FLEXIBLE: 0,
  ALL_OR_NOTHING: 1,
} as const

export function parseTokenFqn(fqn: string): [string, string] {
  const dot = fqn.lastIndexOf(".")
  return [fqn.slice(0, dot), fqn.slice(dot + 1)]
}

// Maps contract names to their define-fungible-token asset identifier
const TOKEN_ASSET_NAMES: Record<string, string> = {
  "usdcx-v2": "usdcx",
  "usdcx": "usdcx",
}

export function getTokenAssetName(contractName: string): string {
  return TOKEN_ASSET_NAMES[contractName] ?? contractName
}
