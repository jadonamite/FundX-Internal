import * as React from "react"

import { cn } from "@/lib/utils"

const getCardClassName = (className?: string) => cn(
  "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
  className
)

const getCardHeaderClassName = (className?: string) => cn(
  "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
  className
)

const getCardTitleClassName = (className?: string) => cn(
  "leading-none font-semibold",
  className
)

const getCardDescriptionClassName = (className?: string) => cn(
  "text-muted-foreground text-sm",
  className
)

const getCardActionClassName = (className?: string) => cn(
  "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
  className
)

const getCardContentClassName = (className?: string) => cn(
  "px-6",
  className
)

const getCardFooterClassName = (className?: string) => cn(
  "flex items-center px-6 [.border-t]:pt-6",
  className
)

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={getCardClassName(className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={getCardHeaderClassName(className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={getCardTitleClassName(className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={getCardDescriptionClassName(className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={getCardActionClassName(className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={getCardContentClassName(className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={getCardFooterClassName(className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}