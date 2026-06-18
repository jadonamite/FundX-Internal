"use client"
import { useTheme } from "next-themes"
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon, } from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const getIcon = (icon: React.ReactNode, className?: string) => (
  <>{icon}</>
)

const getIcons = () => ({
  success: getIcon(<CircleCheckIcon className="size-4" />),
  info: getIcon(<InfoIcon className="size-4" />),
  warning: getIcon(<TriangleAlertIcon className="size-4" />),
  error: getIcon(<OctagonXIcon className="size-4" />),
  loading: getIcon(<Loader2Icon className="size-4 animate-spin" />),
})

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={getIcons()}
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