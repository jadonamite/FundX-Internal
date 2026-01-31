"use client"

import { useState, use } from "react" // <--- 1. Import 'use'
import { notFound } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/fundx/Navbar"
import { Footer } from "@/components/fundx/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Users, ShieldCheck, Share2, MapPin, ArrowLeft } from "lucide-react" 
import { useStacks } from "@/components/fundx/StacksProvider"
import { toast } from "sonner"
import { getCampaign } from "@/lib/data"

// 2. Update Type Definition to Promise
export default function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { isSignedIn, authenticate } = useStacks()
  const [donateAmount, setDonateAmount] = useState("")

  // 3. Unwrap the params using 'use()'
  const { id } = use(params)
  
  // Now we can use the ID safely
  const campaign = getCampaign(id)

  if (!campaign) {
    return notFound()
  }

  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100)

  const handleDonate = () => {
    if (!isSignedIn) {
      authenticate()
      return
    }
    if (!donateAmount || Number(donateAmount) <= 0) {
      toast.error("Invalid Amount", { description: "Please enter a valid amount to donate." })
      return
    }
    
    toast.success("Transaction Initiated", { 
      description: `Contributing ${donateAmount} STX to ${campaign.title}` 
    })
  }

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-orange-100 font-sans">
      <Navbar />

      <div className="container mx-auto max-w-6xl px-4 pt-32 pb-20">
        
        {/* Back Button */}
        <Link href="/explore" className="inline-flex items-center text-slate-400 hover:text-slate-900 mb-8 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to campaigns
        </Link>

        {/* HEADER SECTION */}
        <div className="mb-10 text-center md:text-left">
          <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
             <Badge variant="secondary" className="text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1 text-sm border border-orange-100">
               {campaign.category}
             </Badge>
             <div className="flex items-center text-slate-500 text-sm font-medium">
               <MapPin className="w-3 h-3 mr-1" /> {campaign.location}
             </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">
            {campaign.title}
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl">
            {campaign.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* LEFT COLUMN: Media & Story */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Hero Image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-slate-200 shadow-sm border border-slate-100 group">
               <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold bg-slate-100">
                 {/* In production, replace this text with <Image src={campaign.image} ... /> */}
                 [Image: {campaign.title}]
               </div>
            </div>

            {/* Creator Profile */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-y border-slate-200 py-6 gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-4 border-white shadow-sm">
                  <AvatarImage src={campaign.creatorImage} />
                  <AvatarFallback>{campaign.creator.slice(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Organized by</p>
                  <p className="font-bold text-slate-900 text-lg">{campaign.creator}</p>
                </div>
              </div>
              <div className="flex gap-6 text-slate-600 font-medium">
                 <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-500"/> Verified</div>
                 <div className="flex items-center gap-2"><Users className="w-5 h-5 text-orange-500"/> {campaign.backers} Backers</div>
              </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="story" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-slate-200 rounded-none h-auto p-0 mb-8 overflow-x-auto">
                <TabsTrigger value="story" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 px-6 py-3 text-base">
                  The Story
                </TabsTrigger>
                <TabsTrigger value="updates" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 px-6 py-3 text-base">
                  Updates
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="story" className="prose prose-slate prose-lg max-w-none text-slate-600">
                <p>{campaign.description}</p>
                <p>
                  This is the full story of the campaign. In a real app, this would be rich text content loaded from the database.
                </p>
                
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 my-8 not-prose">
                  <h4 className="font-bold text-orange-800 mb-2">Risks & Challenges</h4>
                  <p className="text-orange-700/80 text-sm">
                    All projects involve risk. Please do your own research (DYOR) before contributing.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="updates" className="py-8 text-center text-slate-500">
                 No updates yet.
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT COLUMN: Sticky Donation Card */}
          <div className="relative h-full">
            <div className="sticky top-32 p-8 rounded-[2rem] bg-white border border-slate-200 shadow-xl">
              
              {/* Progress Bar */}
              <div className="space-y-5 mb-8">
                <div className="space-y-1">
                   <div className="text-4xl font-black text-slate-900 tracking-tight">${campaign.raised.toLocaleString()}</div>
                   <div className="text-base font-medium text-slate-400">raised of ${campaign.goal.toLocaleString()} goal</div>
                </div>
                
                <Progress value={progress} className="h-3 bg-slate-100" />

                <div className="flex justify-between text-sm font-bold pt-2">
                  <span className="text-slate-900">{Math.round(progress)}% funded</span>
                  <span className="flex items-center gap-1 text-orange-600"><Clock className="w-4 h-4"/> {campaign.daysLeft} days left</span>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Donation Input */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-lg">Make a contribution</h4>
                  <p className="text-sm text-slate-500">Support {campaign.creator} to make this happen.</p>
                </div>
                
                <div className={`transition-all duration-300 ${!isSignedIn ? "opacity-50 grayscale pointer-events-none" : "opacity-100"}`}>
                  <div className="relative">
                    {/* Change STX to USDCx */}
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-bold text-lg">USDCx</span>
                    <Input 
                      type="number" 
                      placeholder="100" 
                      value={donateAmount}
                      onChange={(e) => setDonateAmount(e.target.value)}
                      className="pl-24 h-14 rounded-xl border-slate-200 bg-slate-50 text-xl font-bold focus-visible:ring-blue-500"
                    />
                  </div>
                </div>

                {isSignedIn ? (
                  <Button onClick={handleDonate} className="w-full h-14 rounded-xl bg-gradient-tush text-white shadow-glow hover:scale-[1.02] transition-transform text-lg font-bold">
                    Donate Now
                  </Button>
                ) : (
                  <Button onClick={authenticate} className="w-full h-14 rounded-xl bg-slate-900 text-white shadow-xl hover:bg-slate-800 transition-all text-lg font-bold">
                    Connect Wallet to Contribute
                  </Button>
                )}

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Secure transaction via Stacks</span>
                </div>
              </div>

              {/* Share Button */}
              <div className="mt-8 flex justify-center">
                 <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl h-12">
                    <Share2 className="w-4 h-4 mr-2" /> Share this campaign
                 </Button>
              </div>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}