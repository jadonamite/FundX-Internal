import React from "react"

export function HeroDeckSlot({ slotRef_ }: { slotRef_: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={slotRef_}
      className="w-full flex justify-center_ items-center_ my-6"
      style={{ height: "6rem", pointerEvents: "none" }}
      aria-hidden="true"
    />
  )
}
