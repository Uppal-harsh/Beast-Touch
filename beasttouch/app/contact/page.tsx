import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/ContactForm';
import { ContentPage } from '@/components/ContentPage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Send a message to BeastTouch about the BT—01 concept, creative ideas, or general enquiries.',
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact | BeastTouch', description: 'Get in touch with BeastTouch.', url: '/contact', images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'BeastTouch — Made of the streets' }] },
};

export default function ContactPage() {
  return <ContentPage title="Contact" eyebrow="LET’S TALK" path="/contact">
    <p className="lead">Have something in mind?</p>
    <p>Send us a note about BeastTouch, the BT—01 concept, or a creative idea. We will use your details only to handle your message; see our <Link href="/privacy">privacy notice</Link>.</p>
    <ContactForm />
  </ContentPage>;
}
