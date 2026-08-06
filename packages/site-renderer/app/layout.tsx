import type { CSSProperties, ReactNode } from 'react';
import { loadSiteData, tokensToCssVars } from '@/lib/site-data';
import { DEFAULT_DESIGN_TOKENS } from '@nabhicares/section-registry';

export function generateMetadata() {
  const site = loadSiteData();
  const title = site.seoTitle?.trim() || site.hospitalName;
  const description =
    site.seoDescription?.trim() ||
    `${site.hospitalName} — hospital website published with Nabhi Studio`;
  const base = process.env.SITE_BASE_PATH?.replace(/\/$/, '') || '';
  return {
    title,
    description,
    icons: {
      icon: [{ url: `${base}/favicon.svg`, type: 'image/svg+xml' }],
    },
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const site = loadSiteData();
  const tokens = site.designTokens ?? DEFAULT_DESIGN_TOKENS;
  const cssVars = tokensToCssVars(tokens);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: site.hospitalName,
    url: `/${site.hospitalSlug}/`,
    description: site.seoDescription || undefined,
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
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
