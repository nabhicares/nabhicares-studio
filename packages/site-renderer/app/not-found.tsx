import type { CSSProperties } from 'react';
import { loadSiteData } from '@/lib/site-data';

export function generateMetadata() {
  const site = loadSiteData();
  return {
    title: `Page not found — ${site.hospitalName}`,
    description: `The page you requested was not found on the ${site.hospitalName} website.`,
  };
}

/**
 * Themed static 404 — exported as 404.html and served by the CDN when a
 * hospital page path is missing. Uses the same design tokens as the live site.
 */
export default function NotFoundPage() {
  const site = loadSiteData();
  const homeHref = `/${site.hospitalSlug}/`;
  const contactHref = `/${site.hospitalSlug}/contact/`;

  const wrap: CSSProperties = {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(2rem, 6vw, 4rem) clamp(1.25rem, 4vw, 2rem)',
    background:
      'radial-gradient(120% 80% at 10% 0%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 55%), var(--color-bg)',
  };

  return (
    <main className="nabhi-not-found" style={wrap}>
      <div className="nabhi-not-found-inner">
        <p className="nabhi-not-found-kicker">{site.hospitalName}</p>
        <p className="nabhi-not-found-code" aria-hidden>
          404
        </p>
        <h1 className="nabhi-not-found-title">Page not found</h1>
        <p className="nabhi-not-found-body">
          This link may be outdated, or the page hasn’t been published yet. Head home or reach the
          hospital team from the contact page.
        </p>
        <div className="nabhi-not-found-actions">
          <a href={homeHref} className="nabhi-btn nabhi-not-found-primary">
            Back to home
          </a>
          <a href={contactHref} className="nabhi-btn nabhi-not-found-secondary">
            Contact
          </a>
        </div>
      </div>
    </main>
  );
}
