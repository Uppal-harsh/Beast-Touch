import type { Metadata } from 'next';
import Experience from '@/components/Experience';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: { absolute: 'BeastTouch — Made of the streets' },
  description: 'Step inside BeastTouch: an independent sneaker concept with Indian soul, woven details, and unapologetic soles.',
  alternates: { canonical: '/' },
};
export default function Page(){return <Experience/>}
