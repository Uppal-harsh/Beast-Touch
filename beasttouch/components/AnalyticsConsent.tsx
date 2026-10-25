'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const storageKey = 'beasttouch-analytics-consent';
type Choice = 'accepted' | 'declined' | null;
type Gtag = (command: string, action: string | Date, params?: Record<string, unknown>) => void;
type AnalyticsWindow = Window & { dataLayer?: unknown[][]; gtag?: Gtag };

export function AnalyticsConsent({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const enabled = /^G-[A-Z0-9]+$/.test(measurementId);
  const [choice, setChoice] = useState<Choice>(null);
  const [loaded, setLoaded] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'accepted' || saved === 'declined') setChoice(saved);
    } catch { /* Storage may be unavailable; the choice still works for this visit. */ }
    const reopen = () => setChoice(null);
    window.addEventListener('beasttouch:analytics-settings', reopen);
    setReady(true);
    return () => window.removeEventListener('beasttouch:analytics-settings', reopen);
  }, [enabled]);

  useEffect(() => {
    if (!enabled || choice !== 'accepted' || initialized) return;
    const analyticsWindow = window as AnalyticsWindow;
    Object.assign(window, { [`ga-disable-${measurementId}`]: false });
    analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
    analyticsWindow.gtag = (...args) => { analyticsWindow.dataLayer?.push(args); };
    analyticsWindow.gtag('js', new Date());
    analyticsWindow.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    analyticsWindow.gtag('config', measurementId, { send_page_view: false });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
    setInitialized(true);
  }, [choice, enabled, initialized, measurementId]);

  useEffect(() => {
    if (!enabled || !loaded || choice !== 'accepted') return;
    (window as AnalyticsWindow).gtag?.('event', 'page_view', { page_path: pathname });
  }, [choice, enabled, loaded, pathname]);

  if (!enabled || !ready || choice !== null) return null;

  function choose(next: Exclude<Choice, null>) {
    if (next === 'declined' && initialized) {
      (window as AnalyticsWindow).gtag?.('consent', 'update', { analytics_storage: 'denied' });
      Object.assign(window, { [`ga-disable-${measurementId}`]: true });
    }
    if (next === 'accepted' && initialized) {
      Object.assign(window, { [`ga-disable-${measurementId}`]: false });
      (window as AnalyticsWindow).gtag?.('consent', 'update', { analytics_storage: 'granted' });
    }
    try { localStorage.setItem(storageKey, next); } catch { /* Keep the in-memory choice. */ }
    setChoice(next);
  }

  return <div className="consent-banner" role="dialog" aria-label="Analytics choice">
    <p>May we use optional analytics to understand visits? You can change this choice on the <a href="/privacy">privacy page</a>.</p>
    <div><button type="button" onClick={() => choose('declined')}>No thanks</button><button type="button" onClick={() => choose('accepted')}>Allow analytics</button></div>
  </div>;
}
