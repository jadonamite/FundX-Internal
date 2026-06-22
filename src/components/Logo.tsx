import Image from 'next/image';

const logoProps = {
  src: '/Logo.svg',
  alt: 'FundX Logo',
  width: 32,
  height: 16,
};

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src={logoProps.src}
      alt={logoProps.alt}
      width={logoProps.width}
      height={logoProps.height}
      className={className}
    />
  );
}