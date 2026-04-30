"use client"
import Image from "next/image"

export function ChainToggleIcon({
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
}) {
  const glitchStyle = {
    backgroundColor: displayStacks ? "#0f172a" : "#ffffff",
    color: displayStacks ? "#ffffff" : "#0f172a",
    boxShadow: displayStacks ? "0 4px 24px 0 rgba(0,0,0,0.18)" : "0 4px 24px 0 rgba(0,0,0,0.07)",
    opacity: glitchOpacity,
    ...(glitching
      ? { transform: `translate(${glitchOffset.x}px, ${glitchOffset.y}px) skewX(${glitchSkew}deg) rotate(${displayStacks ? "6deg" : "-6deg"})`, transition: "none" }
      : { transform: `translate(0px, 0px) skewX(0deg) rotate(${isStacksMode ? "6deg" : "-6deg"})`, transition: "transform 700ms cubic-bezier(0.4,0,0.2,1), background-color 600ms ease, box-shadow 600ms ease, opacity 300ms ease" }),
    willChange: "transform, opacity",
  }

  return (
    <span className="inline-flex align-middle">
      <div style={glitchStyle} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border border-slate-100 relative overflow-hidden">
        <span style={{ position: "absolute", opacity: !displayStacks ? 1 : 0, transition: glitching ? "none" : "opacity 300ms ease" }}>
          <Image src="/bitcoin-btc-logo.svg" alt="Bitcoin" width={50} height={50} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
        </span>
        <span style={{ position: "absolute", opacity: displayStacks ? 1 : 0, transition: glitching ? "none" : "opacity 300ms ease" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 18 18" fill="none" className="w-10 h-10 md:w-12 md:h-12">
            <path fill="currentColor" d="M6.04,5.834l-.003.007c-.02.045-.066.075-.128.075H1.446l-.012.002c-.272.038-.484.266-.484.556v.948c0,.3.235.558.551.558h14.998c.302,0,.551-.244.551-.558v-.948c0-.3-.235-.558-.551-.558h-4.407c-.056,0-.102-.025-.133-.084l-.003-.005c-.026-.046-.023-.105.008-.149l.004-.005,2.884-4.359c.095-.157.123-.368.024-.559-.092-.195-.293-.306-.49-.306h-1.121c-.172,0-.36.086-.464.255l-3.343,5.094c-.057.08-.144.127-.238.127h-.423c-.1,0-.183-.044-.236-.124L5.197.71v-.002c-.11-.159-.283-.251-.462-.251h-1.121c-.197,0-.386.101-.487.292-.101.182-.085.398.023.568l.002.003,2.88,4.344c.037.057.037.12.012.163l-.004.007Z" />
            <path fill="currentColor" d="M9.613,12.45l3.197,4.838c.104.169.292.255.464.255h1.121c.203,0,.388-.115.486-.289.101-.18.089-.407-.024-.574h0s-2.87-4.343-2.87-4.343c-.035-.054-.039-.11-.01-.166.035-.06.086-.087.134-.087h4.39c.302,0,.551-.244.551-.558v-.948c0-.3-.235-.558-.551-.558H1.501c-.302,0,.551.244-.551.558v.948c0,.3.235.558.551.558h4.398c.069,0,.107.028.128.075l.004.009c.031.059.025.112-.005.154l-.004.005-2.884,4.359c-.095.158-.123.371-.022.563.097.185.283.302.488.302h1.121c.187,0,.353-.09.454-.244l3.363-5.09c.053-.081.136-.125.236-.125h.423c.095,0,.182.048.239.129l.171.228h0Z" />
          </svg>
        </span>
      </div>
    </span>
  )
}
