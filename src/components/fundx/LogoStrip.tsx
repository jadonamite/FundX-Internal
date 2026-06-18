import Image from "next/image";

const LogoContainer = ({ children, src, alt }) => {
  return (
    <div className="relative h-12 w-40 opacity-40 hover:opacity-100 transition-all duration-500 cursor-default grayscale hover:grayscale-0">
      {src ? <Image src={src} alt={alt} fill className="object-contain" /> : children}
    </div>
  );
};

export function LogoStrip() {
  return (
    <div className="w-full border-t border-slate-100 py-20">
      {/* No background */}
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32">
          <LogoContainer src="/stacks.png" alt="Stacks" />
          <LogoContainer src="/bitcoin.svg" alt="Bitcoin" />
          <LogoContainer>
            <span className="text-4xl font-black tracking-tighter text-slate-300 transition-colors duration-300 hover:text-[#2E8B57]">
              USDCx
            </span>
          </LogoContainer>
        </div>
      </div>
    </div>
  );
}