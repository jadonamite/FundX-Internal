import React from "react"

const HERO_DECK_SLOT_STYLES = {
  className: "w-full flex justify-center items-center my-6",
  style: {
    height: "6rem",
    pointerEvents: "none"
  }
}

export function HeroDeckSlot({ slotRef }: { slotRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={slotRef} {...HERO_DECK_SLOT_STYLES} aria-hidden="true" />
  )
}