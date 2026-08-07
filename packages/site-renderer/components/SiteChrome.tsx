import type { NavPage, SiteContactSummary } from '@/lib/site-chrome';
import { hrefForPage, sanitizeMapUrl, telHref } from '@/lib/site-chrome';
import {
  resolveFooterLayout,
  toDirectionsUrl,
  type FooterProps,
} from '@nabhicares/section-layouts';
import { loadSiteData } from '@/lib/site-data';
import { normalizeSystemPages } from '@nabhicares/section-registry';

export function SiteHeader({
  hospitalName,
  currentSlug,
  pages,
  contact,
}: {
  hospitalName: string;
  currentSlug: string;
  pages: NavPage[];
  contact: SiteContactSummary;
}) {
  const isHome = currentSlug === 'home' || currentSlug === '';
  const homeHref = hrefForPage(currentSlug, 'home');
  const phone = contact.phone?.trim();

  return (
    <div className="nabhi-chrome-top">
      {phone ? (
        <div className="nabhi-emergency-bar">
          <a href={telHref(phone)} className="nabhi-emergency-left">
            <span className="material-symbols-outlined" aria-hidden>
              emergency
            </span>
            Emergency: {phone}
          </a>
          <a href={telHref(phone)} className="nabhi-emergency-right">
            <span className="material-symbols-outlined" aria-hidden>
              call
            </span>
            Call now
          </a>
        </div>
      ) : null}

      <header className="nabhi-site-header">
        <a href={homeHref} className="nabhi-site-brand">
          {hospitalName}
        </a>
        <nav className="nabhi-site-nav nabhi-site-nav-desktop" aria-label="Primary">
          {pages.map((p) => {
            const active = p.slug === currentSlug || (p.slug === 'home' && isHome);
            return (
              <a
                key={p.slug}
                href={hrefForPage(currentSlug, p.slug)}
                className={active ? 'nabhi-nav-link nabhi-nav-link-active' : 'nabhi-nav-link'}
              >
                {p.label}
              </a>
            );
          })}
          {phone ? (
            <a href={telHref(phone)} className="nabhi-nav-cta nabhi-btn">
              Call Now
            </a>
          ) : null}
        </nav>
        <details className="nabhi-menu">
          <summary className="nabhi-menu-btn" aria-label="Open menu">
            <span className="nabhi-menu-icon" aria-hidden>
              <span />
              <span />
              <span />
            </span>
          </summary>
          <nav className="nabhi-site-nav-mobile" aria-label="Mobile">
            {pages.map((p) => {
              const active = p.slug === currentSlug || (p.slug === 'home' && isHome);
              return (
                <a
                  key={p.slug}
                  href={hrefForPage(currentSlug, p.slug)}
                  className={active ? 'nabhi-nav-link nabhi-nav-link-active' : 'nabhi-nav-link'}
                >
                  {p.label}
                </a>
              );
            })}
            {phone ? (
              <a href={telHref(phone)} className="nabhi-nav-cta">
                Call Now
              </a>
            ) : null}
            <a href={isHome ? 'privacy/' : '../privacy/'} className="nabhi-nav-link">
              Privacy
            </a>
          </nav>
        </details>
      </header>
    </div>
  );
}

export function SiteFooter({
  hospitalName,
  currentSlug,
  pages,
  contact,
  layoutVersion,
}: {
  hospitalName: string;
  currentSlug: string;
  pages: NavPage[];
  contact: SiteContactSummary;
  /** Layout version — prefer page Footer section; else design token / 1 */
  layoutVersion?: number;
}) {
  const isHome = currentSlug === 'home' || currentSlug === '';
  const year = new Date().getFullYear();
  let version = layoutVersion;
  if (version == null) {
    try {
      const site = loadSiteData();
      for (const page of site.pages ?? []) {
        const footer = page.sections?.find((s: { type?: string }) => s.type === 'footer');
        if (footer) {
          version = Number((footer as { layoutVersion?: number }).layoutVersion) || 1;
          break;
        }
      }
      if (version == null) {
        version = normalizeSystemPages(site.designTokens?.systemPages).footer.layoutVersion;
      }
    } catch {
      version = 1;
    }
  }
  const FooterLayout = resolveFooterLayout(version);
  const props: FooterProps = {
    hospitalName,
    year,
    privacyHref: isHome ? 'privacy/' : '../privacy/',
    pages: pages.map((p) => ({
      slug: p.slug,
      label: p.label,
      href: hrefForPage(currentSlug, p.slug),
    })),
    contact: {
      phone: contact.phone,
      phoneHref: contact.phone ? telHref(contact.phone) : undefined,
      email: contact.email,
      address: contact.address,
      hours: contact.hours,
      directionsHref:
        toDirectionsUrl(contact.mapUrl, contact.address) ||
        sanitizeMapUrl(contact.mapUrl) ||
        undefined,
    },
  };
  return <FooterLayout {...props} />;
}
