# BeastTouch

This repository contains an independent Next.js sneaker concept in `beasttouch/` and a separate [investigation](investigation/REPORT.md) of the public Finely Crafted court experience. The investigation is reference evidence, not implementation code or an asset license.

## Run locally

Use a Node.js release supported by Next.js 16. In `beasttouch/`:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open <http://127.0.0.1:3000>. Run `npm run typecheck` and `npm run build` before deployment. `npm run start` serves the production build. The app now uses a Next.js server so it can render pages on the server, handle contact submissions, optimize images, and issue HTTP redirects. The previous static `out/` hosting configuration was removed; deploy to a host that runs Next.js request handlers.

## Production configuration

Set these environment variables before the production build. Keep `RESEND_API_KEY` server-side; do not prefix it with `NEXT_PUBLIC_`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Required HTTPS origin for canonical URLs, sitemap, Open Graph URLs, and indexing. Example: `https://www.yourdomain.com`. |
| `RESEND_API_KEY` | Resend API key for contact email delivery. |
| `CONTACT_TO_EMAIL` | Recipient mailbox for contact submissions. |
| `CONTACT_FROM_EMAIL` | Sender address on a domain verified with Resend. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional GA4 ID (`G-...`). Analytics loads only after a visitor opts in. |
| `GOOGLE_SITE_VERIFICATION` | Optional Search Console HTML meta verification token. |

Without a valid production URL, the app emits `noindex`, `robots.txt` disallows crawlers, and `sitemap.xml` lists no URLs. Without the three contact email settings, `/api/contact` returns 503 and the form reports that delivery is unavailable. Google Analytics and Search Console verification are inactive until their values are supplied. After deployment, verify the Search Console property and submit `/sitemap.xml` in Google Search Console; code cannot complete those account-side steps.

## SEO and site features

The home, About, Contact, and Privacy routes render HTML and each has one H1, a distinct title and description, canonical metadata, internal links, and social metadata. The app provides `robots.txt`, `sitemap.xml`, a generated Open Graph image, organization and breadcrumb structured data, a custom 404 page, and 301 redirects from `/our-story`, `/reach-us`, and `/legal/privacy`. Product dialog images use `next/image` with descriptive alt text, lazy loading, and WebP optimization. The 3D court remains client rendered inside the server rendered page.

The [privacy notice](beasttouch/app/privacy/page.tsx) describes local saved selections, contact email delivery, and optional analytics. Review it against your final business identity and data practices before launch. The [asset provenance record](beasttouch/docs/asset-provenance.md) notes that the sneaker PNG's origin and use rights are still unverified.

## Project guidance

- [Agent responsibilities](AGENTS.md)
- [Three-agent work plan](agent.md)
- [3D inspiration and implementation guidance](skills.md)
- [Asset provenance](beasttouch/docs/asset-provenance.md)
- [Visual and interaction validation](beasttouch/docs/validation.md)

Do not copy the downloaded geometry, textures, shaders, fonts, logos, sound, or video from `investigation/evidence/` into the app.
