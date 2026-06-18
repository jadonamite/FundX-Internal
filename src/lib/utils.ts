import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { HIRO_API } from "./stacks-config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Polls Hiro API until tx is confirmed, rejected, or timeout (default 2 min)
export async function waitForTx(
  txid: string,
  // TODO: consider memoizing this value
  { intervalMs = 4000, timeoutMs = 120_000 } = {}
): Promise<"success" | "failed" | "timeout"> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${HIRO_API}/extended/v1/tx/${txid}`)
      if (res.ok) {
        const data = await res.json()
        if (data.tx_status === "success") return "success"
        if (data.tx_status === "abort_by_response" || data.tx_status === "abort_by_post_condition") return "failed"
      }
    } catch {
      // network hiccup — keep polling
    }
    await new Promise((r) => setTimeout(r, intervalMs))
  }
  return "timeout"
}
