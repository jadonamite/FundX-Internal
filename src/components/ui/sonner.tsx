use client

import { useTheme } from "next-themes"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const getIcon = (icon: string) => {
  switch (icon) {
    case "success":
      return <CircleCheckIcon className="size-4" />
    case "info":
      return <InfoIcon className="size-4" />
    case "warning":
      return <TriangleAlertIcon className="size-4" />
    case "error":
      return <OctagonXIcon className="size-4" />
    case "loading":
      return <Loader2Icon className="size-4 animate-spin" />
    default:
      return null
  }
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: getIcon("success"),
        info: getIcon("info"),
        warning: getIcon("warning"),
        error: getIcon("error"),
        loading: getIcon("loading"),
      }}
      style={{
        "--normal-bg": "var(--popover)\