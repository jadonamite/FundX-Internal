import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link" // <--- Import

interface CampaignCardProps {
  title: string
  description: string
  raised: number
  goal: number
  image: string
}

export function CampaignCard({ title, description, raised, goal, image }: CampaignCardProps) {
  const percentage = Math.min((raised / goal) * 100, 100)

  return (
    // Wrap the Card in a Link so the whole thing is clickable
    <Link href="/campaigns/1" className="block h-full group">
      <Card className="relative h-full overflow-hidden rounded-3xl border-none bg-white p-6 shadow-soft-md transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-xl">
        {/* Image Area */}
        <div className="relative mb-6 h-48 w-full overflow-hidden rounded-2xl bg-slate-100">
           <div className="absolute inset-0 flex items-center justify-center text-slate-300">
              [Campaign Image]
           </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mt-2">{description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-primary font-bold">${raised.toLocaleString()} USDC</span>
              <span className="text-slate-400">of ${goal.toLocaleString()}</span>
            </div>
            <Progress value={percentage} className="h-3 rounded-full bg-slate-100" />
          </div>

          <Button className="w-full rounded-xl bg-gradient-tush py-6 text-base font-semibold shadow-glow hover:bg-indigo-700 transition-all">
            Donate Now
          </Button>
        </div>
      </Card>
    </Link>
  )
}