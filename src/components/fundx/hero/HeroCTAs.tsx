use client
import Link from "next/link"
import { Button } from "@/components/ui/button"

const handleMouseEvents = (e, isOutline = false) => {
  if (isOutline) {
    e.currentTarget.style.transform = e.type === "mouseenter" ? "scale(1.025)" : e.type === "mouseleave" ? "scale(1)" : e.type === "mousedown" ? "scale(0.975)" : "scale(1.025)"
    if (e.type === "mouseenter") {
      e.currentTarget.style.borderColor = "#cbd5e1"
      e.currentTarget.style.backgroundColor = "#f8fafc"
    } else if (e.type === "mouseleave") {
      e.currentTarget.style.borderColor = ""
      e.currentTarget.style.backgroundColor = ""
    }
  } else {
    e.currentTarget.style.transform = e.type === "mouseenter" || e.type === "mouseup" ? "scale(1.025)" : "scale(0.975)"
  }
}

export function HeroCTAs() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Link href="/create">
        <Button size="lg" className="h-16 px-10 rounded-full text-lg" style={{ transition: "opacity 250ms ease, transform 250ms ease", boxShadow: "0 4px 20px 0 rgba(255,61,113,0.22)" }} onMouseEnter={e => handleMouseEvents(e)} onMouseLeave={e => handleMouseEvents(e)} onMouseDown={e => handleMouseEvents(e)} onMouseUp={e => handleMouseEvents(e)}>
          Start a Campaign
        </Button>
      </Link>
      <Link href="/explore">
        <Button variant="outline" size="lg" className="h-16 px-10 rounded-full text-lg border-2 border-slate-200 bg-white text-slate-700" style={{ transition: "border-color 250ms ease, background-color 250ms ease, transform 250ms ease" }} onMouseEnter={e => handleMouseEvents(e, true)} onMouseLeave={e => handleMouseEvents(e, true)} onMouseDown={e => handleMouseEvents(e, true)} onMouseUp={e => handleMouseEvents(e, true)}>
          Explore Campaigns
        </Button>
      </Link>
    </div>
  )
}