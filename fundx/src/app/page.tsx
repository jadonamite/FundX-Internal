import Link from "next/link" // <--- Don't forget this import
import { Navbar } from "@/components/fundx/Navbar"
import { Hero } from "@/components/fundx/Hero"
import { LogoStrip } from "@/components/fundx/LogoStrip"
import { Footer } from "@/components/fundx/Footer"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 selection:bg-orange-100 font-sans">
      <Navbar />
      <Hero />

      {/* 3. The "Justified Tilted" Layout */}
      <section id="campaigns" className="relative py-32 bg-white overflow-hidden border-t border-slate-100">
        
        {/* Dot Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          
          <div className="mb-20 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Trending Campaigns
            </h2>
            <p className="text-lg text-slate-500">
              Support verified builders on Stacks. Trustless & Transparent.
            </p>
          </div>

          {/* THE GRID */}
          <div className="flex flex-col xl:flex-row justify-center items-center xl:items-stretch gap-6 h-auto xl:h-[420px]">
            
            {/* 1. LEFT CARD */}
            <div className="w-full xl:w-[300px] bg-white rounded-[2rem] shadow-soft-md border border-slate-100 overflow-hidden group hover:border-orange-200 transition-all duration-500 ease-out flex flex-col xl:transform xl:-rotate-6 xl:origin-bottom-right xl:translate-x-6 hover:z-30 hover:scale-105 hover:rotate-0 hover:translate-x-0">
               {/* Image Area */}
               <div className="relative h-48 xl:h-1/2 bg-slate-100 overflow-hidden shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm font-bold bg-slate-50 group-hover:scale-105 transition-transform duration-700">
                    [Image]
                  </div>
               </div>
               {/* Content Area */}
               <div className="p-6 flex flex-col justify-between flex-1 bg-white">
                  <div>
                     <h3 className="text-xl font-bold text-slate-900 mb-2">Stacks School</h3>
                     <p className="text-sm text-slate-500 line-clamp-3">Teaching Clarity smart contracts to 10,000 developers worldwide.</p>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                     <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-tush h-full w-[35%] rounded-full" />
                     </div>

                     <div className="flex justify-between items-center">
                        <div>
                           <span className="text-xs font-semibold text-slate-400 block">RAISED</span>
                           <span className="text-sm font-bold text-primary">$12,000</span>
                        </div>
                        {/* UPDATE: Wrapped in Link */}
                        <Link href="/campaigns/1">
                          <Button size="sm" className="h-10 rounded-xl bg-slate-900 text-white shadow-md hover:bg-primary hover:shadow-glow transition-all px-6">
                             Donate
                          </Button>
                        </Link>
                     </div>
                  </div>
               </div>
            </div>

            {/* 2. CENTER CARD */}
            <div className="w-full max-w-3xl xl:flex-1 relative z-20 shadow-2xl rounded-[2rem] border border-slate-100 bg-white hover:border-orange-200 transition-all duration-300 flex flex-col md:flex-row overflow-hidden">
               <div className="absolute top-4 left-4 z-30 bg-gradient-tush text-white px-4 py-1 rounded-full text-xs font-bold shadow-soft-xl animate-pulse">
                 🔥 Top Trending
               </div>
               
               <div className="relative h-64 md:h-full md:w-5/12 bg-slate-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold bg-slate-50">
                     [Hero Image]
                  </div>
               </div>
               
               <div className="flex flex-col justify-between p-8 md:w-7/12 h-full bg-white">
                 <div className="pt-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">DeFi for Everyone</h3>
                    <p className="text-slate-500 leading-relaxed mb-6 text-sm md:text-base">
                      The first mobile-first yield aggregator on Stacks. Democratizing finance for the 99% with simple UX and trustless strategies.
                    </p>
                 </div>
                 
                 <div className="space-y-6">
                   <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-tush h-full w-[90%] rounded-full shadow-[0_0_15px_rgba(255,107,74,0.4)]" />
                   </div>
                   
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Raised</p>
                         <p className="text-3xl font-bold text-primary">$45,000</p>
                      </div>
                      {/* UPDATE: Wrapped in Link */}
                      <Link href="/campaigns/1">
                        <Button className="h-12 rounded-xl px-8 bg-slate-900 text-white shadow-lg hover:bg-primary hover:shadow-glow transition-all duration-300">
                           Donate Now
                        </Button>
                      </Link>
                   </div>
                 </div>
               </div>
            </div>
            
            {/* 3. RIGHT CARD */}
            <div className="w-full xl:w-[300px] bg-white rounded-[2rem] shadow-soft-md border border-slate-100 overflow-hidden group hover:border-orange-200 transition-all duration-500 ease-out flex flex-col xl:transform xl:rotate-6 xl:origin-bottom-left xl:-translate-x-6 hover:z-30 hover:scale-105 hover:rotate-0 hover:translate-x-0">
               <div className="relative h-48 xl:h-1/2 bg-slate-100 overflow-hidden shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm font-bold bg-slate-50 group-hover:scale-105 transition-transform duration-700">
                    [Image]
                  </div>
               </div>
               <div className="p-6 flex flex-col justify-between flex-1 bg-white">
                  <div>
                     <h3 className="text-xl font-bold text-slate-900 mb-2">Green Mining</h3>
                     <p className="text-sm text-slate-500 line-clamp-3">Solar-powered Bitcoin mining initiative in Texas. Carbon neutral production.</p>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                     <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-tush h-full w-[60%] rounded-full" />
                     </div>

                     <div className="flex justify-between items-center">
                        <div>
                           <span className="text-xs font-semibold text-slate-400 block">RAISED</span>
                           <span className="text-sm font-bold text-primary">$5,000</span>
                        </div>
                        {/* UPDATE: Wrapped in Link */}
                        <Link href="/campaigns/1">
                          <Button size="sm" className="h-10 rounded-xl bg-slate-900 text-white shadow-md hover:bg-primary hover:shadow-glow transition-all px-6">
                             Donate
                          </Button>
                        </Link>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      <LogoStrip />
      <Footer />
    </main>
  )
}