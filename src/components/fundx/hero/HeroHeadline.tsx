"use client"
import { ChainToggleIcon } from "./ChainToggleIcon"
import { ChainToggleSwitch } from "./ChainToggleSwitch"

export function HeroHeadline({
  displayStacks, glitching, glitchOffset, glitchOpacity, glitchSkew, isStacksMode, scrambledText, onToggle,
}: {
  displayStacks: boolean; glitching: boolean; glitchOffset: { x: number; y: number }; glitchOpacity: number; glitchSkew: number; isStacksMode: boolean; scrambledText: string; onToggle: () => void
}) {
  return (
    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-slate-900 leading-[1.1] mb-8">
      Capital Formation
      <br />
      <span className="inline-flex items-center flex-wrap justify-center gap-x-4">
        on the
        <ChainToggleIcon displayStacks={displayStacks} glitching={glitching} glitchOffset={glitchOffset} glitchOpacity={glitchOpacity} glitchSkew={glitchSkew} isStacksMode={isStacksMode} />
        <span style={{ display: "inline-block", minWidth: "240px", fontVariantLigatures: "none" }} className={`bg-clip-text text-transparent bg-gradient-to-r ${displayStacks ? "from-purple-600 to-indigo-600" : "from-[#FF6B4A] to-[#FF3D71]"}`}>
          {scrambledText}
        </span>
      </span>
      <br />
      <span className="inline-flex items-center flex-wrap justify-center gap-x-4 gap-y-2">
        <span>Economy.</span>
        <ChainToggleSwitch isStacksMode={isStacksMode} onToggle={onToggle} />
      </span>
    </h1>
  )
}
