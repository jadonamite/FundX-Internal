use client
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

const getAvatarClassName = (size: "default" | "sm" | "lg", className?: string) => {
  return cn(
    "group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none",
    { "data-[size=lg]": size === "lg", "data-[size=sm]": size === "sm" },
    className
  )
}

const getAvatarImageClassName = (className?: string) => {
  return cn("aspect-square size-full", className)
}

const getAvatarFallbackClassName = (size: "default" | "sm" | "lg", className?: string) => {
  return cn(
    "bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm",
    { "group-data-[size=sm]/avatar:text-xs": size === "sm" },
    className
  )
}

const getAvatarBadgeClassName = (size: "default" | "sm" | "lg", className?: string) => {
  return cn(
    "bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full ring-2 select-none",
    { "group-data-[size=sm]/avatar:size-2": size === "sm" },
    { "group-data-[size=default]/avatar:size-2.5": size === "default" },
    { "group-data-[size=lg]/avatar:size-3": size === "lg" },
    className
  )
}

const getAvatarGroupClassName = (className?: string) => {
  return cn(
    "*:data-[slot=avatar]:ring-background group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2",
    className
  )
}

const getAvatarGroupCountClassName = (size: "default" | "sm" | "lg", className?: string) => {
  return cn(
    "bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2",
    { "group-has-data-[size=lg]/avatar-group:size-10": size === "lg" },
    { "group-has-data-[size=sm]/avatar-group:size-6": size === "sm" },
    className
  )
}

function Avatar({ className, size = "default", ...props }: React.ComponentProps<typeof AvatarPrimitive.Root> & { size?: "default" | "sm" | "lg" }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={getAvatarClassName(size, className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={getAvatarImageClassName(className)}
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={getAvatarFallbackClassName("default", className)}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={getAvatarBadgeClassName("default", className)}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={getAvatarGroupClassName(className)}
      {...props}
    />
  )
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={getAvatarGroupCountClassName("default", className)}
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