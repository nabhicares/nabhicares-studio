import { loadSiteData } from '@/lib/site-data';
import { NotFoundView } from '@nabhicares/section-layouts';
import { normalizeSystemPages } from '@nabhicares/section-registry';

export function generateMetadata() {
  const site = loadSiteData();
  const pages = normalizeSystemPages(site.designTokens?.systemPages);
  return {
    title: `${pages.notFound.title} — ${site.hospitalName}`,
    description: pages.notFound.body.slice(0, 160),
  };
}

/**
 * Themed static 404 — exported as 404.html and served by the CDN when a
 * hospital page path is missing. Copy/layout come from Design → System pages.
 */
export default function NotFoundPage() {
  const site = loadSiteData();
  const cfg = normalizeSystemPages(site.designTokens?.systemPages).notFound;
  return (
    <NotFoundView
      hospitalName={site.hospitalName}
      title={cfg.title}
      body={cfg.body}
      primaryCta={cfg.primaryCta}
      secondaryCta={cfg.secondaryCta}
      homeHref={`/${site.hospitalSlug}/`}
      contactHref={`/${site.hospitalSlug}/contact/`}
      layoutVersion={cfg.layoutVersion}
    />
  );
}
