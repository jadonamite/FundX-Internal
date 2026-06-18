import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { HIRO_API } from "./stacks-config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to check transaction status
const getTxStatus = async (txid: string): Promise<"success" | "failed" | null> => {
  try {
    const res = await fetch(`${HIRO_API}/extended/v1/tx/${txid}`);
    if (res.ok) {
      const data = await res.json();
      if (data.tx_status === "success") return "success";
      if (data.tx_status === "abort_by_response" || data.tx_status === "abort_by_post_condition") return "failed";
    }
  } catch {
    // network hiccup — return null to continue polling
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
    const status = await getTxStatus(txid);
    if (status === "success") return "success";
    if (status === "failed") return "failed";
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return "timeout";
}