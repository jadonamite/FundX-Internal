import { CampaignCard } from "@/components/fundx/CampaignCard"
import type { CreateCampaignData } from "@/app/create/page"

const getAssetClass = (currency: string | undefined) => {
  const isSTX = currency === "STX"
  return {
    className: `font-bold px-2 py-0.5 rounded-md text-xs ${isSTX ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'}`,
    text: currency || "USDCx"
  }
}

export function LivePreview({ formData }: { formData: CreateCampaignData }) {
  return (
    <div className="sticky top-32 space-y-6">
        <div className="text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Live Preview</p>
        </div>
        
        <div className="transform scale-110 origin-top">
            <CampaignCard 
                id="preview"
                title={formData.title || "Untitled Campaign"}
                description={formData.tagline || "Your campaign description will appear here..."}
                raised={0}
                goal={Number(formData.goal) || 10000}
                image={formData.image || \