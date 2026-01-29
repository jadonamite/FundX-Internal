import { Navbar } from "@/components/fundx/Navbar"
import { Hero } from "@/components/fundx/Hero"
import { CampaignCard } from "@/components/fundx/CampaignCard"
import { LogoStrip } from "@/components/fundx/LogoStrip"
import { Footer } from "@/components/fundx/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 selection:bg-orange-100 font-sans">
      <Navbar />
      <Hero />

      {/* 3. The "Big Fan" Layout */}
      <section id="campaigns" className="relative py-40 bg-white overflow-hidden border-t border-slate-100">
        
        {/* Dot Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

        <div className="container relative z-10 mx-auto max-w-6xl px-4">
          
          <div className="mb-32 text-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Trending Campaigns
            </h2>
            <p className="text-lg text-slate-500">
              Support verified builders on Stacks. Trustless & Transparent.
            </p>
          </div>

          {/* THE FAN */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-0 relative">
            
            {/* 1. LEFT CARD (Smaller, Tilted) */}
            <div className="w-full max-w-[320px] transition-all duration-700 ease-out md:transform md:-rotate-12 md:translate-y-16 md:translate-x-12 hover:z-30 hover:scale-105 hover:rotate-0 origin-bottom-right opacity-90 hover:opacity-100">
              <CampaignCard 
                title="Stacks School"
                description="Teaching Clarity to 10k devs."
                raised={12000}
                goal={100000}
                image="/campaign-2.jpg"
              />
            </div>

            {/* 2. CENTER CARD (MASSIVE HERO) */}
            {/* scale-125 makes it 25% larger than the others */}
            <div className="w-full max-w-[400px] relative z-20 md:transform md:scale-125 md:-translate-y-4 shadow-2xl rounded-[2rem] border-2 border-orange-100 bg-white">
               {/* Badge */}
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 bg-gradient-tush text-white px-6 py-2 rounded-full text-base font-bold shadow-soft-xl animate-pulse">
                 🔥 Top Trending
               </div>
               
               {/* We render the card manually here to allow custom image height if needed, 
                   or just use the component if it's flexible enough. Using component for consistency. */}
               <CampaignCard 
                title="DeFi for Everyone"
                description="The first mobile-first yield aggregator on Stacks. Democratizing finance."
                raised={45000}
                goal={50000}
                image="/campaign-1.jpg"
              />
            </div>
            
            {/* 3. RIGHT CARD (Smaller, Tilted) */}
            <div className="w-full max-w-[320px] transition-all duration-700 ease-out md:transform md:rotate-12 md:translate-y-16 md:-translate-x-12 hover:z-30 hover:scale-105 hover:rotate-0 origin-bottom-left opacity-90 hover:opacity-100">
               <CampaignCard 
                title="Green Mining"
                description="Solar-powered Bitcoin mining."
                raised={5000}
                goal={25000}
                image="/campaign-3.jpg"
              />
            </div>

          </div>
        </div>
      </section>

      <LogoStrip />
      <Footer />
    </main>
  )
}