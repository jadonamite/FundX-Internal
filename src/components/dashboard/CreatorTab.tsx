import { Clock, XCircle, CheckCircle2, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"

export function CreatorTab() {
  return (
    <TabsContent value="campaigns" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       
       {/* 1. SUCCESSFUL CAMPAIGN */}
       <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300">
          
        
          <CheckCircle2 
             strokeWidth={1} 
             className="absolute -right-16 -bottom-16 w-80 h-80 text-green-500 opacity-5 z-0 pointer-events-none" 
          />
          
          <div className="absolute top-0 left-0 w-2 h-full bg-green-500 z-10" />
          
          <div className="flex-1 space-y-2 w-full pl-2 relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-lg bg-green-50 border border-green-100/50 text-green-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                   <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Successful
                </span>
                <span className="text-slate-400 text-sm font-semibold">Flexible Model</span>
             </div>
             <h3 className="text-2xl font-bold text-slate-900 tracking-tight">DeFi Yield Aggregator</h3>
             <div className="flex items-center gap-4 text-sm mt-4">
                <div className="font-semibold text-slate-700 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]">
                   Raised: <span className="text-green-600 font-extrabold">$55,000 USDCx</span>
                </div>
                <div className="text-slate-500 font-medium">Goal: $50,000</div>
             </div>
          </div>
          
          <div className="w-full md:w-auto shrink-0 relative z-10">
             <Button className="w-full md:w-auto h-14 px-8 rounded-xl bg-gradient-to-b from-green-300 to-green-400 border border-green-500 text-green-950 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_15px_rgba(134,239,172,0.5)] font-bold text-base transition-all hover:scale-[1.02] active:scale-95 active:shadow-inner">
                Withdraw Funds
             </Button>
          </div>
       </div>

       {/* 2. ACTIVE CAMPAIGN */}
       <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300">
          
        
          <Rocket 
             strokeWidth={1} 
             className="absolute -right-12 -bottom-16 w-80 h-80 text-orange-500 opacity-[0.04] z-0 pointer-events-none transform -rotate-12" 
          />

          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-tush z-10" />
          
          <div className="flex-1 space-y-2 w-full pl-2 relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-lg bg-orange-50 border border-orange-100/50 text-orange-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                   <Clock className="w-3.5 h-3.5" /> Active
                </span>
                <span className="text-slate-400 text-sm font-semibold">All-or-Nothing</span>
             </div>
             <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Stacks Dev Bootcamp</h3>
             
             <div className="flex items-center gap-4 text-sm mt-4">
                <div className="font-semibold text-slate-700 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]">
                   Raised: <span className="text-orange-600 font-extrabold">4,500 STX</span>
                </div>
                <div className="text-slate-500 font-medium">Goal: 10,000 STX</div>
             </div>
             
             <div className="w-full max-w-md bg-slate-100 rounded-full h-3 mt-5 overflow-hidden shadow-[inset_0_2px_5px_rgba(0,0,0,0.1)] border border-slate-200/50 p-0.5 relative z-10">
                <div 
                   className="bg-gradient-to-r from-[#FF6B4A] to-[#FF3D71] h-full rounded-full shadow-[0_0_12px_rgba(255,107,74,0.8)] relative" 
                   style={{ width: "45%" }} 
                >
                   <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-full" />
                </div>
             </div>
          </div>

          <div className="w-full md:w-auto shrink-0 text-left md:text-right px-4 relative z-10">
             <div className="text-3xl font-black text-slate-900 tracking-tight drop-shadow-sm">12 Days</div>
             <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">Remaining</div>
          </div>
       </div>

       {/* 3. FAILED CAMPAIGN */}
       <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-[inset_0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden opacity-80 grayscale-[0.5] hover:grayscale-0 transition-all duration-500">
          
         
          <XCircle 
             strokeWidth={1} 
             className="absolute -right-16 -bottom-16 w-80 h-80 text-slate-500 opacity-5 z-0 pointer-events-none" 
          />

          <div className="absolute top-0 left-0 w-2 h-full bg-slate-300 z-10" />
          
          <div className="flex-1 space-y-2 w-full pl-2 relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-lg bg-white border border-red-100 text-red-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                   <XCircle className="w-3.5 h-3.5 text-red-500" /> Failed
                </span>
                <span className="text-slate-400 text-sm font-semibold">All-or-Nothing</span>
             </div>
             <h3 className="text-2xl font-bold text-slate-500 line-through decoration-slate-300 decoration-2 tracking-tight">NFT Marketplace</h3>
             <div className="flex items-center gap-4 text-sm mt-4">
                <div className="font-semibold text-slate-500 bg-white/50 px-4 py-2 rounded-xl border border-slate-200/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]">
                   Raised: 1,200 STX
                </div>
                <div className="text-slate-500 font-medium">Goal: 50,000 STX</div>
             </div>
          </div>
          
          <div className="w-full md:w-auto shrink-0 relative z-10">
             <Button variant="outline" disabled className="w-full md:w-auto h-14 px-8 rounded-xl bg-slate-100 border-slate-200 text-slate-400 font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] cursor-not-allowed">
                Goal Not Met
             </Button>
          </div>
       </div>

    </TabsContent>
  )
}