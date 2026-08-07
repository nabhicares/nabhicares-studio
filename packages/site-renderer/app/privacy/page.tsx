import { loadSiteData } from '@/lib/site-data';
import { extractContactSummary, hrefForPage, navPagesFromSite } from '@/lib/site-chrome';
import { SiteFooter, SiteHeader } from '@/components/SiteChrome';
import { ConsentBanner } from '@/components/ConsentBanner';
import { PrivacyView } from '@nabhicares/section-layouts';
import { normalizeSystemPages } from '@nabhicares/section-registry';

export function generateMetadata() {
  const site = loadSiteData();
  const privacy = normalizeSystemPages(site.designTokens?.systemPages).privacy;
  return {
    title: `${privacy.title} — ${site.hospitalName}`,
    description: `Privacy notice for the ${site.hospitalName} website (DPDP-aligned)`,
  };
}

/** Privacy template — copy/layout from Design → System pages. */
export default function PrivacyPage() {
  const site = loadSiteData();
  const cfg = normalizeSystemPages(site.designTokens?.systemPages).privacy;
  const pages = navPagesFromSite(site.pages);
  const contact = extractContactSummary(site.pages);
  const privacyHref = hrefForPage('privacy', 'privacy');

  return (
    <>
      <SiteHeader
        hospitalName={site.hospitalName}
        currentSlug="privacy"
        pages={pages}
        contact={contact}
      />
      <PrivacyView
        hospitalName={site.hospitalName}
        title={cfg.title}
        intro={cfg.intro}
        formsNote={cfg.formsNote}
        rightsNote={cfg.rightsNote}
        homeHref={hrefForPage('privacy', 'home')}
        contactPhone={contact.phone}
        contactEmail={contact.email}
        layoutVersion={cfg.layoutVersion}
      />
      <SiteFooter
        hospitalName={site.hospitalName}
        currentSlug="privacy"
        pages={pages}
        contact={contact}
      />
      <ConsentBanner hospitalName={site.hospitalName} privacyHref={privacyHref} />
    </>
  );
}
