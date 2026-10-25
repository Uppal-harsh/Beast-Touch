import Link from 'next/link';

export default function NotFound() {
  return <main className="not-found-page">
    <span className="content-eyebrow">BEASTTOUCH / 404</span>
    <h1>Wrong turn.</h1>
    <p>There is no page at this address. Head back to the court or find another way through.</p>
    <div><Link href="/">Return home</Link><Link href="/contact">Contact us</Link></div>
  </main>;
}
