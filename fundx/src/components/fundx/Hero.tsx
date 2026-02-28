"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { TrustStrip } from "@/components/fundx/TrustStrips"

export function Hero() {
  const [isStacksMode, setIsStacksMode] = useState(false)

  // Auto toggle every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsStacksMode((prev) => !prev)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 transition-colors duration-700">
      <div className="container mx-auto max-w-5xl px-4 text-center">

        {/* Live Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-gradient-to-r from-orange-50/50 to-white px-4 py-1.5 text-sm font-medium text-orange-600 shadow-soft-xs mb-8 hover:scale-105 transition-transform cursor-default backdrop-blur-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-[#FF6B4A] to-[#FF3D71]"></span>
          </span>
          <span className="tracking-wide">Live on Stacks Testnet</span>
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-slate-900 leading-[1.1] mb-8">
          Raise in Dollars.
          <br />

          <span className="inline-flex items-center flex-wrap justify-center gap-x-4">
            Settle on

            {/* Icon Box */}
            <span className="inline-flex align-middle perspective-1000">
              <div
                className={`
                  w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-soft-md flex items-center justify-center border border-slate-100 relative z-10 transition-all duration-500 ease-out transform overflow-hidden
                  ${isStacksMode ? "rotate-6 bg-slate-900 text-white" : "-rotate-6 bg-white"}
                `}
              >
                {isStacksMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 18 18" fill="none" className="w-10 h-10 md:w-12 md:h-12">
                    <path fill="currentColor" d="M6.04,5.834l-.003.007c-.02.045-.066.075-.128.075H1.446l-.012.002c-.272.038-.484.266-.484.556v.948c0,.3.235.558.551.558h14.998c.302,0,.551-.244.551-.558v-.948c0-.3-.235-.558-.551-.558h-4.407c-.056,0-.102-.025-.133-.084l-.003-.005c-.026-.046-.023-.105.008-.149l.004-.005,2.884-4.359c.095-.157.123-.368.024-.559-.092-.195-.293-.306-.49-.306h-1.121c-.172,0-.36.086-.464.255l-3.343,5.094c-.057.08-.144.127-.238.127h-.423c-.1,0-.183-.044-.236-.124L5.197.71v-.002c-.11-.159-.283-.251-.462-.251h-1.121c-.197,0-.386.101-.487.292-.101.182-.085.398.023.568l.002.003,2.88,4.344c.037.057.037.12.012.163l-.004.007Z"></path>
                    <path fill="currentColor" d="M9.613,12.45l3.197,4.838c.104.169.292.255.464.255h1.121c.203,0,.388-.115.486-.289.101-.18.089-.407-.024-.574h0s-2.87-4.343-2.87-4.343c-.035-.054-.039-.11-.01-.166.035-.06.086-.087.134-.087h4.39c.302,0,.551-.244.551-.558v-.948c0-.3-.235-.558-.551-.558H1.501c-.302,0-.551.244-.551.558v.948c0,.3.235.558.551.558h4.398c.069,0,.107.028.128.075l.004.009c.031.059.025.112-.005.154l-.004.005-2.884,4.359c-.095.158-.123.371-.022.563.097.185.283.302.488.302h1.121c.187,0,.353-.09.454-.244l3.363-5.09c.053-.081.136-.125.236-.125h.423c.095,0,.182.048.239.129l.171.228h0Z"></path>
                  </svg>
                ) : (
                  <Image
                    src="/bitcoin-btc-logo.svg"
                    alt="Bitcoin Logo"
                    width={50}
                    height={50}
                    className="w-10 h-10 md:w-12 md:h-12 object-contain"
                  />
                )}
              </div>
            </span>

            <span
              className={`bg-clip-text text-transparent transition-all duration-700 ${
                isStacksMode
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                  : "bg-gradient-tush"
              }`}
            >
              {isStacksMode ? "Stacks" : "Bitcoin"}
            </span>
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
          Programmable USDCx escrow on Stacks. Funds are released only when campaign rules are met.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/create">
            <Button size="lg" className="h-16 px-10 rounded-full text-lg shadow-glow hover:scale-105 transition-all">
              Start a Campaign
            </Button>
          </Link>

          <Link href="/explore">
            <Button
              variant="outline"
              size="lg"
              className="h-16 px-10 rounded-full text-lg border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              Explore Campaigns
            </Button>
          </Link>
        </div>

        {/* Trust Strip */}
        <TrustStrip />

      </div>
    </section>
  )
}