import type { CSSProperties, ReactNode } from 'react';
import { loadSiteData, tokensToCssVars, resolvePublicOrigin, resolveOgImageUrl } from '@/lib/site-data';
import { DEFAULT_DESIGN_TOKENS } from '@nabhicares/section-registry';
import '../styles/nabhi-site.css';

function googleFontHrefFromTokens(displayFamily: string, bodyFamily: string): string | null {
  const normalize = (value: string) =>
    value
      .split(',')[0]
      ?.trim()
      .replace(/^['"]|['"]$/g, '');
  const families = [normalize(displayFamily), normalize(bodyFamily)].filter(
    (name): name is string => Boolean(name && name.length > 0),
  );
  const unique = Array.from(new Set(families));
  if (unique.length === 0) return null;
  const parts = unique.map((name) => `family=${encodeURIComponent(name).replace(/%20/g, '+')}:wght@400;500;600;700`);
  return `https://fonts.googleapis.com/css2?${parts.join('&')}&display=swap`;
}

export function generateMetadata() {
  const site = loadSiteData();
  const title = site.seoTitle?.trim() || site.hospitalName;
  const description =
    site.seoDescription?.trim() ||
    `${site.hospitalName} — hospital website published with Nabhi Studio`;
  const origin = resolvePublicOrigin(site);
  const ogImage = resolveOgImageUrl(site);
  const base = process.env.SITE_BASE_PATH?.replace(/\/$/, '') || '';

  return {
    metadataBase: new URL(origin),
    title,
    description,
    icons: {
      icon: [{ url: `${base}/favicon.svg`, type: 'image/svg+xml' }],
    },
    openGraph: {
      title,
      description,
      url: '/',
      siteName: site.hospitalName,
      type: 'website',
      locale: 'en_IN',
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const site = loadSiteData();
  const tokens = site.designTokens ?? DEFAULT_DESIGN_TOKENS;
  const cssVars = tokensToCssVars(tokens);
  const fontHref = googleFontHrefFromTokens(
    tokens.typography.displayFamily,
    tokens.typography.bodyFamily,
  );
  const origin = resolvePublicOrigin(site);
  const ogImage = resolveOgImageUrl(site);
  const title = site.seoTitle?.trim() || site.hospitalName;
  const description =
    site.seoDescription?.trim() ||
    `${site.hospitalName} — hospital website published with Nabhi Studio`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: site.hospitalName,
    url: origin,
    description: site.seoDescription || undefined,
    image: ogImage || undefined,
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {fontHref ? <link rel="stylesheet" href={fontHref} /> : null}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,500,0,0&display=swap"
        />
        {/* Explicit tags so static crawlers (WhatsApp/Meta) always see absolute card fields */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={origin} />
        <meta property="og:site_name" content={site.hospitalName} />
        {ogImage ? <meta property="og:image" content={ogImage} /> : null}
        {ogImage ? <meta property="og:image:width" content="1200" /> : null}
        {ogImage ? <meta property="og:image:height" content="630" /> : null}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}
      </head>
      <body
        style={
          {
            margin: 0,
            background: 'var(--color-bg)',
            color: 'var(--color-fg)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--font-size-base)',
          } as CSSProperties
        }
      >
        <style>{`:root { ${cssVars} }`}</style>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div hidden data-nabhi-built-at={site.builtAt ?? ''} />
        {children}
      </body>
    </html>
  );
}
