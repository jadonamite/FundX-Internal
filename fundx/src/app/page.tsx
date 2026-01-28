import { Navbar } from "@/components/fundx/Navbar"
import { Hero } from "@/components/fundx/Hero"
import { CampaignCard } from "@/components/fundx/CampaignCard"
import { Footer } from "@/components/fundx/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 selection:bg-indigo-100 font-sans">
      {/* 1. The Floating Navigation */}
      <Navbar />

      {/* 2. The New "Big Text" Hero (Matches your reference image) */}
      <Hero />

      {/* 3. The "Meat" of the App: Campaign Grid */}
      {/* We use a white background here to separate it from the Hero's light grey */}
      <section id="campaigns" className="py-32 bg-white relative z-10">
        <div className="container mx-auto max-w-6xl px-4">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
                Trending Campaigns
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                Support verified builders on Stacks. All donations are held in trustless Clarity smart contracts until goals are met.
              </p>
            </div>
            {/* Optional 'View All' link could go here */}
          </div>

          {/* The Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Campaign 1 */}
            <CampaignCard 
              title="DeFi for Everyone"
              description="Building the first mobile-first yield aggregator on Stacks. Democratizing finance for the 99%."
              raised={45000}
              goal={50000}
              image="/campaign-1.jpg"
            />
            
            {/* Campaign 2 */}
            <CampaignCard 
              title="Stacks School"
              description="An educational platform to teach Clarity smart contract development to 10,000 developers worldwide."
              raised={12000}
              goal={100000}
              image="/campaign-2.jpg"
            />
            
            {/* Campaign 3 */}
            <CampaignCard 
              title="Green Bitcoin Mining"
              description="Solar-powered mining initiative in Texas. Carbon neutral Bitcoin production."
              raised={5000}
              goal={25000}
              image="/campaign-3.jpg"
            />
          </div>

        </div>
      </section>

      {/* 4. The Clean Footer */}
      <Footer />
    </main>
  )
}