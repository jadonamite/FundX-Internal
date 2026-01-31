"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  // False = Bitcoin Mode, True = Stacks Mode
  const [isStacksMode, setIsStacksMode] = useState(false)

  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 transition-colors duration-700">
      <div className="container mx-auto max-w-5xl px-4 text-center">
        
        {/* 1. The Rebranded "Live" Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-gradient-to-r from-orange-50/50 to-white px-4 py-1.5 text-sm font-medium text-orange-600 shadow-soft-xs mb-8 hover:scale-105 transition-transform cursor-default backdrop-blur-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-[#FF6B4A] to-[#FF3D71]"></span>
          </span>
          <span className="tracking-wide">Live on Stacks Testnet</span>
        </div>

        {/* 2. Headline */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-slate-900 leading-[1.1] mb-8">
          Crowdfunding <br />
          
          <span className="inline-flex items-center flex-wrap justify-center gap-x-4">
            for the
            
            {/* DYNAMIC ICON BOX */}
            <span className="inline-flex align-middle perspective-1000">
               <div 
                 className={`
                   w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-soft-md flex items-center justify-center border border-slate-100 relative z-10 transition-all duration-500 ease-out transform
                   ${isStacksMode ? 'rotate-6 bg-slate-900 text-white' : '-rotate-6 bg-white text-[#F7931A]'}
                 `}
               >
                  {isStacksMode ? (
                    /* STACKS LOGO (Your SVG) */
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 18 18" fill="none" className="w-10 h-10 md:w-12 md:h-12">
                      <path fill="currentColor" d="M6.04,5.834l-.003.007c-.02.045-.066.075-.128.075H1.446l-.012.002c-.272.038-.484.266-.484.556v.948c0,.3.235.558.551.558h14.998c.302,0,.551-.244.551-.558v-.948c0-.3-.235-.558-.551-.558h-4.407c-.056,0-.102-.025-.133-.084l-.003-.005c-.026-.046-.023-.105.008-.149l.004-.005,2.884-4.359c.095-.157.123-.368.024-.559-.092-.195-.293-.306-.49-.306h-1.121c-.172,0-.36.086-.464.255l-3.343,5.094c-.057.08-.144.127-.238.127h-.423c-.1,0-.183-.044-.236-.124L5.197.71v-.002c-.11-.159-.283-.251-.462-.251h-1.121c-.197,0-.386.101-.487.292-.101.182-.085.398.023.568l.002.003,2.88,4.344c.037.057.037.12.012.163l-.004.007Z"></path>
                      <path fill="currentColor" d="M9.613,12.45l3.197,4.838c.104.169.292.255.464.255h1.121c.203,0,.388-.115.486-.289.101-.18.089-.407-.024-.574h0s-2.87-4.343-2.87-4.343c-.035-.054-.039-.11-.01-.166.035-.06.086-.087.134-.087h4.39c.302,0,.551-.244.551-.558v-.948c0-.3-.235-.558-.551-.558H1.501c-.302,0-.551.244-.551.558v.948c0,.3.235.558.551.558h4.398c.069,0,.107.028.128.075l.004.009c.031.059.025.112-.005.154l-.004.005-2.884,4.359c-.095.158-.123.371-.022.563.097.185.283.302.488.302h1.121c.187,0,.353-.09.454-.244l3.363-5.09c.053-.081.136-.125.236-.125h.423c.095,0,.182.048.239.129l.171.228h0Z"></path>
                    </svg>
                  ) : (
                    /* BITCOIN LOGO (Standard) */
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 md:w-12 md:h-12">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.46 15.5h-1.5v-1.1h-1.6v1.1H8.8v-1.1H7.5v-1.9h1.3v-5.4H7.5V7.1h1.3V6h1.6v1.1h1.6V6h1.5v1.1h.4c1.8 0 2.8.9 2.8 2.5 0 1.6-1.1 2.4-2 2.6 1.1.2 2.3 1.1 2.3 2.9 0 1.9-1.2 2.9-3.3 2.9h-.46v-2.5zm-1.5-7.5h1.2c.9 0 1.4-.6 1.4-1.4 0-.9-.5-1.4-1.4-1.4h-1.2v2.8zm0 4.5h1.3c1.1 0 1.6-.6 1.6-1.6 0-.9-.6-1.5-1.6-1.5h-1.3v3.1z"/>
                    </svg>
                  )}
               </div>
            </span>
            
            {/* DYNAMIC TEXT */}
            <span className={`bg-clip-text text-transparent transition-all duration-700 ${isStacksMode ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-tush'}`}>
              {isStacksMode ? "Stacks" : "Bitcoin"}
            </span>
          </span>
          
          <br />

          <span className="inline-flex items-center flex-wrap justify-center gap-x-4 gap-y-2">
            
            <span>Economy.</span>
            
            {/* THE TOGGLE SWITCH */}
            <span className="inline-flex align-middle ml-2">
              <div 
                onClick={() => setIsStacksMode(!isStacksMode)}
                className="relative inline-flex items-center cursor-pointer group"
              >
                <div 
                  className={`
                    w-24 h-12 rounded-full p-1 shadow-inner transition-all duration-500 hover:scale-105 
                    ${isStacksMode ? 'bg-slate-900' : 'bg-gradient-to-r from-[#FF6B4A] to-[#FF3D71]'}
                  `}
                >
                  <div 
                    className={`
                      w-10 h-10 bg-white rounded-full shadow-lg transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                      ${isStacksMode ? 'translate-x-12' : 'translate-x-0'}
                    `} 
                  />
                </div>
              </div>
            </span>
            
          </span>
        </h1>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
          Fund the next big thing using USDCx. Bring your own liquidity from Ethereum—we handle the bridge instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* LINKED: Explore Campaigns */}
            <Link href="/explore">
              <Button size="lg" className="h-16 px-10 rounded-full text-lg shadow-glow hover:scale-105 transition-all">
                Explore Campaigns
              </Button>
            </Link>
            
            {/* RESTORED: Bridge to USDCx */}
            <Button variant="outline" size="lg" className="h-16 px-10 rounded-full text-lg border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all">
              Bridge to USDCx
            </Button>
        </div>

      </div>
    </section>
  )
}