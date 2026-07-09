export function HeroBadge() {
  const badgeClasses = "inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-gradient-to-r from-orange-50/50 to-white px-4 py-1.5 text-sm font-medium text-orange-600 mb-8 cursor-default backdrop-blur-sm";
  const badgeStyles = { boxShadow: "0 1px 6px 0 rgba(0,0,0,0.04)" };
  const iconClasses = "relative flex h-2.5 w-2.5";
  const pingClasses = "animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75";
  const gradientClasses = "relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-[#FF6B4A] to-[#FF3D71]";
  const textClasses = "tracking-wide";

  return (
    <div className={badgeClasses} style={badgeStyles}>
      <span className={iconClasses}>
        <span className={pingClasses} />
        <span className={gradientClasses} />
      </span>
      <span className={textClasses}>Live on Stacks</span>
    </div>
  )
}