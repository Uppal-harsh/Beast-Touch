import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  images: { formats: ['image/webp'] },
  async redirects() {
    return [
      { source: '/our-story', destination: '/about', statusCode: 301 },
      { source: '/reach-us', destination: '/contact', statusCode: 301 },
      { source: '/legal/privacy', destination: '/privacy', statusCode: 301 },
    ];
  },
};
export default nextConfig;
