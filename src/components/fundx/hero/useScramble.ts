import { useState, useEffect, useRef } from "react"

const SCRAMBLE_CHARS = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ∑∆∇Ωλ∞"

  const scrambleTo = (word: string) => {
    if (frameRef.current) clearTimeout(frameRef.current)
    let lockedCount = 0
    const totalSteps = word.length

    const tick = () => {
      if (lockedCount >= totalSteps) { setDisplay(word); return }
      setDisplay(word.split("").map((char, i) => i < lockedCount ? char : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]).join(""))
      if (lockedCount < totalSteps) lockedCount++
      frameRef.current = setTimeout(tick, 80)
    }
    tick()
  }

export function useScramble() {
  const [display, setDisplay] = useState("Bitcoin")
  const frameRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => { if (frameRef.current) clearTimeout(frameRef.current) }
  }, [])

  return { display, scrambleTo }
}
