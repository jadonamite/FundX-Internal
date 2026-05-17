import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// ⟳ echo · src/components/dashboard/BackerTab.tsx
//                 <span className="text-slate-400 text-sm font-semibold">{contribution.model}</span>
//              </div>
//              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{contribution.title}</h3>
//              <div className="flex items-center gap-4 text-sm mt-4">
//                 <div className="font-semibold text-slate-700 bg-slate-50 px-5 py-2.5 rounded-xl border border-slate-200/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] text-base">