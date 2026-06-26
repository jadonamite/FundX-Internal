"use client"
import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

const getSeparatorClassName = (orientation: 'horizontal' | 'vertical', className?: string) => {
  const baseClassName = orientation === 'horizontal'
    ? "h-px w-full"
    : "h-full w-px"
  return cn("bg-border shrink-0", `data-[orientation=${orientation}]:${baseClassName}`, className)
}

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