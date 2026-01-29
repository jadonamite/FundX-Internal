export function LogoStrip() {
  return (
    <div className="w-full border-t border-slate-100 bg-slate-50/50 py-12">
      <div className="container mx-auto max-w-5xl px-4">
        {/* The "Ghost" Container: Grayscale by default, Color on Hover */}
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 hover:opacity-100 transition-opacity duration-500">
          
          {/* 1. Bitcoin (Hover: Orange) */}
          <div className="group flex items-center gap-3 cursor-default transition-all hover:scale-105">
            <svg className="h-8 w-8 text-slate-400 group-hover:text-[#F7931A] transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.24 14.9.358c6.43 1.605 10.341 8.115 8.738 14.548v-.002zm-6.394-3.718c.885-2.954-1.51-4.542-3.902-5.619l.797-3.2-1.948-.485-.775 3.112c-.512-.128-1.05-.248-1.58-.367l.78-3.12-1.95-.485-.8 3.193a54.548 54.548 0 01-2.146-.51l.013-.053-2.69.672s.67.153.655.166c.365.09.43.328.42.518l-1.042 4.18c.063.016.143.04.23.08l-.226-.057-1.46 5.856c-.11.273-.39.682-1.017.527.016.022-.656-.164-.656-.164l-1.766 4.073 2.536.633c.473.117.935.244 1.393.366l-.805 3.23 1.95.484.796-3.197c.535.143 1.055.27 1.562.39l-.79 3.17 1.95.485.8-3.21c3.317.628 5.808.375 6.848-2.62.838-2.394-.04-3.774-1.77-4.675 1.258-.29 2.206-1.116 2.46-2.793z"/>
            </svg>
            <span className="text-lg font-bold text-slate-400 group-hover:text-slate-700 transition-colors">Bitcoin</span>
          </div>

          {/* 2. Stacks (Hover: Purple/Primary) */}
          <div className="group flex items-center gap-3 cursor-default transition-all hover:scale-105">
            <svg className="h-8 w-8 text-slate-400 group-hover:text-[#5546FF] transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.38 13.567L12.012 18.2l9.632-4.633-9.632 4.633-9.632-4.633zm19.242-4.463L12.012 4.5l-9.61 4.604 9.61 4.625 9.61-4.625zM2.38 17.067L12.012 21.7l9.632-4.633-9.632 4.633-9.632-4.633z"/>
            </svg>
            <span className="text-lg font-bold text-slate-400 group-hover:text-slate-700 transition-colors">Stacks</span>
          </div>

          {/* 3. USDC (Hover: Blue) */}
          <div className="group flex items-center gap-3 cursor-default transition-all hover:scale-105">
            <svg className="h-8 w-8 text-slate-400 group-hover:text-[#2775CA] transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" fill="currentColor" className="opacity-20 group-hover:opacity-100 transition-opacity"/>
              <path d="M12.75 16.5v-1.5h-.75c-1.24 0-2.25-1.01-2.25-2.25s1.01-2.25 2.25-2.25h2.25V9h-2.25c-1.5 0-2.8 1-3.15 2.4l-1.45-.4C7.9 8.8 9.75 7.5 12 7.5v-1.5h1.5V7.5h.75c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25h-2.25V15h2.25c1.5 0 2.8-1 3.15-2.4l1.45.4c-.5 2.2-2.35 3.5-4.6 3.5v1.5h-1.5z" fill="white" className="group-hover:fill-white fill-slate-400"/>
            </svg>
            <span className="text-lg font-bold text-slate-400 group-hover:text-slate-700 transition-colors">USDCx</span>
          </div>

        </div>
      </div>
    </div>
  )
}