"use client"
import { useEffect, useRef } from "react"

const BITCOIN_COLORS = {
  stream: "#FF6B4A",
  streamAlt: "#FF3D71",
  block: "#FF6B4A",
  glow: "rgba(255,107,74,0.25)",
}
const STACKS_COLORS = {
  stream: "#9333ea",
  streamAlt: "#6366f1",
  block: "#9333ea",
  glow: "rgba(147,51,234,0.25)",
}

interface Stream {
  x: number
  y: number
  length: number
  speed: number
  opacity: number
  width: number
  units: { offset: number; size: number }[]
}

interface Block {
  x: number
  y: number
  size: number
  opacity: number
  life: number
  maxLife: number
  pulsePhase: number
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export function HeroBackground({ isStacksMode }: { isStacksMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isStacksModeRef = useRef(isStacksMode)
  const rafRef = useRef<number>(0)
  const targetOpacityRef = useRef(isStacksMode ? 1 : 0)
  const currentOpacityRef = useRef(isStacksMode ? 1 : 0)

  useEffect(() => {
    isStacksModeRef.current = isStacksMode
  }, [isStacksMode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = canvas.offsetWidth
    let height = canvas.offsetHeight
    canvas.width = width
    canvas.height = height

    const streams: Stream[] = []
    const blocks: Block[] = []

    function createStream(startY?: number): Stream {
      return {
        x: Math.random() * width,
        y: startY ?? -50,
        length: 100 + Math.random() * 150,
        speed: 0.5 + Math.random() * 0.7,
        opacity: 0.18 + Math.random() * 0.18,
        width: 1 + Math.random() * 1.5,
        units: Array.from({ length: 5 + Math.floor(Math.random() * 4) }, () => ({
          offset: Math.random(),
          size: 2.5 + Math.random() * 3,
        })),
      }
    }

    function createBlock(x: number, y: number): Block {
      return {
        x,
        y,
        size: 20 + Math.random() * 28,
        opacity: 0,
        life: 0,
        maxLife: 180 + Math.random() * 120,
        pulsePhase: Math.random() * Math.PI * 2,
      }
    }

    // Seed initial streams spread across the canvas
    for (let i = 0; i < 14; i++) {
      const s = createStream(Math.random() * height)
      streams.push(s)
    }

    let frame = 0

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, width, height)

      const isStacks = isStacksModeRef.current
      const colors = isStacks ? STACKS_COLORS : BITCOIN_COLORS

      // Smooth color transition via opacity blend
      targetOpacityRef.current = isStacks ? 1 : 0
      currentOpacityRef.current += (targetOpacityRef.current - currentOpacityRef.current) * 0.03

      const stacksAlpha = currentOpacityRef.current
      const bitcoinAlpha = 1 - stacksAlpha

      // Spawn new streams
      if (frame % 45 === 0 && streams.length < 18) {
        streams.push(createStream())
      }

      // Draw and update streams
      for (let i = streams.length - 1; i >= 0; i--) {
        const s = streams[i]
        s.y += s.speed

        // Draw stream using blended color
        const drawStream = (color: string, alpha: number) => {
          if (alpha < 0.01) return
          const grad = ctx.createLinearGradient(s.x, s.y - s.length, s.x, s.y)
          grad.addColorStop(0, "transparent")
          grad.addColorStop(0.3, hexToRgba(color, s.opacity * alpha))
          grad.addColorStop(0.7, hexToRgba(color, s.opacity * alpha * 0.8))
          grad.addColorStop(1, "transparent")
          ctx.beginPath()
          ctx.moveTo(s.x, s.y - s.length)
          ctx.lineTo(s.x, s.y)
          ctx.strokeStyle = grad
          ctx.lineWidth = s.width
          ctx.stroke()

          // Value units
          s.units.forEach(u => {
            const uy = s.y - s.length * u.offset
            ctx.beginPath()
            ctx.arc(s.x, uy, u.size / 2, 0, Math.PI * 2)
            ctx.fillStyle = hexToRgba(color, s.opacity * alpha * 1.4)
            ctx.fill()
          })
        }

        drawStream(BITCOIN_COLORS.stream, bitcoinAlpha)
        drawStream(STACKS_COLORS.stream, stacksAlpha)

        // Occasionally spawn block at convergence zone
        if (s.y > height * 0.4 && s.y < height * 0.85 && Math.random() < 0.004) {
          if (blocks.length < 12) {
            blocks.push(createBlock(s.x, s.y - s.length * 0.4))
          }
        }

        if (s.y > height + 80) streams.splice(i, 1)
      }

      // Draw blocks — they pulse in place, don't move
      for (let i = blocks.length - 1; i >= 0; i--) {
        const b = blocks[i]
        b.life++
        b.pulsePhase += 0.04

        const progress = b.life / b.maxLife
        const baseOpacity = progress < 0.15
          ? (progress / 0.15) * 0.22
          : progress > 0.75
            ? ((1 - progress) / 0.25) * 0.22
            : 0.22

        // Pulse effect
        const pulse = Math.sin(b.pulsePhase) * 0.06
        b.opacity = baseOpacity + pulse

        const drawBlock = (color: string, alpha: number) => {
          if (alpha < 0.01) return

          // Glow
          ctx.shadowBlur = 16
          ctx.shadowColor = hexToRgba(color, b.opacity * alpha * 0.8)

          // Block border
          ctx.beginPath()
          ctx.roundRect(b.x - b.size / 2, b.y - b.size / 2, b.size, b.size, 5)
          ctx.strokeStyle = hexToRgba(color, b.opacity * alpha)
          ctx.lineWidth = 1.2
          ctx.stroke()

          // Block fill — very subtle
          ctx.beginPath()
          ctx.roundRect(b.x - b.size / 2, b.y - b.size / 2, b.size, b.size, 5)
          ctx.fillStyle = hexToRgba(color, b.opacity * alpha * 0.15)
          ctx.fill()

          ctx.shadowBlur = 0
        }

        drawBlock(BITCOIN_COLORS.block, bitcoinAlpha)
        drawBlock(STACKS_COLORS.block, stacksAlpha)

        // Chain lines between nearby blocks
        for (let j = i - 1; j >= 0; j--) {
          const other = blocks[j]
          const dist = Math.hypot(b.x - other.x, b.y - other.y)
          if (dist < 150) {
            const lineAlpha = (1 - dist / 150) * 0.12

            const drawLine = (color: string, alpha: number) => {
              if (alpha < 0.01) return
              ctx.beginPath()
              ctx.moveTo(b.x, b.y)
              ctx.lineTo(other.x, other.y)
              ctx.strokeStyle = hexToRgba(color, lineAlpha * alpha)
              ctx.lineWidth = 0.8
              ctx.stroke()
            }

            drawLine(BITCOIN_COLORS.block, bitcoinAlpha)
            drawLine(STACKS_COLORS.block, stacksAlpha)
          }
        }

        if (b.life >= b.maxLife) blocks.splice(i, 1)
      }

      frame++
      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    function onResize() {
      if (!canvas) return
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener("resize", onResize)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      {/* Gradient fade at bottom — blends hero into campaign section */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "160px",
          background: "linear-gradient(to bottom, transparent, #f8fafc)",
        }}
      />
    </>
  )
}