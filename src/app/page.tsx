use client

import { useRef } from "react"
import { Navbar } from "@/components/fundx/Navbar"
import { Hero } from "@/components/fundx/hero/index"
import { LogoStrip } from "@/components/fundx/LogoStrip"
import { Footer } from "@/components/fundx/Footer"
import { CampaignFan } from "@/components/fundx/CampaignFan"

const getBackgroundStyles = () => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
  backgroundSize: '20px 20px',
  maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 70%, transparent 100%)',
  opacity: 0.6,
  pointerEvents: 'none'
})

export default function Home() {
  const deckSlotRef = useRef<HTMLDivElement | null>(null)

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-orange-100 font-sans">
      <Navbar />
      <Hero deckSlotRef={deckSlotRef} />

      {/* Campaign Section */}
      <section id="campaigns" className="relative py-32 bg-white overflow-visible border-t border-slate-100">

        {/* Background */}
        <div style={getBackgroundStyles()} />

        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          <CampaignFan deckSlotRef={deckSlotRef} />
        </div>
      </section>

      <LogoStrip />
      <Footer />
    </main>
  )
}