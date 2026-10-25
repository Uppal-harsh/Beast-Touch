import type { MetadataRoute } from 'next';
import { absoluteUrl, hasProductionUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!hasProductionUrl) return [];
  return [
    { url: absoluteUrl('/'), changeFrequency: 'monthly', priority: 1 },
    { url: absoluteUrl('/about'), changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/contact'), changeFrequency: 'yearly', priority: 0.5 },
    { url: absoluteUrl('/privacy'), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
