"use client"

import { useState, useEffect, useRef } from "react"
import { HeroBadge } from "./HeroBadge"
import { HeroHeadline } from "./HeroHeadline"
import { HeroCTAs } from "./HeroCTAs"
import { HeroDeckSlot } from "./HeroDeckSlot"
import { useScramble } from "./useScramble"
import HeroLogoParallax from "./HeroBackdrop"


export { HeroDeckSlot }

export function Hero({ deckSlotRef }: { deckSlotRef: React.RefObject<HTMLDivElement | null> }) {
  const [isStacksMode, setIsStacksMode] = useState(false)
  const [displayStacks, setDisplayStacks] = useState(false)
  const [glitching, setGlitching] = useState(false)
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 })
  const [glitchOpacity, setGlitchOpacity] = useState(1)
  const [glitchSkew, setGlitchSkew] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isGlitchingRef = useRef(false)
  const isStacksModeRef = useRef(false)

  const { display: scrambledText, scrambleTo } = useScramble()

  const runGlitch = (targetIsStacks: boolean) => {
    if (isGlitchingRef.current) return
    isGlitchingRef.current = true
    setGlitching(true)
    scrambleTo(targetIsStacks ? "Stacks" : "Bitcoin")
    const flips = 9
    const baseDuration = 80
    let current = !targetIsStacks
    let count = 0
    const scheduleFlip = () => {
      if (count >= flips) {
        setDisplayStacks(targetIsStacks); setIsStacksMode(targetIsStacks); isStacksModeRef.current = targetIsStacks
        setGlitchOffset({ x: 0, y: 0 }); setGlitchOpacity(1); setGlitchSkew(0)
        setGlitching(false); isGlitchingRef.current = false; return
      }
      current = !current; setDisplayStacks(current)
      const intensity = count < flips - 2 ? 1 : 0.3
      setGlitchOffset({ x: (Math.random() - 0.5) * 14 * intensity, y: (Math.random() - 0.5) * 8 * intensity })
      setGlitchOpacity(count < flips - 2 ? 0.6 + Math.random() * 0.4 : 1)
      setGlitchSkew(count < flips - 2 ? (Math.random() - 0.5) * 12 * intensity : 0)
      count++
      setTimeout(scheduleFlip, baseDuration + Math.random() * 40 - 20)
    }
    scheduleFlip()
  }

  const handleManualToggle = () => {
    if (isGlitchingRef.current) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    runGlitch(!isStacksModeRef.current)
    intervalRef.current = setInterval(() => { if (!isGlitchingRef.current) runGlitch(!isStacksModeRef.current) }, 4500)
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => { if (!isGlitchingRef.current) runGlitch(!isStacksModeRef.current) }, 4500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  return (
 <section className="relative pt-28 pb-24 lg:pt-38 lg:pb-32 overflow-hidden bg-slate-50">

      {/* Background logo */}
        <HeroLogoParallax />

      <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center">
        <HeroBadge />
        <HeroHeadline
          displayStacks={displayStacks}
          glitching={glitching}
          glitchOffset={glitchOffset}
          glitchOpacity={glitchOpacity}
          glitchSkew={glitchSkew}
          isStacksMode={isStacksMode}
          scrambledText={scrambledText}
          onToggle={handleManualToggle}
        />
        <HeroDeckSlot slotRef={deckSlotRef} />
        <p className="text-xl text-slate-800 max-w-2xl mx-auto leading-relaxed mb-10">
          Programmable escrow. Stable capital. Conditions enforced on-chain — funds release only when your terms are met.
        </p>
        <HeroCTAs />
         </div>
    </section>
  )
}
