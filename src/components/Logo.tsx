import Image from "next/image";

export default function Logo({ className_ }: { className_?: string }) {
  return (
    <Image
      src="/Logo.svg"
      alt="FundX Logo"
      width={32}
      height={16}
      className_={className_}
    />
  );
}

// ⟳ echo · src/components/fundx/TrustStrips.tsx
//             SIP-010 Compatible
//           </span>
//           <span className="flex items-center gap-2">
//             <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
//             Non-Custodial