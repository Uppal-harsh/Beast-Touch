import Image from 'next/image';
import type { SneakerVariant } from './config';

type Props = {
  variant?: SneakerVariant;
  className?: string;
  alt?: string;
};

const filters: Record<SneakerVariant, string | undefined> = {
  Oxblood: undefined,
  Forest: 'hue-rotate(108deg) saturate(.7)',
  Indigo: 'hue-rotate(230deg) saturate(.75)',
};

export default function SneakerAsset({ variant = 'Oxblood', className, alt }: Props) {
  return <Image
    src="/images/beasttouch-01.png"
    width={1774}
    height={887}
    alt={alt ?? `BeastTouch BT—01 sneaker, ${variant} colour concept`}
    className={className}
    style={{ filter: filters[variant] }}
    loading="lazy"
  />;
}
