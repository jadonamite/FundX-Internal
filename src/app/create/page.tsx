"use client"

import { useState } from "react"
import { Navbar } from "@/components/fundx/Navbar"
import { Footer } from "@/components/fundx/Footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useStacks } from "@/components/fundx/StacksProvider"
import { toast } from "sonner"
import {
  FUNDX_CONTRACT_FQN,
  REGISTRY_CONTRACT_FQN,
  STACKS_NETWORK,
  USDCX_CONTRACT_ADDRESS,
  USDCX_CONTRACT_NAME,
  USDCX_DECIMALS,
  BLOCKS_PER_DAY,
} from "@/lib/stacks-config"
import { getCampaignCount } from "@/lib/stacks-contract"

import { WizardSteps, WIZARD_STEPS, validateStep } from "@/components/create/WizardSteps"
import { LivePreview } from "@/components/create/LivePreview"

export interface CreateCampaignData {
  creatorName: string;
  creatorBio: string;
  email: string;
  twitter: string;
  github: string;
  portfolio: string;
  title: string;
  tagline: string;
  category: string;
  projectStage: string;
  description: string;
  videoUrl: string;
  budgetBreakdown: string;
  roadmap: string;
  image: string;
  goal: string;
  duration: string;
  fundingModel: "0" | "1";
  currency: "USDCx" | "STX";
}

export default function CreateCampaign() {
  const router = useRouter()
  const { isSignedIn, authenticate } = useStacks()
  const [step, setStep] = useState(1)
  const [isDeploying, setIsDeploying] = useState(false)

  const [formData, setFormData] = useState<CreateCampaignData>({
    creatorName: "",
    creatorBio: "",
    email: "",
    twitter: "",
    github: "",
    portfolio: "",
    title: "",
    tagline: "",
    category: "DeFi",
    projectStage: "MVP",
    description: "",
    videoUrl: "",
    budgetBreakdown: "",
    roadmap: "",
    image: "",
    goal: "10000",
    duration: "30",
    fundingModel: "0",
    currency: "USDCx",
  })

  const handleNext = () => {
    const error = validateStep(step, formData)
    if (error) {
      toast.error(error)
      return
    }
    setStep(step + 1)
  }
  const handleBack = () => setStep(step - 1)

  const handleSubmit = async () => {
    if (!isSignedIn) {
      toast.error("Connect Wallet", { description: "You need a Stacks wallet to deploy." })
      authenticate()
      return
    }
    if (isDeploying) return
    setIsDeploying(true)

    const goalNumber = Number(formData.goal)
    const durationNumber = Number(formData.duration)
    if (!goalNumber || goalNumber <= 0) {
      toast.error("Invalid goal", { description: "Enter a goal amount greater than 0." })
      return
    }
    if (!durationNumber || durationNumber <= 0) {
      toast.error("Invalid duration", { description: "Enter a duration in days greater than 0." })
      return
    }

    try {
      toast.loading("Awaiting wallet signature...", { id: "create" })

      const { request } = await import("@stacks/connect")
      const { uintCV, contractPrincipalCV } = await import("@stacks/transactions")

      // USDCx for now; STX support requires a wrapped SIP-010 token address
      const tokenAddr = USDCX_CONTRACT_ADDRESS
      const tokenName = USDCX_CONTRACT_NAME

      const goalUnits = BigInt(Math.round(goalNumber * 10 ** USDCX_DECIMALS))
      const durationBlocks = durationNumber * BLOCKS_PER_DAY
      const fundingModel = Number(formData.fundingModel)

      // Read current count so we can predict the new campaign ID
      const currentCount = await getCampaignCount()
      const newId = currentCount + 1

      await request("stx_callContract", {
        contract: FUNDX_CONTRACT_FQN as `${string}.${string}`,
        functionName: "create-campaign",
        functionArgs: [
          contractPrincipalCV(tokenAddr, tokenName),
          uintCV(goalUnits),
          uintCV(durationBlocks),
          uintCV(fundingModel),
        ],
        network: STACKS_NETWORK as any,
        postConditionMode: "deny",
        postConditions: [],
      } as any)

      toast.loading("Campaign deployed! Registering metadata...", { id: "create" })

      const { stringUtf8CV } = await import("@stacks/transactions")

      await request("stx_callContract", {
        contract: REGISTRY_CONTRACT_FQN as `${string}.${string}`,
        functionName: "register",
        functionArgs: [
          uintCV(newId),
          stringUtf8CV(formData.title || `Campaign #${newId}`),
          stringUtf8CV(formData.tagline || ""),
          stringUtf8CV(formData.description || ""),
          stringUtf8CV(formData.image || ""),
          stringUtf8CV(formData.category || "DeFi"),
          stringUtf8CV(""),
          stringUtf8CV(formData.twitter ? `twitter:${formData.twitter}` : ""),
        ],
        network: STACKS_NETWORK as any,
        postConditionMode: "deny",
        postConditions: [],
      } as any)

      toast.success("Campaign live!", {
        id: "create",
        description: "Your campaign and metadata are on Stacks.",
      })
      router.push(`/campaigns/${newId}`)
    } catch (err) {
      console.error(err)
      toast.error("Deployment Failed", { id: "create", description: "Transaction cancelled or failed." })
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100">
      <Navbar />

      <div className="container mx-auto max-w-7xl px-4 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Launch your Vision
          </h1>
          <p className="text-slate-500 text-lg">
            Create a trustless <strong>USDCx</strong> crowdfunding campaign.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          <div className="space-y-8">
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
              {["Identity", "Bio", "Basics", "Story", "Execute", "Fund"].map((label, idx) => {
                const num = idx + 1
                const isCompleted = step > num
                const isCurrent = step === num

                let circleStyle = "bg-white text-slate-300 border-slate-200"
                if (isCompleted) circleStyle = "bg-[#FF6B4A] text-white border-[#FF6B4A]"
                else if (isCurrent) circleStyle = "bg-slate-900 text-white border-slate-900"

                return (
                  <div key={num} className="flex items-center gap-2 shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${circleStyle}`}>
                      {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : num}
                    </div>
                    <span className={`text-sm font-bold ${isCompleted || isCurrent ? "text-slate-900" : "text-slate-300"}`}>{label}</span>
                  </div>
                )
              })}
            </div>

            <div className="bg-white p-8 pb-28 rounded-[2rem] shadow-xl border border-slate-100 min-h-[550px] relative">
              <WizardSteps
                step={step}
                formData={formData}
                setFormData={setFormData}
              />

              <div className="absolute bottom-8 left-8 right-8 flex justify-between">
                {step > 1 ? (
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="h-12 px-6 rounded-xl text-slate-500 hover:text-slate-900"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                ) : (
                  <div />
                )}

                {step < 6 ? (
                  <Button
                    onClick={handleNext}
                    className="h-12 px-8 rounded-xl bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 transition-all"
                  >
                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isDeploying}
                    className="h-12 px-8 rounded-xl bg-gradient-tush text-white shadow-glow hover:scale-105 transition-all font-bold disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isDeploying ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deploying...</>
                    ) : isSignedIn ? "Deploy Campaign" : "Connect & Deploy"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <LivePreview formData={formData} />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
