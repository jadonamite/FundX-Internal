"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Check, Zap, ShieldCheck } from "lucide-react"
import { CreateCampaignData } from "@/app/create/page"

interface WizardProps {
  step: number
  formData: CreateCampaignData
  setFormData: (data: CreateCampaignData) => void
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
      <AlertCircle className="w-3 h-3 shrink-0" /> {message}
    </p>
  )
}

function CharCount({ value, max }: { value: string; max: number }) {
  const over = value.length > max
  return (
    <span className={`text-xs tabular-nums ${over ? "text-red-500 font-bold" : "text-slate-400"}`}>
      {value.length}/{max}
    </span>
  )
}

function FundingModelCard({
  value, selected, onClick, title, description, badge,
}: {
  value: string; selected: boolean; onClick: () => void
  title: string; description: string; badge?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 relative ${
        selected
          ? "border-slate-900 bg-slate-900 text-white shadow-lg scale-[1.01]"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {badge && (
        <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${
          selected ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600"
        }`}>
          {badge}
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
          selected ? "border-white bg-white" : "border-slate-300"
        }`}>
          {selected && <Check className="w-3 h-3 text-slate-900" />}
        </div>
        <div>
          <p className={`font-bold text-base mb-1 ${selected ? "text-white" : "text-slate-900"}`}>{title}</p>
          <p className={`text-sm leading-relaxed ${selected ? "text-white/80" : "text-slate-500"}`}>{description}</p>
        </div>
      </div>
    </button>
  )
}

const CATEGORIES = ["DeFi & Finance", "Mining & Infra", "Education", "Gaming", "Social Impact", "Infrastructure", "Other"]

export function WizardSteps({ step, formData, setFormData }: WizardProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const touch = (field: string) => setTouched(t => ({ ...t, [field]: true }))
  const err = (field: string, cond: boolean) => touched[field] && cond

  // ─── STEP 1: Creator ───────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="space-y-7 animate-in fade-in slide-in-from-right-4 duration-400">
        <div>
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Step 1 of 3</p>
          <h2 className="text-2xl font-bold text-slate-900">Who's building this?</h2>
          <p className="text-slate-400 text-sm mt-1">Your public profile visible to backers.</p>
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-slate-700">
            Creator Name / Org <span className="text-red-400">*</span>
          </Label>
          <Input
            placeholder="e.g. Satoshi Nakamoto"
            className={`h-13 rounded-xl text-base ${err("creatorName", !formData.creatorName) ? "border-red-400 focus-visible:ring-red-400" : ""}`}
            value={formData.creatorName}
            onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
            onBlur={() => touch("creatorName")}
          />
          {err("creatorName", !formData.creatorName) && <FieldError message="Name is required" />}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-semibold text-slate-700">Twitter / X</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">@</span>
              <Input
                placeholder="username"
                className="pl-7 h-13 rounded-xl"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold text-slate-700">GitHub</Label>
            <Input
              placeholder="github.com/..."
              className="h-13 rounded-xl"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-slate-700">Website / Portfolio</Label>
          <Input
            placeholder="https://yourproject.com"
            className="h-13 rounded-xl"
            value={formData.portfolio}
            onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
          />
        </div>
      </div>
    )
  }

  // ─── STEP 2: Campaign ──────────────────────────────────────────
  if (step === 2) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
        <div>
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Step 2 of 3</p>
          <h2 className="text-2xl font-bold text-slate-900">Your Campaign</h2>
          <p className="text-slate-400 text-sm mt-1">This information is stored on-chain via the registry.</p>
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-slate-700">
            Campaign Title <span className="text-red-400">*</span>
          </Label>
          <Input
            placeholder="e.g. Stacks DeFi Academy"
            className={`h-13 rounded-xl text-base font-bold ${err("title", !formData.title) ? "border-red-400 focus-visible:ring-red-400" : ""}`}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onBlur={() => touch("title")}
          />
          {err("title", !formData.title) && <FieldError message="Title is required" />}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="font-semibold text-slate-700">
              Tagline <span className="text-red-400">*</span>
            </Label>
            <CharCount value={formData.tagline} max={80} />
          </div>
          <Input
            placeholder="One punchy sentence that sells your idea"
            className={`h-13 rounded-xl ${err("tagline", !formData.tagline) ? "border-red-400 focus-visible:ring-red-400" : ""}`}
            value={formData.tagline}
            maxLength={80}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            onBlur={() => touch("tagline")}
          />
          {err("tagline", !formData.tagline) && <FieldError message="Tagline is required" />}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-semibold text-slate-700">Category</Label>
            <Select
              onValueChange={(val) => setFormData({ ...formData, category: val })}
              defaultValue={formData.category}
            >
              <SelectTrigger className="h-13 rounded-xl">
                <SelectValue placeholder="Pick a category" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl shadow-xl">
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold text-slate-700">Cover Image URL</Label>
            <Input
              placeholder="https://..."
              className="h-13 rounded-xl"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="font-semibold text-slate-700">
              Description <span className="text-red-400">*</span>
            </Label>
            <CharCount value={formData.description} max={512} />
          </div>
          <Textarea
            placeholder="What problem are you solving? How does it work? Why now?"
            className={`h-44 rounded-xl resize-none p-4 text-sm leading-relaxed ${
              err("description", !formData.description) ? "border-red-400 focus-visible:ring-red-400" : ""
            }`}
            maxLength={512}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            onBlur={() => touch("description")}
          />
          {err("description", !formData.description) && <FieldError message="Description is required" />}
        </div>
      </div>
    )
  }

  // ─── STEP 3: Funding ───────────────────────────────────────────
  if (step === 3) {
    const goalNum = Number(formData.goal)
    const durationNum = Number(formData.duration)

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
        <div>
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Step 3 of 3</p>
          <h2 className="text-2xl font-bold text-slate-900">Funding Setup</h2>
          <p className="text-slate-400 text-sm mt-1">These parameters are written directly to the smart contract.</p>
        </div>

        <div className="space-y-3">
          <Label className="font-semibold text-slate-700">Settlement Asset</Label>
          <div className="grid grid-cols-2 gap-3">
            <FundingModelCard
              value="USDCx"
              selected={formData.currency === "USDCx"}
              onClick={() => setFormData({ ...formData, currency: "USDCx" })}
              title="USDCx"
              description="USD-pegged stablecoin. No volatility for backers."
              badge="Stable"
            />
            <FundingModelCard
              value="STX"
              selected={formData.currency === "STX"}
              onClick={() => setFormData({ ...formData, currency: "STX" })}
              title="STX"
              description="Native Stacks token. Raise in STX directly."
            />
          </div>
          <p className="text-xs text-slate-400">The asset is fixed at creation — a campaign accepts only the one you pick.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-semibold text-slate-700">
              Goal Amount <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-bold text-sm">{formData.currency}</span>
              <Input
                type="number"
                min={1}
                className={`pl-16 h-13 rounded-xl text-lg font-bold ${
                  err("goal", !goalNum || goalNum <= 0) ? "border-red-400 focus-visible:ring-red-400" : ""
                }`}
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                onBlur={() => touch("goal")}
              />
            </div>
            {err("goal", !goalNum || goalNum <= 0) && <FieldError message="Enter a goal greater than 0" />}
          </div>

          <div className="space-y-2">
            <Label className="font-semibold text-slate-700">
              Duration <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <Input
                type="number"
                min={1}
                max={365}
                className={`pr-14 h-13 rounded-xl text-lg font-bold ${
                  err("duration", !durationNum || durationNum <= 0) ? "border-red-400 focus-visible:ring-red-400" : ""
                }`}
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                onBlur={() => touch("duration")}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm pointer-events-none">days</span>
            </div>
            {err("duration", !durationNum || durationNum <= 0) && <FieldError message="Enter a duration greater than 0" />}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="font-semibold text-slate-700">Funding Model</Label>
          <div className="space-y-3">
            <FundingModelCard
              value="0"
              selected={formData.fundingModel === "0"}
              onClick={() => setFormData({ ...formData, fundingModel: "0" })}
              title="Flexible"
              description="You keep whatever is raised, even if the goal isn't met. Lower risk for creators."
              badge="Popular"
            />
            <FundingModelCard
              value="1"
              selected={formData.fundingModel === "1"}
              onClick={() => setFormData({ ...formData, fundingModel: "1" })}
              title="All-or-Nothing"
              description="Funds are only released if the goal is fully reached. Backers get refunds if it falls short."
            />
          </div>
        </div>

        {goalNum > 0 && durationNum > 0 && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Summary</p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-700">
              <span><span className="font-bold">{goalNum.toLocaleString()}</span> {formData.currency} goal</span>
              <span><span className="font-bold">{durationNum}</span> days (~{(durationNum * 144).toLocaleString()} blocks)</span>
              <span><span className="font-bold">{formData.fundingModel === "0" ? "Flexible" : "All-or-Nothing"}</span> model</span>
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> 2% platform fee on success
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return null
}

// Export step count and per-step validators for the parent page
export const WIZARD_STEPS = 3

export function validateStep(step: number, formData: CreateCampaignData): string | null {
  if (step === 1 && !formData.creatorName.trim()) return "Creator name is required"
  if (step === 2) {
    if (!formData.title.trim()) return "Campaign title is required"
    if (!formData.tagline.trim()) return "Tagline is required"
    if (!formData.description.trim()) return "Description is required"
  }
  if (step === 3) {
    if (!Number(formData.goal) || Number(formData.goal) <= 0) return "Enter a valid goal amount"
    if (!Number(formData.duration) || Number(formData.duration) <= 0) return "Enter a valid duration"
  }
  return null
}
