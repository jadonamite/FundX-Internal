import Image from "next/image";

const LogoItem = ({ src, alt, isImage = true, text = '' }) => {
  if (isImage) {
    return (
      <div className="relative h-12 w-40 opacity-40 hover:opacity-100 transition-all duration-500 cursor-default grayscale hover:grayscale-0">
        <Image src={src} alt={alt} fill className="object-contain" />
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center h-12 w-40 cursor-default group">
        <span className="text-4xl font-black tracking-tighter text-slate-300 transition-colors duration-300 group-hover:text-[#2E8B57]">
          {text}
        </span>
      </div>
    );
  }
};

export function LogoStrip() {
  return (
    <div className="w-full border-t border-slate-100 py-20">
      {/* No background */}
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32">
          <LogoItem src="/stacks.png" alt="Stacks" />
          <LogoItem src="/bitcoin.svg" alt="Bitcoin" />
          <LogoItem isImage={false} text="USDCx" />
        </div>
      </div>
    </div>
  );
}