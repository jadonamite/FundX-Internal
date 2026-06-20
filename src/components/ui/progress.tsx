use client
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const getIndicatorStyle = (value: number) => ({
  transform: `translateX(-${100 - (value || 0)}%)`,
})

function Progress({ className, value, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-gradient-tush/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-gradient-tush h-full w-full flex-1 transition-all"
        style={getIndicatorStyle(value)}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }