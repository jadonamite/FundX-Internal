"use client"
import { useTheme } from "next-themes"
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon, } from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const createIcon = (Icon: any, className?: string) => {
  return <Icon className={`size-4 ${className}`} />
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: createIcon(CircleCheckIcon),
        info: createIcon(InfoIcon),
        warning: createIcon(TriangleAlertIcon),
        error: createIcon(OctagonXIcon),
        loading: createIcon(Loader2Icon, "animate-spin"),
      }}
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)",
      } as React.CSSProperties}
      {...props}
    />
  )
}

export { Toaster }