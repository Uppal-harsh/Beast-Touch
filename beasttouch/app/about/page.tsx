import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/ContentPage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'Meet BeastTouch, an independent sneaker concept inspired by Indian streets, woven textures, and everyday movement.',
  alternates: { canonical: '/about' },
  openGraph: { title: 'Our Story | BeastTouch', description: 'An independent sneaker concept with Indian soul.', url: '/about', images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'BeastTouch — Made of the streets' }] },
};

export default function AboutPage() {
  return <ContentPage title="Our Story" eyebrow="THE BEASTTOUCH STATE OF MIND" path="/about">
    <p className="lead">From our streets to your story.</p>
    <p>BeastTouch is an independent sneaker concept inspired by the last game before the streetlights come on, the chai break that turns into a plan, and the textures that make a place feel like home.</p>
    <p>Our first expression, BT—01, pairs a court silhouette with handloom-inspired detail and bold contrasts. It is a design concept and is not currently for sale.</p>
    <p><Link href="/">Explore the concept</Link> or <Link href="/contact">get in touch</Link>.</p>
  </ContentPage>;
}
