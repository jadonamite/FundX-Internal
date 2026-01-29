import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
      <div className="container mx-auto max-w-5xl px-4 text-center">
        
        {/* 1. The Rebranded "Live" Badge (Pulsing Dot) */}
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-gradient-to-r from-orange-50/50 to-white px-4 py-1.5 text-sm font-medium text-orange-600 shadow-soft-xs mb-8 hover:scale-105 transition-transform cursor-default backdrop-blur-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-[#FF6B4A] to-[#FF3D71]"></span>
          </span>
          <span className="tracking-wide">Live on Stacks Testnet</span>
        </div>

        {/* 2. Headline */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-slate-900 leading-[1.1] mb-8">
          Crowdfunding <br />
          
          {/* Line 2: "for the [Icon] Bitcoin" */}
          <span className="inline-flex items-center flex-wrap justify-center gap-x-4">
            for the
            
            <span className="inline-flex align-middle">
               <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-soft-md -rotate-6 flex items-center justify-center text-3xl border border-slate-100 relative z-10 hover:rotate-0 transition-transform duration-300">
                  ⚡
               </div>
            </span>
            
            <span className="text-gradient-tush">
              Bitcoin
            </span>
          </span>
          
          <br />

          {/* Line 3: "[Icon] Economy [Switch]" */}
          {/* FIX: The Switch is now INSIDE this flex container so it stays aligned */}
          <span className="inline-flex items-center flex-wrap justify-center gap-x-4 gap-y-2">
             <span className="inline-flex align-middle">
               <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-soft-md rotate-12 flex items-center justify-center text-3xl border border-slate-100 relative z-10 hover:rotate-0 transition-transform duration-300">
                  💰
               </div>
            </span>
            <span>Economy.</span>
            
            {/* The Switch (Aligned & Rebranded) */}
            <span className="inline-flex align-middle ml-2">
              <div className="relative inline-flex items-center cursor-pointer group">
                {/* Updated to use your new Orange/Pink Gradient */}
                <div className="w-24 h-12 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#FF3D71] p-1 shadow-inner transition-all hover:scale-105">
                  <div className="w-10 h-10 bg-white rounded-full shadow-lg translate-x-12 transition-transform duration-300 ease-out" />
                </div>
              </div>
            </span>
            
          </span>
        </h1>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
          Fund the next big thing using USDCx. Bring your own liquidity from Ethereum—we handle the bridge instantly.
        </p>

        {/* 4. Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="h-16 px-10 rounded-full text-lg shadow-glow hover:scale-105 transition-all">
              Explore Campaigns
            </Button>
            
            <Button variant="outline" size="lg" className="h-16 px-10 rounded-full text-lg border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all">
              Bridge to USDCx
            </Button>
        </div>

      </div>
    </section>
  )
}