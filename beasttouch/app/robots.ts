import type { MetadataRoute } from 'next';
import { absoluteUrl, hasProductionUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  if (!hasProductionUrl) return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: '/' }, sitemap: absoluteUrl('/sitemap.xml') };
}
