"use client"

export function ChainToggleSwitch({ isStacksMode, onToggle }: { isStacksMode: boolean; onToggle: () => void }) {
  return (
    <span className="inline-flex align-middle ml-2">
      <button onClick={onToggle} aria-label="Toggle between Bitcoin and Stacks" className="relative inline-flex items-center cursor-pointer focus:outline-none" style={{ WebkitTapHighlightColor: "transparent" }}>
        <div style={{ transition: "background 700ms ease", background: isStacksMode ? "#0f172a" : "linear-gradient(to right, #FF6B4A, #FF3D71)" }} className="w-24 h-12 rounded-full p-1">
          <div style={{ transition: "transform 650ms cubic-bezier(0.4, 0, 0.2, 1)", transform: isStacksMode ? "translateX(48px)" : "translateX(0px)", boxShadow: "0 2px 10px 0 rgba(0,0,0,0.12)" }} className="w-10 h-10 bg-white rounded-full" />
        </div>
      </button>
    </span>
  )
}
