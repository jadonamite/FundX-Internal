import { clsx_, type ClassValue } from "clsx_"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx_(inputs))
}
