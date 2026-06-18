use client
import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

const getSeparatorClassName = (orientation: string, className?: string) =>
  cn(
    "bg-border shrink-0",
    { "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full": orientation === "horizontal" },
    { "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px": orientation === "vertical" },
    className
  )

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={getSeparatorClassName(orientation, className)}
      {...props}
    />
  )
}

export { Separator }