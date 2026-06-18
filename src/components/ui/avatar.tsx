use client
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

const getAvatarClassName = (size: "default" | "sm" | "lg", className?: string) => {
  const baseClassName = "group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none"
  const sizeClassName = {
    default: "",
    sm: "data-[size=sm]:size-6",
    lg: "data-[size=lg]:size-10",
  }[size]
  return cn(baseClassName, sizeClassName, className)
}

const getAvatarImageClassName = (className?: string) => {
  return cn("aspect-square size-full", className)
}

const getAvatarFallbackClassName = (size: "default" | "sm" | "lg", className?: string) => {
  const baseClassName = "bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm"
  const sizeClassName = {
    default: "",
    sm: "group-data-[size=sm]/avatar:text-xs",
    lg: "",
  }[size]
  return cn(baseClassName, sizeClassName, className)
}

const getAvatarBadgeClassName = (size: "default" | "sm" | "lg", className?: string) => {
  const baseClassName = "bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full ring-2 select-none"
  const sizeClassName = {
    default: "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
    sm: "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
    lg: "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
  }[size]
  return cn(baseClassName, sizeClassName, className)
}

const getAvatarGroupClassName = (className?: string) => {
  return cn("*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2", className)
}

const getAvatarGroupCountClassName = (size: "default" | "sm" | "lg", className?: string) => {
  const baseClassName = "bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2"
  const sizeClassName = {
    default: "",
    sm: "group-has-data-[size=sm]/avatar-group:size-6",
    lg: "group-has-data-[size=lg]/avatar-group:size-10",
  }[size]
  const svgSizeClassName = {
    default: "",
    sm: "[&>svg]:size-3",
    lg: "[&>svg]:size-5",
  }[size]
  return cn(baseClassName, sizeClassName, svgSizeClassName, className)
}

function Avatar({ className, size = "default", ...props }: React.ComponentProps<typeof AvatarPrimitive.Root> & { size?: "default" | "sm" | "lg" }) {
  return (
    <AvatarPrimitive.Root data-slot="avatar" data-size={size} className={getAvatarClassName(size, className)} {...props} />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image data-slot="avatar-image" className={getAvatarImageClassName(className)} {...props} />
  )
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback data-slot="avatar-fallback" className={getAvatarFallbackClassName("default", className)} {...props} />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="avatar-badge" className={getAvatarBadgeClassName("default", className)} {...props} />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="avatar-group" className={getAvatarGroupClassName(className)} {...props} />
  )
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="avatar-group-count" className={getAvatarGroupCountClassName("default", className)} {...props} />
  )
}

export { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount }
