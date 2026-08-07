import type { ReactElement, ReactNode } from 'react';
import type { FooterContact, FooterNavLink, FooterProps } from './types';

export function FooterCredit(): ReactElement {
  return (
    <span className="nabhi-footer-credit">
      Website by{' '}
      <a href="https://www.nabhilabs.com" target="_blank" rel="noreferrer">
        Nabhi Labs
      </a>
    </span>
  );
}

export function FooterBottom({
  hospitalName,
  year,
  extra,
}: {
  hospitalName: string;
  year: number;
  extra?: ReactNode;
}): ReactElement {
  return (
    <div className="nabhi-footer-bottom">
      <span>
        © {year} {hospitalName}. All rights reserved.
      </span>
      {extra ?? <FooterCredit />}
    </div>
  );
}

export function ExploreLinks({
  pages,
  privacyHref,
}: {
  pages: FooterNavLink[];
  privacyHref: string;
}): ReactElement {
  return (
    <div className="nabhi-footer-col">
      <div className="nabhi-footer-label">Explore</div>
      {pages.map((p) => (
        <a key={p.slug} href={p.href} className="nabhi-footer-link">
          {p.label}
        </a>
      ))}
      <a href={privacyHref} className="nabhi-footer-link">
        Privacy
      </a>
    </div>
  );
}

export function VisitLinks({ contact }: { contact: FooterContact }): ReactElement {
  const empty = !contact.phone && !contact.email && !contact.directionsHref && !contact.address;
  return (
    <div className="nabhi-footer-col">
      <div className="nabhi-footer-label">Visit</div>
      {contact.phone && contact.phoneHref ? (
        <a href={contact.phoneHref} className="nabhi-footer-link">
          Emergency: {contact.phone}
        </a>
      ) : null}
      {contact.email ? (
        <a href={`mailto:${contact.email}`} className="nabhi-footer-link">
          {contact.email}
        </a>
      ) : null}
      {contact.directionsHref ? (
        <a
          href={contact.directionsHref}
          className="nabhi-footer-link"
          target="_blank"
          rel="noreferrer"
        >
          Directions
        </a>
      ) : null}
      {empty ? <span className="nabhi-footer-meta">Add contact details in Studio</span> : null}
    </div>
  );
}

export function BrandBlock({
  hospitalName,
  contact,
  showHours = true,
  tagline,
}: {
  hospitalName: string;
  contact: FooterContact;
  showHours?: boolean;
  tagline?: string;
}): ReactElement {
  return (
    <div className="nabhi-footer-brand">
      <div className="nabhi-footer-name">{hospitalName}</div>
      {tagline ? <p className="nabhi-footer-meta">{tagline}</p> : null}
      {contact.address ? <p className="nabhi-footer-meta">{contact.address}</p> : null}
      {showHours && contact.hours ? (
        <p className="nabhi-footer-meta" style={{ whiteSpace: 'pre-line' }}>
          {contact.hours}
        </p>
      ) : null}
    </div>
  );
}

export function CallCta({ contact }: { contact: FooterContact }): ReactElement | null {
  if (!contact.phone || !contact.phoneHref) return null;
  return (
    <a href={contact.phoneHref} className="nabhi-btn nabhi-footer-cta">
      <span className="material-symbols-outlined" aria-hidden>
        call
      </span>
      Call {contact.phone}
    </a>
  );
}

export function wrapFooter(layout: number, children: ReactNode, props: FooterProps): ReactElement {
  return (
    <footer className={`nabhi-site-footer nabhi-footer-l${String(layout).padStart(2, '0')}`}>
      {children}
      <FooterBottom hospitalName={props.hospitalName} year={props.year} />
    </footer>
  );
}
