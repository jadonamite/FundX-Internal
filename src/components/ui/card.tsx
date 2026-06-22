import * as React from "react";
import { cn } from "@/lib/utils";

const cardBaseClasses = "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm";
const cardHeaderBaseClasses = "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6";
const cardTitleBaseClasses = "leading-none font-semibold";
const cardDescriptionBaseClasses = "text-muted-foreground text-sm";
const cardActionBaseClasses = "col-start-2 row-span-2 row-start-1 self-start justify-self-end";
const cardContentBaseClasses = "px-6";
const cardFooterBaseClasses = "flex items-center px-6 [.border-t]:pt-6";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card" className={cn(cardBaseClasses, className)} {...props} />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-header" className={cn(cardHeaderBaseClasses, className)} {...props} />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-title" className={cn(cardTitleBaseClasses, className)} {...props} />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-description" className={cn(cardDescriptionBaseClasses, className)} {...props} />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-action" className={cn(cardActionBaseClasses, className)} {...props} />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn(cardContentBaseClasses, className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-footer" className={cn(cardFooterBaseClasses, className)} {...props} />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};