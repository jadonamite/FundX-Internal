"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Rocket } from "lucide-react"
import { CreateCampaignData } from "@/app/create/page" 


interface WizardProps {
  step: number
  formData: CreateCampaignData
  setFormData: (data: CreateCampaignData) => void
}

export function WizardSteps({ step, formData, setFormData }: WizardProps) {

  

  if (step === 1) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
         <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Who is building this?</h2>
            <p className="text-slate-500 text-sm">Backers fund people, not just code.</p>
         </div>
         <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                 <Label>Creator Name / Org</Label>
                 <Input 
                    placeholder="e.g. Satoshi Nakamoto" 
                    className="h-12 rounded-xl"
                    value={formData.creatorName}
                    onChange={(e) => setFormData({...formData, creatorName: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <Label>Email (Private)</Label>
                 <Input 
                    placeholder="you@example.com" 
                    className="h-12 rounded-xl"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                 />
              </div>
            </div>
            <div className="space-y-2">
               <Label>Creator Bio</Label>
               <Textarea 
                  placeholder="Tell us about your background..." 
                  className="h-24 rounded-xl resize-none"
                  value={formData.creatorBio}
                  onChange={(e) => setFormData({...formData, creatorBio: e.target.value})}
               />
            </div>
         </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
         <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Project Details</h2>
            <p className="text-slate-500 text-sm">Define what you are building.</p>
         </div>
         <div className="space-y-4">
            <div className="space-y-2">
               <Label>Project Title</Label>
               <Input 
                  placeholder="e.g. Stacks DeFi Academy" 
                  className="h-12 rounded-xl"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
               />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                 <Label>Category</Label>
                 <Select onValueChange={(val) => setFormData({...formData, category: val})} defaultValue={formData.category}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                       <SelectItem value="DeFi">DeFi & Finance</SelectItem>
                       <SelectItem value="Mining">Mining & Infra</SelectItem>
                       <SelectItem value="Education">Education</SelectItem>
                       <SelectItem value="Gaming">Gaming</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              <div className="space-y-2">
                 <Label>Current Stage</Label>
                 <Select onValueChange={(val) => setFormData({...formData, projectStage: val})} defaultValue={formData.projectStage}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                       <SelectItem value="Idea">Concept / Idea</SelectItem>
                       <SelectItem value="Prototype">Prototype / Alpha</SelectItem>
                       <SelectItem value="MVP">Live MVP</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
            </div>
         </div>
      </div>
    )
  }


  if (step === 3) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
         <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">The Pitch</h2>
            <p className="text-slate-500 text-sm">Tell your story.</p>
         </div>
         <div className="space-y-4">
            <div className="space-y-2">
               <Label>Short Tagline</Label>
               <Textarea 
                  placeholder="Explain it in one sentence..." 
                  className="h-20 rounded-xl resize-none"
                  value={formData.tagline}
                  onChange={(e) => setFormData({...formData, tagline: e.target.value})}
               />
            </div>
            <div className="space-y-2">
               <Label>Full Description</Label>
               <Textarea 
                  placeholder="What problem are you solving?" 
                  className="min-h-[200px] rounded-xl resize-none p-4"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
               />
            </div>
         </div>
      </div>
    )
  }

 if (step === 4) {
   return (
     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
       <div className="mb-6">
         <h2 className="text-2xl font-bold text-slate-900">Funding Goals</h2>
         <p className="text-slate-500 text-sm">
           Set your target in USDCx (Stablecoin).
         </p>
       </div>

       <div className="grid grid-cols-2 gap-6">
         <div className="space-y-2">
           <Label>Target Amount</Label>
           <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-blue-600 text-sm">
               USDCx
             </span>
             <Input
               type="number"
               className="pl-20 h-14 rounded-xl text-lg font-bold"
               value={formData.goal}
               onChange={(e) =>
                 setFormData({ ...formData, goal: e.target.value })
               }
             />
           </div>
         </div>
         <div className="space-y-2">
           <Label>Duration (Days)</Label>
           <Input
             type="number"
             className="h-14 rounded-xl text-lg font-bold"
             value={formData.duration}
             onChange={(e) =>
               setFormData({ ...formData, duration: e.target.value })
             }
           />
         </div>
       </div>

       {/* 🚨 HERE IS OUR UPDATED RULE CHOICE DROPDOWN */}
       <div className="space-y-2 mt-4">
         <Label>Funding Model</Label>
         <Select
           onValueChange={(val) =>
             setFormData({ ...formData, fundingModel: val as "0" | "1" })
           }
           defaultValue={formData.fundingModel}
         >
           {/* 1. Made the box a bit sleeker (h-12), text smaller (text-sm), and forced a solid white background */}
           <SelectTrigger className="h-12 rounded-xl text-sm font-semibold text-slate-700 bg-white border-slate-200 shadow-sm">
             <SelectValue />
           </SelectTrigger>

           {/* 2. Painted the dropdown solid white (bg-white) with a strong shadow so it's no longer see-through */}
           <SelectContent className="bg-white border-slate-200 shadow-xl rounded-xl z-50">
             <SelectItem
               value="0"
               className="text-sm font-medium text-slate-700 py-3 cursor-pointer"
             >
               Flexible (Keep what you raise)
             </SelectItem>
             <SelectItem
               value="1"
               className="text-sm font-medium text-slate-700 py-3 cursor-pointer"
             >
               All-or-Nothing (Refunds if goal fails)
             </SelectItem>
           </SelectContent>
         </Select>
       </div>

       <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex gap-4 items-start mt-6">
         <div className="p-2 bg-white rounded-full shadow-sm shrink-0">
           <Rocket className="w-5 h-5 text-blue-500" />
         </div>
         <div>
           <h4 className="font-bold text-blue-900">Why USDCx?</h4>
           <p className="text-sm text-blue-700/80 mt-1">
             We use USDCx on Stacks to ensure your funding doesn't fluctuate
             with market volatility.
           </p>
         </div>
       </div>
     </div>
   );
 }

  return null
}