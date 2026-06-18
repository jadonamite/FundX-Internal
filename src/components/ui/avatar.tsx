use client
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

const getSizeClasses = (size: "default" | "sm" | "lg", slot: string) => {
  switch (size) {
    case "sm":
      return `size-6 ${slot === "avatar" ? "size-6" : "size-3"}`
    case "lg":
      return `size-10 ${slot === "avatar" ? "size-10" : "size-5"}`
    default:
      return `size-8 ${slot === "avatar" ? "size-8" : "size-4"}`
  }
}

function Avatar({ className, size = "default", ...props }: React.ComponentProps<typeof AvatarPrimitive.Root> & { size?: "default" | "sm" | "lg" }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        `group/avatar relative flex ${getSizeClasses(size, "avatar")} shrink-0 overflow-hidden rounded-full select-none`,
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        `bg-muted text-muted-foreground flex ${getSizeClasses("default", "avatar-fallback")} items-center justify-center rounded-full text-sm`,
        className
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        `bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full ring-2 select-none`,
        `group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden`,
        `group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2`,
        `group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2`,
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        `bg-muted text-muted-foreground ring-background relative flex ${getSizeClasses("default", "avatar-group-count")} items-center justify-center rounded-full text-sm ring-2`,
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
}