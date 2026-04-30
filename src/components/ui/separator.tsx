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
      data_-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data_-[orientation=horizontal]:h-px data_-[orientation=horizontal]:w-full data_-[orientation=vertical]:h-full data_-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
