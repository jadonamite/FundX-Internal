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

      // STX (native, 6-dec uSTX) and USDCx (SIP-010, 6-dec) share the same scale
      const goalUnits = BigInt(Math.round(goalNumber * 10 ** USDCX_DECIMALS))
      const durationBlocks = durationNumber * BLOCKS_PER_DAY
      const fundingModel = Number(formData.fundingModel)
      const isStx = formData.currency === "STX"

      // Read current count so we can predict the new campaign ID
      const currentCount = await getCampaignCount()
      const newId = currentCount + 1

      // Fundraiser's chosen asset routes to the matching rail
      const createArgs = isStx
        ? [uintCV(goalUnits), uintCV(durationBlocks), uintCV(fundingModel)]
        : [contractPrincipalCV(USDCX_CONTRACT_ADDRESS, USDCX_CONTRACT_NAME), uintCV(goalUnits), uintCV(durationBlocks), uintCV(fundingModel)]

      await request("stx_callContract", {
        contract: FUNDX_CONTRACT_FQN as `${string}.${string}`,
        functionName: isStx ? "create-campaign-stx" : "create-campaign-ft",
        functionArgs: createArgs,
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
          <div className="space-y-6">

            {/* Step progress bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                {["Creator", "Campaign", "Funding"].map((label, idx) => {
                  const num = idx + 1
                  const isDone = step > num
                  const isActive = step === num
                  return (
                    <div key={num} className={`flex items-center gap-1.5 transition-colors ${isActive ? "text-slate-900" : isDone ? "text-orange-500" : "text-slate-300"}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
                        isDone ? "bg-orange-500 border-orange-500 text-white" :
                        isActive ? "bg-slate-900 border-slate-900 text-white" :
                        "bg-white border-slate-200 text-slate-300"
                      }`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : num}
                      </div>
                      <span>{label}</span>
                    </div>
                  )
                })}
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${((step - 1) / (WIZARD_STEPS - 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Form card */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 min-h-[540px] flex flex-col">
              <div className="flex-1">
                <WizardSteps
                  step={step}
                  formData={formData}
                  setFormData={setFormData}
                />
              </div>

              <div className="flex justify-between pt-8 mt-8 border-t border-slate-100">
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

                {step < WIZARD_STEPS ? (
                  <Button
                    onClick={handleNext}
                    className="h-12 px-8 rounded-xl bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 transition-all"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
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
