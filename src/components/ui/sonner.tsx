use client
import { useTheme } from "next-themes"
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon, } from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const createIcon = (icon: React.ReactNode, className?: string) => (
  <>{icon}</>
)

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const icons = {
    success: createIcon(<CircleCheckIcon className="size-4" />),
    info: createIcon(<InfoIcon className="size-4" />),
    warning: createIcon(<TriangleAlertIcon className="size-4" />),
    error: createIcon(<OctagonXIcon className="size-4" />),
    loading: createIcon(<Loader2Icon className="size-4 animate-spin" />),
  }

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={icons}
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