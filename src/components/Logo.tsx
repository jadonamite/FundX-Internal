import Image from "next/image";

/**
 * Logo
 * @param {*} { className }: { className?: string }
 * @returns {*}
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/Logo.svg"
      alt="FundX Logo"
      width={32}
      height={16}
      className={className}
    />
  );
}