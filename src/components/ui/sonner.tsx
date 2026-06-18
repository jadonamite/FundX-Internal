use client
import { useTheme } from "next-themes"
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon, } from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const getIcon = (icon: React.ReactNode, className: string = "size-4") => (
  <>{icon}</>
)

const getIcons = () => ({
  success: getIcon(<CircleCheckIcon />),
  info: getIcon(<InfoIcon />),
  warning: getIcon(<TriangleAlertIcon />),
  error: getIcon(<OctagonXIcon />),
  loading: getIcon(<Loader2Icon className="animate-spin" />),
})

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const icons = getIcons()
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
      }} as React.CSSProperties
      {...props}
    />
  )
}
export { Toaster }