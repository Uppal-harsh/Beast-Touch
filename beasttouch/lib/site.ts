export const siteName = 'BeastTouch';
export const siteDescription = 'BeastTouch is an independent sneaker concept shaped by Indian streets, woven details, and everyday movement.';

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
let parsedUrl: URL | null = null;
try {
  if (configuredUrl) {
    const candidate = new URL(configuredUrl);
    if (candidate.protocol === 'http:' || candidate.protocol === 'https:') parsedUrl = new URL(candidate.origin);
  }
} catch {
  // Keep preview builds unindexed until a valid production URL is configured.
}

export const hasProductionUrl = !!parsedUrl && parsedUrl.protocol === 'https:' && !parsedUrl.hostname.endsWith('.example') && !['localhost', '127.0.0.1'].includes(parsedUrl.hostname);
export const siteUrl = parsedUrl ?? new URL('http://localhost:3000');
export const absoluteUrl = (path: string) => new URL(path, siteUrl).toString();
