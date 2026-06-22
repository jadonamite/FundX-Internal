use client
export function ChainToggleSwitch({ isStacksMode, onToggle }: { isStacksMode: boolean; onToggle: () => void }) {
  const getBackgroundStyle = () => ({
    background: isStacksMode ? '#0f172a' : 'linear-gradient(to right, #FF6B4A, #FF3D71)',
    transition: 'background 700ms ease'
  })

  const getToggleStyle = () => ({
    transform: isStacksMode ? 'translateX(48px)' : 'translateX(0px)',
    transition: 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 10px 0 rgba(0,0,0,0.12)'
  })

  return (
    <span className="inline-flex align-middle ml-2">
      <button
        onClick={onToggle}
        aria-label="Toggle between Bitcoin and Stacks"
        className="relative inline-flex items-center cursor-pointer focus:outline-none"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <div style={getBackgroundStyle()} className="w-24 h-12 rounded-full p-1">
          <div style={getToggleStyle()} className="w-10 h-10 bg-white rounded-full" />
        </div>
      </button>
    </span>
  )
}