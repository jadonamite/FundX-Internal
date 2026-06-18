import Image from 'next/image';
const logoDetails = {
  src: '/Logo.svg',
  alt: 'FundX Logo',
  width: 32,
  height: 16,
};
export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src={logoDetails.src}
      alt={logoDetails.alt}
      width={logoDetails.width}
      height={logoDetails.height}
      className={className}
    />
  );
}