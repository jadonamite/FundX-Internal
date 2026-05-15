"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroCTAs() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Link href="/create">
        <Button size="lg" className="h-16 px-10 rounded-full text-lg" style={{ transition: "opacity 250ms ease, transform 250ms ease", boxShadow: "0 4px 20px 0 rgba(255,61,113,0.22)" }} onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.025)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} onMouseDown={e => (e.currentTarget.style.transform = "scale(0.975)")} onMouseUp={e => (e.currentTarget.style.transform = "scale(1.025)")}>
          Start a Campaign
        </Button>
      </Link>
      <Link href="/explore">
        <Button variant="outline" size="lg" className="h-16 px-10 rounded-full text-lg border-2 border-slate-200 bg-white text-slate-700" style={{ transition: "border-color 250ms ease, background-color 250ms ease, transform 250ms ease" }} onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.025)"; e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.backgroundColor = "#f8fafc" }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = ""; e.currentTarget.style.backgroundColor = "" }} onMouseDown={e => (e.currentTarget.style.transform = "scale(0.975)")} onMouseUp={e => (e.currentTarget.style.transform = "scale(1.025)")}>
          Explore Campaigns
        </Button>
      </Link>
    </div>
  )
}


// ⟳ echo · src/components/fundx/CampaignCard.tsx
//       <Card className="relative h-full overflow-hidden rounded-3xl border-none bg-white p-6 shadow-soft-md transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-xl">
//         <div className="relative mb-6 h-48 w-full overflow-hidden rounded-2xl bg-slate-100">
//           <Image
//             src={image}
//             alt={title}