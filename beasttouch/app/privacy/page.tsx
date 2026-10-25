import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentPage } from '@/components/ContentPage';
import { PrivacyControls } from '@/components/PrivacyControls';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How the BeastTouch concept site handles saved selections, contact messages, and optional analytics.',
  alternates: { canonical: '/privacy' },
  openGraph: { title: 'Privacy Policy | BeastTouch', description: 'How the BeastTouch concept site handles your information.', url: '/privacy', images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'BeastTouch — Made of the streets' }] },
};

export default function PrivacyPage() {
  return <ContentPage title="Privacy Policy" eyebrow="YOUR CHOICES" path="/privacy">
    <p>Last updated 26 October 2026. This notice describes the current BeastTouch concept website.</p>
    <h2>Selections on your device</h2>
    <p>When you save a BT—01 size and colour, or explore a product detail, the site stores those choices in your browser’s local storage. They stay on that device until you remove the saved pair or clear browser storage. No order or payment is placed.</p>
    <h2>Contact messages</h2>
    <p>If you use the contact form, we receive the name, email address, and message you submit so we can respond. Messages are delivered through Resend to our contact mailbox. Please avoid sending sensitive information through the form. You can request access to or deletion of a message by <Link href="/contact">contacting us</Link>.</p>
    <h2>Optional analytics</h2>
    <p>If Google Analytics is configured, it loads only after you choose “Allow analytics.” Your choice is stored in your browser. You can reopen the choice below. If analytics is not configured, no Google Analytics tag is loaded.</p>
    <PrivacyControls />
    <h2>Changes</h2>
    <p>We will update this page when the site’s data practices change. The date above shows the latest revision.</p>
  </ContentPage>;
}
