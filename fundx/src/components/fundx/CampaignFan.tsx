import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Campaign, getHeroCampaign, getSideCampaigns } from "@/lib/data"

export function CampaignFan() {
  const hero = getHeroCampaign();
  const sideCampaigns = getSideCampaigns();
  const leftCard = sideCampaigns[0];
  const rightCard = sideCampaigns[1];

  // Helper for progress calculation
  const getProgress = (raised: number, goal: number) => Math.min((raised/goal)*100, 100);

  return (
    <div className="flex flex-col xl:flex-row justify-center items-center xl:items-stretch gap-6 h-auto xl:h-[420px]">
      
      {/* 1. LEFT CARD (Component-ized inline for modularity) */}
      <SideCard campaign={leftCard} tilt="left" progress={getProgress(leftCard.raised, leftCard.goal)} />

      {/* 2. HERO CARD (Center) */}
      <div className="w-full max-w-3xl xl:flex-1 relative z-20 shadow-2xl rounded-[2rem] border border-slate-100 bg-white hover:border-orange-200 transition-all duration-300 flex flex-col md:flex-row overflow-hidden group">
          <div className="absolute top-4 left-4 z-30 bg-gradient-tush text-white px-4 py-1 rounded-full text-xs font-bold shadow-soft-xl animate-pulse">
            🔥 Top Trending
          </div>
          
          <div className="relative h-64 md:h-full md:w-5/12 bg-slate-100 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold bg-slate-50 group-hover:bg-slate-100 transition-colors">
                [Image]
            </div>
          </div>
          
          <div className="flex flex-col justify-between p-8 md:w-7/12 h-full bg-white">
            <div className="pt-4">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-primary transition-colors">{hero.title}</h3>
              <p className="text-slate-500 leading-relaxed mb-6 text-sm md:text-base">
                {hero.description}
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                    className="bg-gradient-tush h-full rounded-full shadow-[0_0_15px_rgba(255,107,74,0.4)]" 
                    style={{ width: `${getProgress(hero.raised, hero.goal)}%` }}
                />
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Raised</p>
                    <p className="text-3xl font-bold text-primary">${hero.raised.toLocaleString()}</p>
                </div>
                <Link href={`/campaigns/${hero.id}`}>
                  <Button className="h-12 rounded-xl px-8 bg-slate-900 text-white shadow-lg hover:bg-primary hover:shadow-glow transition-all duration-300">
                      Donate Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
      </div>
      
      {/* 3. RIGHT CARD */}
      <SideCard campaign={rightCard} tilt="right" progress={getProgress(rightCard.raised, rightCard.goal)} />

    </div>
  )
}

// Sub-component for the side cards to keep code DRY
function SideCard({ campaign, tilt, progress }: { campaign: Campaign, tilt: "left" | "right", progress: number }) {
  const tiltClass = tilt === "left" 
    ? "xl:transform xl:-rotate-6 xl:origin-bottom-right xl:translate-x-6 hover:translate-x-0" 
    : "xl:transform xl:rotate-6 xl:origin-bottom-left xl:-translate-x-6 hover:translate-x-0";

  return (
    <div className={`w-full xl:w-[300px] bg-white rounded-[2rem] shadow-soft-md border border-slate-100 overflow-hidden group hover:border-orange-200 transition-all duration-500 ease-out flex flex-col hover:z-30 hover:scale-105 hover:rotate-0 ${tiltClass}`}>
        <div className="relative h-48 xl:h-1/2 bg-slate-100 overflow-hidden shrink-0">
          <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm font-bold bg-slate-50 group-hover:scale-105 transition-transform duration-700">
            [Image]
          </div>
        </div>
        <div className="p-6 flex flex-col justify-between flex-1 bg-white">
          <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{campaign.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{campaign.description}</p>
          </div>
          
          <div className="space-y-3 pt-4">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                    className="bg-gradient-tush h-full rounded-full" 
                    style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                    <span className="text-xs font-semibold text-slate-400 block">RAISED</span>
                    <span className="text-sm font-bold text-primary">${campaign.raised.toLocaleString()}</span>
                </div>
                <Link href={`/campaigns/${campaign.id}`}>
                  <Button size="sm" className="h-10 rounded-xl bg-slate-900 text-white shadow-md hover:bg-primary hover:shadow-glow transition-all px-6">
                      Donate
                  </Button>
                </Link>
              </div>
          </div>
        </div>
    </div>
  )
}