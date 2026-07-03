import Image from "next/image";

const LogoContainer = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => (
  <div className={`relative h-12 w-40 opacity-40 hover:opacity-100 transition-all duration-500 cursor-default grayscale hover:grayscale-0 ${className}`}
  >
    <Image src={src} alt={alt} fill className="object-contain" />
  </div>
);

const getLogoItems = () => [
  { src: \