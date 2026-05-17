"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }


// ⟳ echo · src/components/fundx/hero/ChainToggleSwitch.tsx
//       <button onClick={onToggle} aria-label="Toggle between Bitcoin and Stacks" className="relative inline-flex items-center cursor-pointer focus:outline-none" style={{ WebkitTapHighlightColor: "transparent" }}>
//         <div style={{ transition: "background 700ms ease", background: isStacksMode ? "#0f172a" : "linear-gradient(to right, #FF6B4A, #FF3D71)" }} className="w-24 h-12 rounded-full p-1">