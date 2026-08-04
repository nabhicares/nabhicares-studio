import type { CSSProperties, ReactNode } from 'react';
import { loadSiteData, tokensToCssVars } from '@/lib/site-data';
import { DEFAULT_DESIGN_TOKENS } from '@nabhicares/section-registry';

export function generateMetadata() {
  const site = loadSiteData();
  const title = site.seoTitle?.trim() || site.hospitalName;
  const description =
    site.seoDescription?.trim() ||
    `${site.hospitalName} — hospital website published with Nabhi Studio`;
  return {
    title,
    description,
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
