import * as React from "react";
import { cn } from "@/lib/utils";

const getCardClass = (slot: string, className?: string) => {
  const baseClass = {
    card: "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
    'card-header': "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
    'card-title': "leading-none font-semibold",
    'card-description': "text-muted-foreground text-sm",
    'card-action': "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
    'card-content': "px-6",
    'card-footer': "flex items-center px-6 [.border-t]:pt-6",
  }[slot];
  return cn(baseClass, className);
};

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card" className={getCardClass('card', className)} {...props} />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-header" className={getCardClass('card-header', className)} {...props} />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-title" className={getCardClass('card-title', className)} {...props} />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-description" className={getCardClass('card-description', className)} {...props} />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-action" className={getCardClass('card-action', className)} {...props} />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={getCardClass('card-content', className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-footer" className={getCardClass('card-footer', className)} {...props} />
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