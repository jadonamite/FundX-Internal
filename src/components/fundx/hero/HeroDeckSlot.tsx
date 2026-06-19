import React from "react"

/**
 * HeroDeckSlot
 * @param {*} { slotRef }: { slotRef: React.RefObject<HTMLDivElement | null> }
 * @returns {*}
 */
export function HeroDeckSlot({ slotRef }: { slotRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={slotRef}
      className="w-full flex justify-center items-center my-6"
      style={{ height: "6rem", pointerEvents: "none" }}
      aria-hidden="true"
    />
  )
}
