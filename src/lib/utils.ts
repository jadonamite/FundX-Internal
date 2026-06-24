import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { HIRO_API } from "./stacks-config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to get the transaction status
const getTxStatus = async (txid: string): Promise<{ tx_status: string } | null> => {
  try {
    const res = await fetch(`${HIRO_API}/extended/v1/tx/${txid}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // network hiccup — return null
    return null;
  }
  return null;
};

// Polls Hiro API until tx is confirmed, rejected, or timeout (default 2 min)
export async function waitForTx(
  txid: string,
  { intervalMs = 4000, timeoutMs = 120_000 } = {}
): Promise<"success" | "failed" | "timeout"> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const txStatus = await getTxStatus(txid);
    if (txStatus) {
      if (txStatus.tx_status === "success") return "success";
      if (txStatus.tx_status === "abort_by_response" || txStatus.tx_status === "abort_by_post_condition")
        return "failed";
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return "timeout";
}