"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      payload-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 payload-[orientation=horizontal]:h-px payload-[orientation=horizontal]:w-full payload-[orientation=vertical]:h-full payload-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
