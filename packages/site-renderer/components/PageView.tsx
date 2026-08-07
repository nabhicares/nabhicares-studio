import type { SitePage } from '@/lib/types';
import { SectionRenderer } from './SectionRenderer';
import { SiteFooter, SiteHeader } from './SiteChrome';
import { ConsentBanner } from './ConsentBanner';
import {
  extractContactSummary,
  hrefForPage,
  navPagesFromSite,
  type NavPage,
  type SiteContactSummary,
} from '@/lib/site-chrome';

export function PageView({
  hospitalName,
  hospitalSlug,
  page,
  pages = [],
  contact,
}: {
  hospitalName: string;
  hospitalSlug?: string;
  page: SitePage;
  pages?: { slug: string }[];
  contact?: SiteContactSummary;
}) {
  const navPages: NavPage[] =
    pages.length > 0
      ? navPagesFromSite(pages)
      : [{ slug: page.slug || 'home', label: page.slug === 'home' || !page.slug ? 'Home' : page.slug }];
  const contactSummary = contact ?? extractContactSummary([page]);
  const privacyHref = hrefForPage(page.slug, 'privacy');
  const hasFooterSection = page.sections.some((s) => s.type === 'footer');
  const footerLayoutVersion = page.sections.find((s) => s.type === 'footer')?.layoutVersion;

  return (
    <>
      <SiteHeader
        hospitalName={hospitalName}
        currentSlug={page.slug}
        pages={navPages}
        contact={contactSummary}
      />

      <main style={{ width: '100%' }}>
        {page.sections.length === 0 ? (
          <p
            style={{
              color: 'var(--color-muted)',
              padding: 'var(--space-section-y) clamp(1.25rem, 4vw, 2rem)',
              fontFamily: 'var(--font-body)',
            }}
          >
            No enabled sections on this page.
          </p>
        ) : (
          page.sections.map((section, index) => (
            <SectionRenderer
              key={section.id}
              section={section}
              pageSlug={page.slug}
              index={index}
              hospitalSlug={hospitalSlug}
              hospitalName={hospitalName}
              pages={navPages}
              contact={contactSummary}
            />
          ))
        )}
      </main>

      {/* Chrome fallback when the page has no Footer section yet */}
      {!hasFooterSection ? (
        <SiteFooter
          hospitalName={hospitalName}
          currentSlug={page.slug}
          pages={navPages}
          contact={contactSummary}
          layoutVersion={footerLayoutVersion}
        />
      ) : null}
      <ConsentBanner hospitalName={hospitalName} privacyHref={privacyHref} />
    </>
  );
}
