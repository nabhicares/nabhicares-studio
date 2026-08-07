import type { NavPage, SiteContactSummary } from '@/lib/site-chrome';
import { hrefForPage, sanitizeMapUrl, telHref } from '@/lib/site-chrome';
import { toDirectionsUrl } from '@nabhicares/section-layouts';

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
          <summary className="nabhi-menu-btn">Menu</summary>
          <nav className="nabhi-site-nav-mobile" aria-label="Mobile">
            {pages.map((p) => (
              <a key={p.slug} href={hrefForPage(currentSlug, p.slug)} className="nabhi-nav-link">
                {p.label}
              </a>
            ))}
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
}: {
  hospitalName: string;
  currentSlug: string;
  pages: NavPage[];
  contact: SiteContactSummary;
}) {
  const isHome = currentSlug === 'home' || currentSlug === '';
  const year = new Date().getFullYear();
  return (
    <footer className="nabhi-site-footer">
      <div className="nabhi-footer-inner">
        <div className="nabhi-footer-brand">
          <div className="nabhi-footer-name">{hospitalName}</div>
          {contact.address ? <p className="nabhi-footer-meta">{contact.address}</p> : null}
          {contact.hours ? (
            <p className="nabhi-footer-meta" style={{ whiteSpace: 'pre-line' }}>
              {contact.hours}
            </p>
          ) : null}
        </div>
        <div className="nabhi-footer-col">
          <div className="nabhi-footer-label">Explore</div>
          {pages.map((p) => (
            <a key={p.slug} href={hrefForPage(currentSlug, p.slug)} className="nabhi-footer-link">
              {p.label}
            </a>
          ))}
          <a href={isHome ? 'privacy/' : '../privacy/'} className="nabhi-footer-link">
            Privacy
          </a>
        </div>
        <div className="nabhi-footer-col">
          <div className="nabhi-footer-label">Visit</div>
          {contact.phone ? (
            <a href={telHref(contact.phone)} className="nabhi-footer-link">
              Emergency: {contact.phone}
            </a>
          ) : null}
          {contact.email ? (
            <a href={`mailto:${contact.email}`} className="nabhi-footer-link">
              {contact.email}
            </a>
          ) : null}
          {contact.mapUrl || contact.address ? (
            <a
              href={
                toDirectionsUrl(contact.mapUrl, contact.address) ||
                sanitizeMapUrl(contact.mapUrl) ||
                '#'
              }
              className="nabhi-footer-link"
              target="_blank"
              rel="noreferrer"
            >
              Directions
            </a>
          ) : null}
          {!contact.phone && !contact.email && !contact.mapUrl && !contact.address ? (
            <span className="nabhi-footer-meta">Add contact details in Studio</span>
          ) : null}
        </div>
      </div>
      <div className="nabhi-footer-bottom">
        <span>
          © {year} {hospitalName}. All rights reserved.
        </span>
        <span className="nabhi-footer-credit">
          Website by{' '}
          <a href="https://www.nabhilabs.com" target="_blank" rel="noreferrer">
            Nabhi Labs
          </a>
        </span>
      </div>
    </footer>
  );
}
