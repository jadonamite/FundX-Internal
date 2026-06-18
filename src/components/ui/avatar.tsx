use client
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

const getSizeClasses = (size: "default" | "sm" | "lg", slot: string) => {
  switch (size) {
    case "sm":
      return `data-[size=sm]${slot === "avatar" ? ":size-6" : ""}`
    case "lg":
      return `data-[size=lg]${slot === "avatar" ? ":size-10" : ""}`
    default:
      return ``
  }
}

function Avatar({ className, size = "default", ...props }: React.ComponentProps<typeof AvatarPrimitive.Root> & { size?: "default" | "sm" | "lg" }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        `group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none ${getSizeClasses(size, "avatar")}`,
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
        `bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm ${getSizeClasses("sm", "avatar")}/avatar:text-xs`,
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
        `bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full ring-2 select-none ${getSizeClasses("sm", "avatar")}/avatar:size-2 ${getSizeClasses("default", "avatar")}/avatar:size-2.5 ${getSizeClasses("lg", "avatar")}/avatar:size-3`,
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
        `bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 ${getSizeClasses("lg", "avatar-group")}:size-10 ${getSizeClasses("sm", "avatar-group")}:size-6`,
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