use client
import Image from "next/image"

const getGlitchStyle = ({
  displayStacks,
  glitching,
  glitchOffset,
  glitchOpacity,
  glitchSkew,
  isStacksMode,
}: {
  displayStacks: boolean
  glitching: boolean
  glitchOffset: { x: number; y: number }
  glitchOpacity: number
  glitchSkew: number
  isStacksMode: boolean
}) => {
  const baseStyle = {
    backgroundColor: displayStacks ? "#0f172a" : "#ffffff",
    color: displayStacks ? "#ffffff" : "#0f172a",
    boxShadow: displayStacks ? "0 4px 24px 0 rgba(0,0,0,0.18)" : "0 4px 24px 0 rgba(0,0,0,0.07)\