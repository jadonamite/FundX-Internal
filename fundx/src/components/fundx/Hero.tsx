import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
      <div className="container mx-auto max-w-5xl px-4 text-center">
        
        {/* 1. The Badge - Now Orange/Primary */}
        <div className="inline-flex items-center rounded-full border border-orange-100 bg-white px-4 py-1.5 text-sm font-medium text-primary shadow-sm mb-8 hover:scale-105 transition-transform cursor-default">
          🚀 Live on Stacks Testnet
        </div>

        {/* 2. Headline */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-slate-900 leading-[1.1] mb-8">
          Crowdfunding <br />
          
          <span className="inline-flex items-center flex-wrap justify-center gap-x-4">
            for the
            
            <span className="inline-flex align-middle">
               <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-soft-md -rotate-6 flex items-center justify-center text-3xl border border-slate-100 relative z-10 hover:rotate-0 transition-transform duration-300">
                  ⚡
               </div>
            </span>
            
            {/* 3. THE REBRAND: Using the new "Tush" Gradient */}
            <span className="text-gradient-tush">
              Bitcoin
            </span>
          </span>
          
          <br />

          <span className="inline-flex items-center flex-wrap justify-center gap-x-4">
             <span className="inline-flex align-middle">
               <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-soft-md rotate-12 flex items-center justify-center text-3xl border border-slate-100 relative z-10 hover:rotate-0 transition-transform duration-300">
                  💰
               </div>
            </span>
            Economy.
          </span>
        </h1>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
          Fund the next big thing using USDCx. Bring your own liquidity from Ethereum—we handle the bridge instantly.
        </p>

        {/* 4. Buttons - Using standard 'default' variant which now maps to Orange */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* The primary button will now automatically be Orange because we changed globals.css */}
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