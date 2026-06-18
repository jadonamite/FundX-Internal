import * as React from "react"; 
import { cn } from "@/lib/utils"; 

const generateClassName = (baseClassName: string, className?: string) => { 
  return cn(baseClassName, className); 
}; 

function Card({ className, ...props }: React.ComponentProps<"div">) { 
  const classNames = generateClassName("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className); 
  return ( 
    <div data-slot="card" className={classNames} {...props} /> 
  ); 
} 

function CardHeader({ className, ...props }: React.ComponentProps<"div">) { 
  const classNames = generateClassName("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className); 
  return ( 
    <div data-slot="card-header" className={classNames} {...props} /> 
  ); 
} 

function CardTitle({ className, ...props }: React.ComponentProps<"div">) { 
  const classNames = generateClassName("leading-none font-semibold", className); 
  return ( 
    <div data-slot="card-title" className={classNames} {...props} /> 
  ); 
} 

function CardDescription({ className, ...props }: React.ComponentProps<"div">) { 
  const classNames = generateClassName("text-muted-foreground text-sm", className); 
  return ( 
    <div data-slot="card-description" className={classNames} {...props} /> 
  ); 
} 

function CardAction({ className, ...props }: React.ComponentProps<"div">) { 
  const classNames = generateClassName("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className); 
  return ( 
    <div data-slot="card-action" className={classNames} {...props} /> 
  ); 
} 

function CardContent({ className, ...props }: React.ComponentProps<"div">) { 
  const classNames = generateClassName("px-6", className); 
  return ( 
    <div data-slot="card-content" className={classNames} {...props} /> 
  ); 
} 

function CardFooter({ className, ...props }: React.ComponentProps<"div">) { 
  const classNames = generateClassName("flex items-center px-6 [.border-t]:pt-6", className); 
  return ( 
    <div data-slot="card-footer" className={classNames} {...props} /> 
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