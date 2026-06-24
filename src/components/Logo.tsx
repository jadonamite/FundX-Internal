import Image from 'next/image';
const getLogoProps = () => ({
  src: '/Logo.svg',
  alt: 'FundX Logo',
  width: 32,
  height: 16
});
export default function Logo({ className }: { className?: string }) {
  const logoProps = getLogoProps();
  return (
    <Image {...logoProps} className={className} />
  );
}