"use client"

import { useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Campaign, getHeroCampaign, getSideCampaigns } from "@/lib/data"
import { motion, useInView, useAnimation } from "framer-motion"
import { useEffect } from "react"
import { ArrowRight, Heart } from "lucide-react"

export function CampaignFan() {
  const hero = getHeroCampaign()
  const sideCampaigns = getSideCampaigns()
  const leftCard = sideCampaigns[0]
  const rightCard = sideCampaigns[1]

  const getProgress = (raised: number, goal: number) =>
    Math.min((raised / goal) * 100, 100)

  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const leftControls = useAnimation()
  const centerControls = useAnimation()
  const rightControls = useAnimation()

  useEffect(() => {
    if (isInView) {
      // Stagger the deal: center first, then sides
      centerControls.start({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        zIndex: 20,
        transition: {
          type: "spring",
          stiffness: 80,
          damping: 18,
          delay: 0.05,
        },
      })
      leftControls.start({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        zIndex: 10,
        transition: {
          type: "spring",
          stiffness: 70,
          damping: 18,
          delay: 0.18,
        },
      })
      rightControls.start({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        zIndex: 10,
        transition: {
          type: "spring",
          stiffness: 70,
          damping: 18,
          delay: 0.28,
        },
      })
    }
  }, [isInView, leftControls, centerControls, rightControls])

  // Stacked starting state
  const stackedLeft = {
    x: 0,
    y: 0,
    rotate: -6,
    scale: 0.92,
    opacity: 0.7,
    zIndex: 10,
  }
  const stackedCenter = {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    zIndex: 20,
  }
  const stackedRight = {
    x: 0,
    y: 0,
    rotate: 6,
    scale: 0.92,
    opacity: 0.7,
    zIndex: 10,
  }

  return (
    <div ref={containerRef} className="relative w-full">

      {/* MOBILE: normal vertical stack, no deal animation */}
      <div className="flex xl:hidden flex-col gap-6">
        <MobileCard campaign={leftCard} progress={getProgress(leftCard.raised, leftCard.goal)} />
        <HeroCardInner campaign={hero} progress={getProgress(hero.raised, hero.goal)} />
        <MobileCard campaign={rightCard} progress={getProgress(rightCard.raised, rightCard.goal)} />
      </div>

      {/* DESKTOP: deal animation */}
      <div className="hidden xl:flex justify-center items-center h-[460px] relative">

        {/* LEFT CARD */}
        <motion.div
          initial={stackedLeft}
          animate={leftControls}
          className="absolute w-[300px] h-[420px] origin-bottom"
          style={{ left: "calc(50% - 490px)" }}
        >
          <SideCard
            campaign={leftCard}
            progress={getProgress(leftCard.raised, leftCard.goal)}
          />
        </motion.div>

        {/* CENTER CARD */}
        <motion.div
          initial={stackedCenter}
          animate={centerControls}
          className="absolute w-[560px] h-[420px]"
          style={{ left: "calc(50% - 280px)" }}
        >
          <HeroCard campaign={hero} progress={getProgress(hero.raised, hero.goal)} />
        </motion.div>

        {/* RIGHT CARD */}
        <motion.div
          initial={stackedRight}
          animate={rightControls}
          className="absolute w-[300px] h-[420px] origin-bottom"
          style={{ left: "calc(50% + 190px)" }}
        >
          <SideCard
            campaign={rightCard}
            progress={getProgress(rightCard.raised, rightCard.goal)}
          />
        </motion.div>
      </div>
    </div>
  )
}

// ─── Hero (Center) Card ────────────────────────────────────────────────────

function HeroCard({
  campaign,
  progress,
}: {
  campaign: Campaign
  progress: number
}) {
  return (
    <div className="w-full h-full relative z-20 shadow-2xl rounded-[2rem] border border-slate-100 bg-white hover:border-orange-200 transition-all duration-300 flex flex-col md:flex-row overflow-hidden group">
      <div className="absolute top-4 left-4 z-30 bg-gradient-tush text-white px-4 py-1 rounded-full text-xs font-bold shadow-soft-xl animate-pulse">
        🔥 Top Trending
      </div>

      <div className="relative h-64 md:h-full md:w-5/12 bg-slate-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold bg-slate-50 group-hover:bg-slate-100 transition-colors">
          [Image]
        </div>
      </div>

      <div className="flex flex-col justify-between p-8 md:w-7/12 h-full bg-white">
        <div className="pt-4">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-primary transition-colors">
            {campaign.title}
          </h3>
          <p className="text-slate-500 leading-relaxed mb-6 text-sm md:text-base">
            {campaign.description}
          </p>
        </div>

        <div className="space-y-6">
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-tush h-full rounded-full shadow-[0_0_15px_rgba(255,107,74,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold mb-1">
                Raised
              </p>
              <p className="text-3xl font-bold text-primary">
                ${campaign.raised.toLocaleString()}
              </p>
            </div>
            <Link href={`/campaigns/${campaign.id}`}>
              <Button className="h-12 rounded-xl px-8 bg-slate-900 text-white shadow-lg hover:bg-primary hover:shadow-glow transition-all duration-300 flex items-center gap-2 group/btn">
                Donate Now
                <Heart className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-125 group-hover/btn:fill-white" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroCardInner({
  campaign,
  progress,
}: {
  campaign: Campaign
  progress: number
}) {
  return <HeroCard campaign={campaign} progress={progress} />
}

// ─── Side Card ─────────────────────────────────────────────────────────────

function SideCard({
  campaign,
  progress,
}: {
  campaign: Campaign
  progress: number
}) {
  return (
    <div className="w-full h-full bg-white rounded-[2rem] shadow-soft-md border border-slate-100 overflow-hidden group hover:border-orange-200 transition-all duration-500 ease-out flex flex-col hover:scale-[1.03]">
      <div className="relative h-48 xl:h-1/2 bg-slate-100 overflow-hidden shrink-0">
        <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm font-bold bg-slate-50 group-hover:scale-105 transition-transform duration-700">
          [Image]
        </div>
      </div>

      <div className="p-6 flex flex-col justify-between flex-1 bg-white">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
            {campaign.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2">
            {campaign.description}
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-tush h-full rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-semibold text-slate-400 block">
                RAISED
              </span>
              <span className="text-sm font-bold text-primary">
                ${campaign.raised.toLocaleString()}
              </span>
            </div>
            <Link href={`/campaigns/${campaign.id}`}>
              <Button
                size="sm"
                className="h-10 rounded-xl bg-slate-900 text-white shadow-md hover:bg-primary hover:shadow-glow transition-all px-5 flex items-center gap-1.5 group/btn"
              >
                Donate
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Mobile Card ───────────────────────────────────────────────────────────

function MobileCard({
  campaign,
  progress,
}: {
  campaign: Campaign
  progress: number
}) {
  return (
    <div className="w-full bg-white rounded-[2rem] shadow-soft-md border border-slate-100 overflow-hidden flex flex-col">
      <div className="relative h-48 bg-slate-100">
        <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm font-bold">
          [Image]
        </div>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <h3 className="text-xl font-bold text-slate-900">{campaign.title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2">
          {campaign.description}
        </p>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-tush h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-primary">
            ${campaign.raised.toLocaleString()}
          </span>
          <Link href={`/campaigns/${campaign.id}`}>
            <Button
              size="sm"
              className="h-10 rounded-xl bg-slate-900 text-white px-5 flex items-center gap-1.5"
            >
              Donate
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}