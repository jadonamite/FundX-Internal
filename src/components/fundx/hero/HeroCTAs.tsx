use client
import Link from "next/link"
import { Button } from "@/components/ui/button"

const handleMouseEvents = (e, scale, borderColor = '', backgroundColor = '') => {
  e.currentTarget.style.transform = `scale(${scale})`;
  if (borderColor) e.currentTarget.style.borderColor = borderColor;
  if (backgroundColor) e.currentTarget.style.backgroundColor = backgroundColor;
}

export function HeroCTAs() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Link href="/create">
        <Button
          size="lg"
          className="h-16 px-10 rounded-full text-lg"
          style={{
            transition: "opacity 250ms ease, transform 250ms ease",
            boxShadow: "0 4px 20px 0 rgba(255,61,113,0.22)",
          }}
          onMouseEnter={(e) => handleMouseEvents(e, 1.025)}
          onMouseLeave={(e) => handleMouseEvents(e, 1)}
          onMouseDown={(e) => handleMouseEvents(e, 0.975)}
          onMouseUp={(e) => handleMouseEvents(e, 1.025)}
        >
          Start a Campaign
        </Button>
      </Link>
      <Link href="/explore">
        <Button
          variant="outline"
          size="lg"
          className="h-16 px-10 rounded-full text-lg border-2 border-slate-200 bg-white text-slate-700"
          style={{
            transition: "border-color 250ms ease, background-color 250ms ease, transform 250ms ease",
          }}
          onMouseEnter={(e) => handleMouseEvents(e, 1.025, '#cbd5e1', '#f8fafc')}
          onMouseLeave={(e) => handleMouseEvents(e, 1)}
          onMouseDown={(e) => handleMouseEvents(e, 0.975)}
          onMouseUp={(e) => handleMouseEvents(e, 1.025, '#cbd5e1', '#f8fafc')}
        >
          Explore Campaigns
        </Button>
      </Link>
    </div>
  )
}