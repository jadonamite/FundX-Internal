"use client"

import { useState } from "react"
import { Navbar } from "@/components/fundx/Navbar"
import { Footer } from "@/components/fundx/Footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useStacks } from "@/components/fundx/StacksProvider"
import { toast } from "sonner"

// IMPORT MODULES
import { WizardSteps } from "@/components/create/WizardSteps"
import { LivePreview } from "@/components/create/LivePreview"

export default function CreateCampaign() {
  const { isSignedIn, authenticate } = useStacks()
  const [step, setStep] = useState(1)
  
  const [formData, setFormData] = useState({
    creatorName: "",
    creatorBio: "",
    email: "",
    title: "",
    tagline: "",
    category: "DeFi",
    projectStage: "MVP",
    description: "",
    image: "/campaign-1.jpg",
    goal: "10000",
    duration: "30",
  })

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)

  const handleSubmit = () => {
    if (!isSignedIn) {
      toast.error("Connect Wallet", { description: "You need a Stacks wallet to deploy." })
      authenticate()
      return
    }
    toast.success("Deployment Initiated", { 
      description: "Creating USDCx Fundraising Contract on Stacks..." 
    })
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100">
      <Navbar />

      <div className="container mx-auto max-w-7xl px-4 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Launch your Vision</h1>
          <p className="text-slate-500 text-lg">Create a trustless <strong>USDCx</strong> crowdfunding campaign.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* LEFT: Wizard */}
          <div className="space-y-8">
            
            {/* Steps Indicator */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
               {["Identity", "Project", "Story", "Funding"].map((label, idx) => {
                 const num = idx + 1;
                 return (
                   <div key={num} className="flex items-center gap-2 shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${step >= num ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-300 border-slate-200"}`}>
                         {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
                      </div>
                      <span className={`text-sm font-bold ${step >= num ? "text-slate-900" : "text-slate-300"}`}>{label}</span>
                   </div>
                 )
               })}
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 min-h-[550px] relative">
              
              {/* RENDER STEP MODULE */}
              <WizardSteps step={step} formData={formData} setFormData={setFormData} />

              {/* NAVIGATION */}
              <div className="absolute bottom-8 left-8 right-8 flex justify-between">
                {step > 1 ? (
                   <Button variant="ghost" onClick={handleBack} className="h-12 px-6 rounded-xl text-slate-500 hover:text-slate-900">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                   </Button>
                ) : <div />}

                {step < 4 ? (
                   <Button onClick={handleNext} className="h-12 px-8 rounded-xl bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 transition-all">
                      Next Step <ArrowRight className="w-4 h-4 ml-2" />
                   </Button>
                ) : (
                   <Button onClick={handleSubmit} className="h-12 px-8 rounded-xl bg-gradient-tush text-white shadow-glow hover:scale-105 transition-all font-bold">
                      {isSignedIn ? "Deploy Campaign" : "Connect & Deploy"}
                   </Button>
                )}
              </div>

            </div>
          </div>

          {/* RIGHT: Preview Module */}
          <div className="hidden lg:block relative">
             <LivePreview formData={formData} />
          </div>

        </div>
      </div>
      <Footer />
    </main>
  )
}