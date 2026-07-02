import { CampaignCard } from "@/components/fundx/CampaignCard"
import type { CreateCampaignData } from "@/app/create/page"

export function LivePreview({ formData }: { formData: CreateCampaignData }) {
  // Check if we are using STX to change colors
  const isSTX = formData.currency === "STX";

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