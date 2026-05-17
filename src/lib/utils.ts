import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// ⟳ echo · src/components/fundx/StacksProvider.tsx
//   btcAddress?: string
// }
// interface StacksContextValue {
//   walletData: WalletData | null