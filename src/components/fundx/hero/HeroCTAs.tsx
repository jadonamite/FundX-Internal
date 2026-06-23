use client
import Link from "next/link"
import { Button } from "@/components/ui/button"

const handleMouseEvents = (e, isOutline = false) => {
  if (isOutline) {
    switch (e.type) {
      case "mouseenter":
        e.currentTarget.style.transform = "scale(1.025)"
        e.currentTarget.style.borderColor = "#cbd5e1"
        e.currentTarget.style.backgroundColor = "#f8fafc"
        break
      case "mouseleave":
        e.currentTarget.style.transform = "scale(1)"
        e.currentTarget.style.borderColor = ""
        e.currentTarget.style.backgroundColor = ""
        break
      case "mousedown":
        e.currentTarget.style.transform = "scale(0.975)"
        break
      case "mouseup":
        e.currentTarget.style.transform = "scale(1.025)"
        break
      default:
        break
    }
  } else {
    switch (e.type) {
      case "mouseenter":
      case "mouseup":
        e.currentTarget.style.transform = "scale(1.025)"
        break
      case "mouseleave":
        e.currentTarget.style.transform = "scale(1)"
        break
      case "mousedown":
        e.currentTarget.style.transform = "scale(0.975)"
        break
      default:
        break
    }
  }
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
          onMouseEnter={(e) => handleMouseEvents(e)}
          onMouseLeave={(e) => handleMouseEvents(e)}
          onMouseDown={(e) => handleMouseEvents(e)}
          onMouseUp={(e) => handleMouseEvents(e)}
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
          onMouseEnter={(e) => handleMouseEvents(e, true)}
          onMouseLeave={(e) => handleMouseEvents(e, true)}
          onMouseDown={(e) => handleMouseEvents(e, true)}
          onMouseUp={(e) => handleMouseEvents(e, true)}
        >
          Explore Campaigns
        </Button>
      </Link>
    </div>
  )
}