export function getHeroBadgeClassNames(): string { return "inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-gradient-to-r from-orange-50/50 to-white px-4 py-1.5 text-sm font-medium text-orange-600 mb-8 cursor-default backdrop-blur-sm"; }

export function getBadgeDotClassNames(): string { return "relative flex h-2.5 w-2.5"; }

export function getBadgeDotInnerClassNames(): string { return "animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"; }

export function getBadgeDotInnerGradientClassNames(): string { return "relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-[#FF6B4A] to-[#FF3D71]"; }

export function HeroBadge() { return ( 
  <div className={getHeroBadgeClassNames()} style={{ boxShadow: "0 1px 6px 0 rgba(0,0,0,0.04)" }} > 
    <span className={getBadgeDotClassNames()}> 
      <span className={getBadgeDotInnerClassNames()} /> 
      <span className={getBadgeDotInnerGradientClassNames()} /> 
    </span> 
    <span className="tracking-wide">Live on Stacks</span> 
  </div> 
); }
