use client
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

const getAvatarClasses = (size: "default" | "sm" | "lg", className?: string) => {
  const baseClasses = "group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none"
  const sizeClasses = {
    lg: "size-10",
    sm: "size-6",
    default: ""
  }
  return cn(baseClasses, sizeClasses[size], className)
}

const getAvatarImageClasses = (className?: string) => {
  return cn("aspect-square size-full", className)
}

const getAvatarFallbackClasses = (size: "default" | "sm" | "lg", className?: string) => {
  const baseClasses = "bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm"
  const sizeClasses = {
    sm: "text-xs",
    default: "",
    lg: ""
  }
  return cn(baseClasses, sizeClasses[size], className)
}

const getAvatarBadgeClasses = (size: "default" | "sm" | "lg", className?: string) => {
  const baseClasses = "bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full ring-2 select-none"
  const sizeClasses = {
    sm: "size-2",
    default: "size-2.5",
    lg: "size-3"
  }
  return cn(baseClasses, sizeClasses[size], className)
}

function Avatar({ className, size = "default", ...props }: React.ComponentProps<typeof AvatarPrimitive.Root> & { size?: "default" | "sm" | "lg" }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={getAvatarClasses(size, className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={getAvatarImageClasses(className)}
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={getAvatarFallbackClasses("default", className)}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={getAvatarBadgeClasses("default", className)}
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
        "bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2",
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
  AvatarGroupCount
}