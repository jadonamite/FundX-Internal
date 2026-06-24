use client
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

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {msg}
    </p>
  )
}

function CharCount({ value, max }: { value: string; max: number }) {
  const over = value.length > max
  return (
    <span className={`text-xs tabular-nums ${over ? "text-red-500 font-bold" : "text-slate-400"}`}>{value.length}/{max}</span>
  )
}

function FundingModelCard({ value, selected, onClick, title, description, badge, }:
  { value: string; selected: boolean; onClick: () => void; title: string; description: string; badge?: string }) {
  return (
    <button type="button" onClick={onClick} className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 relative ${
      selected ? "border-slate-900 bg-slate-900 text-white shadow-lg scale-[1.01]" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
    }`}>      {
      badge && (
        <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${
          selected ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600"
        }`}>{badge}</span>
      )}
      <div className="flex items-start gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
          selected ? "border-white bg-white" : "border-slate-300"
        }`}>{selected && <Check className="w-3 h-3 text-slate-900" />}
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

  const renderField = (
    label: string,
    field: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onBlur: () => void,
    error: boolean,
    placeholder?: string,
    maxLength?: number
  ) => {
    return (
      <div className="space-y-2">
        <Label className="font-semibold text-slate-700">{label} {error ? <span className="text-red-400">*</span> : null}</Label>
        <Input
          placeholder={placeholder}
          className={`h-13 rounded-xl ${error ? "border-red-400 focus-visible:ring-red-400" : ""}`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          maxLength={maxLength}
        />
        {error && <FieldError msg={`${label} is required`} />}
      </div>
    )
  }

  // ─── STEP 1: Creator ───────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="space-y-7 animate-in fade-in slide-in-from-right-4 duration-400">
        <div>
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Step 1 of 3</p>
          <h2 className="text-2xl font-bold text-slate-900">Who's building this?</h2>
          <p className="text-slate-400 text-sm mt-1">Your public profile visible to backers.</p>
        </div>
        {renderField(
          "Creator Name / Org",
          "creatorName",
          formData.creatorName,
          (e) => setFormData({ ...formData, creatorName: e.target.value }),
          () => touch("creatorName"),
          err("creatorName", !formData.creatorName)
        )}
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
        {renderField(
          "Website / Portfolio",
          "portfolio",
          formData.portfolio,
          (e) => setFormData({ ...formData, portfolio: e.target.value }),
          () => {},
          false
        )}
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
        {renderField(
          "Campaign Title",
          "title",
          formData.title,
          (e) => setFormData({ ...formData, title: e.target.value }),
          () => touch("title"),
          err("title", !formData.title)
        )}
        <div className="flex justify-between items-center">
          <Label className="font-semibold text-slate-700">Tagline <span className="text-red-400">*</span></Label>
          <CharCount value={formData.tagline} max={80} />
        </div>
        {renderField(
          "Tagline",
          "tagline",
          formData.tagline,
          (e) => setFormData({ ...formData, tagline: e.target.value }),
          () => touch("tagline"),
          err("tagline", !formData.tagline),
          "One punchy sentence that sells your idea",
          80
        )}
      </div>
    )
  }
}