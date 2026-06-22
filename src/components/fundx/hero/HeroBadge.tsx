export const HERO_BADGE_CLASSES = 'inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-gradient-to-r from-orange-50/50 to-white px-4 py-1.5 text-sm font-medium text-orange-600 mb-8 cursor-default backdrop-blur-sm';
export const HERO_BADGE_BOX_SHADOW = '0 1px 6px 0 rgba(0,0,0,0.04)';
export const PING_SPAN_CLASSES = 'animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75';
export const RELATIVE_SPAN_CLASSES = 'relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-[#FF6B4A] to-[#FF3D71]';
export const TRACKING_SPAN_CLASSES = 'tracking-wide';
export function HeroBadge() {
  return (
    <div className={HERO_BADGE_CLASSES} style={{ boxShadow: HERO_BADGE_BOX_SHADOW }}>
      <span className="relative flex h-2.5 w-2.5">
        <span className={PING_SPAN_CLASSES} />
        <span className={RELATIVE_SPAN_CLASSES} />
      </span>
      <span className={TRACKING_SPAN_CLASSES}>Live on Stacks</span>
    </div>
  );
}