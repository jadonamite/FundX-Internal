"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.transform = "scale(1.025)"
}

const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.transform = "scale(1)"
}

const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.transform = "scale(0.975)"
}

const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.transform = "scale(1.025)"
}

const handleOutlineMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.transform = "scale(1.025)"
  e.currentTarget.style.borderColor = "#cbd5e1"
  e.currentTarget.style.backgroundColor = "#f8fafc"
}

const handleOutlineMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.transform = "scale(1)"
  e.currentTarget.style.borderColor = ""
  e.currentTarget.style.backgroundColor = ""
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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
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
          onMouseEnter={handleOutlineMouseEnter}
          onMouseLeave={handleOutlineMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          Explore Campaigns
        </Button>
      </Link>
    </div>
  )
}