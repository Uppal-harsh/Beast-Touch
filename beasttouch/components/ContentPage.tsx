import Link from 'next/link';
import { absoluteUrl } from '@/lib/site';

export function ContentPage({ title, eyebrow, path, children }: { title: string; eyebrow: string; path: string; children: React.ReactNode }) {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: title, item: absoluteUrl(path) },
    ],
  };
  return <div className="content-page">
    <header className="content-header"><Link href="/" className="content-logo">✳ BEASTTOUCH</Link><nav aria-label="Site"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link></nav></header>
    <main className="content-main">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, '\\u003c') }} />
      <p className="content-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="content-body">{children}</div>
    </main>
    <footer className="content-footer"><span>MADE OF THE STREETS.</span><nav aria-label="Footer"><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link></nav></footer>
  </div>;
}
