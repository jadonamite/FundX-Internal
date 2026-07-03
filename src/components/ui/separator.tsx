use client

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const getSeparatorClasses = (orientation: 'horizontal' | 'vertical') => {
  switch (orientation) {
    case 'horizontal':
      return 'h-px w-full'
    case 'vertical':
      return 'h-full w-px'
    default:
      return ''
  }
}

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        `bg-border shrink-0 data-[orientation=${orientation}]:${getSeparatorClasses(orientation)}`,
        className
      )}
      {...props}
    />
  )
}

export { Separator }