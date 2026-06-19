import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const getDisabledClassName = (props: React.ComponentProps<typeof LabelPrimitive.Root>) => {
  return props['data-disabled'] || props['data-state'] === 'disabled' ? 'pointer-events-none opacity-50' : '';
}

const getPeerDisabledClassName = (props: React.ComponentProps<typeof LabelPrimitive.Root>) => {
  return props['data-peer-disabled'] ? 'cursor-not-allowed opacity-50' : '';
}

const getLabelClassName = (
  className: string,
  props: React.ComponentProps<typeof LabelPrimitive.Root>
) => {
  return cn(
    'flex items-center gap-2 text-sm leading-none font-medium select-none',
    getDisabledClassName(props),
    getPeerDisabledClassName(props),
    className
  );
}

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={getLabelClassName(className, props)}
      {...props}
    />
  );
}

export { Label };