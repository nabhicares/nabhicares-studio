import type { CSSProperties } from 'react';
import Link from 'next/link';
import { loadSiteData } from '@/lib/site-data';
import { extractContactSummary, navPagesFromSite } from '@/lib/site-chrome';
import { SiteFooter, SiteHeader } from '@/components/SiteChrome';

export function generateMetadata() {
  const site = loadSiteData();
  return {
    title: `Privacy — ${site.hospitalName}`,
    description: `Privacy notice for the ${site.hospitalName} website`,
  };
}

/** Default privacy template for published marketing sites. Hospitals should replace with counsel-approved text. */
export default function PrivacyPage() {
  const site = loadSiteData();
  const wrap: CSSProperties = {
    maxWidth: 720,
    margin: '0 auto',
    padding: '3rem 1.5rem',
    fontFamily: 'var(--font-body)',
    color: 'var(--color-fg)',
    lineHeight: 1.6,
  };
  const pages = navPagesFromSite(site.pages);
  const contact = extractContactSummary(site.pages);

  return (
    <>
      <SiteHeader
        hospitalName={site.hospitalName}
        currentSlug="privacy"
        pages={pages}
        contact={contact}
      />
      <main style={wrap}>
        <p style={{ marginBottom: '1.5rem' }}>
          <Link href="/" style={{ color: 'var(--color-accent)' }}>
            ← {site.hospitalName}
          </Link>
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem' }}>Privacy notice</h1>
        <p style={{ color: 'var(--color-muted)' }}>
          This website is a public marketing site for {site.hospitalName}. It is not a patient
          portal and is not intended to collect clinical health records.
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginTop: '2rem' }}>
          Information on this site
        </h2>
        <p>
          Content may include staff names, photos, biographies, and patient testimonials that the
          hospital has chosen to publish. If you believe information about you appears here without
          consent, contact the hospital using the details on this website and request removal.
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginTop: '2rem' }}>
          Contact forms and cookies
        </h2>
        <p>
          If this site later adds contact or appointment forms, or analytics cookies, the hospital
          will update this page with purpose, retention, and consent details before those features
          go live.
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginTop: '2rem' }}>
          Platform
        </h2>
        <p>
          This site is published with Nabhi Studio. The platform operator processes site content to
          host and deliver these pages. Clinical systems (if any) are separate.
        </p>
        <p style={{ marginTop: '2rem', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
          Template notice — replace with counsel-approved language before relying on this page in
          production.
        </p>
      </main>
      <SiteFooter
        hospitalName={site.hospitalName}
        currentSlug="privacy"
        pages={pages}
        contact={contact}
      />
    </>
  );
}
