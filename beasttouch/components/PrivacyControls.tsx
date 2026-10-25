'use client';

export function PrivacyControls() {
  if (!/^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '')) return <p>Analytics is not active on this site.</p>;
  return <button className="privacy-control" type="button" onClick={() => window.dispatchEvent(new Event('beasttouch:analytics-settings'))}>Change analytics choice</button>;
}
