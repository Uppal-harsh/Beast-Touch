import type { Metadata } from 'next';
import { AnalyticsConsent } from '@/components/AnalyticsConsent';
import { hasProductionUrl, siteDescription, siteName, siteUrl } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: 'BeastTouch — Made of the streets', template: '%s | BeastTouch' },
  description: siteDescription,
  applicationName: siteName,
  alternates: { canonical: '/' },
  robots: { index: !!hasProductionUrl, follow: !!hasProductionUrl },
  openGraph: {
    type: 'website',
    siteName,
    title: 'BeastTouch — Made of the streets',
    description: siteDescription,
    url: '/',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'BeastTouch — Made of the streets' }],
  },
  twitter: { card: 'summary_large_image', images: ['/opengraph-image'] },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    description: siteDescription,
    ...(hasProductionUrl ? { url: siteUrl.toString() } : {}),
  };
  return <html lang="en"><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, '\\u003c') }} />
    {children}
    <AnalyticsConsent measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ''} />
  </body></html>;
}
