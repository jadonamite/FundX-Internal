export function HeroBadge() {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-gradient-to-r from-orange-50/50 to-white px-4 py-1.5 text-sm font-medium text-orange-600 mb-8 cursor-default backdrop-blur-sm"
      style={{ boxShadow: "0 1px 6px 0 rgba(0,0,0,0.04)" }}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-[#FF6B4A] to-[#FF3D71]" />
      </span>
      <span className="tracking-wide">Live on Stacks</span>
    </div>
  )
}
