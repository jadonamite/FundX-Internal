import { STACKS_MAINNET } from "@stacks/network"

export const STACKS_NETWORK = STACKS_MAINNET

// Escrow + registry deployer (CONTRACT-OWNER of the escrow)
export const CONTRACT_ADDRESS = "SP6X0MXEEGZX14ZTK7XQXJ76W35ZJDP9NZBT6F39"
// Dual-asset escrow: native STX OR allow-listed SIP-010 (USDCx), fundraiser's choice.
// STX uses *-stx functions; USDCx uses *-ft functions.
export const CONTRACT_NAME = "fundx-escrow-v4"
export const FUNDX_CONTRACT_FQN = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}` as const

export const REGISTRY_CONTRACT_NAME = 'fundx-registry'
export const REGISTRY_CONTRACT_FQN = `${CONTRACT_ADDRESS}.${REGISTRY_CONTRACT_NAME}` as const

// Real USDCx on Stacks mainnet (separate deployer from the escrow).
// Contract `usdcx`, FT asset `usdcx-token`, 6 decimals.
export const USDCX_CONTRACT_ADDRESS = "SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE"
export const USDCX_CONTRACT_NAME = "usdcx"
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

// Maps a token's contract name to its define-fungible-token asset identifier.
// Needed to build SIP-010 post-conditions on donate.
const TOKEN_ASSET_NAMES: Record<string, string> = {
  "usdcx": "usdcx-token", // real USDCx: SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx
  "usdcx-v2": "usdcx",    // legacy mock token
}

export function getTokenAssetName(contractName: string): string {
  return TOKEN_ASSET_NAMES[contractName] ?? contractName
}
