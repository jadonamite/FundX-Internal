use client
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "@/lib/utils"

const getLabelClassName = (className: string, disabled: boolean) => {
  return cn(
    "flex items-center gap-2 text-sm leading-none font-medium select-none",
    disabled ? "pointer-events-none opacity-50" : "",
    className
  )
}

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={getLabelClassName(className, props.disabled)}
      {...props}
    />
  )
}
export { Label }