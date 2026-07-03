import Image from 'next/image';

const LOGO_PROPS = {
  src: '/Logo.svg',
  alt: 'FundX Logo',
  width: 32,
  height: 16,
};

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      {...LOGO_PROPS}
      className={className}
    />
  );
}