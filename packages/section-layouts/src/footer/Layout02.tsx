import type { FooterProps } from './types';
import { BrandBlock, CallCta, wrapFooter } from './bits';

/** Centered stack: brand, nav pills, contact, bottom */
export function Layout02(props: FooterProps) {
  return wrapFooter(
    2,
    <div className="nabhi-footer-inner nabhi-footer-centered">
      <BrandBlock hospitalName={props.hospitalName} contact={props.contact} showHours={false} tagline={props.tagline} />
      <nav className="nabhi-footer-nav-row" aria-label="Footer">
        {props.pages.map((p) => (
          <a key={p.slug} href={p.href} className="nabhi-footer-link">
            {p.label}
          </a>
        ))}
        <a href={props.privacyHref} className="nabhi-footer-link">
          Privacy
        </a>
      </nav>
      <div className="nabhi-footer-contact-row">
        {props.contact.phone && props.contact.phoneHref ? (
          <a href={props.contact.phoneHref} className="nabhi-footer-link">
            {props.contact.phone}
          </a>
        ) : null}
        {props.contact.email ? (
          <a href={`mailto:${props.contact.email}`} className="nabhi-footer-link">
            {props.contact.email}
          </a>
        ) : null}
        {props.contact.address ? (
          <span className="nabhi-footer-meta">{props.contact.address}</span>
        ) : null}
      </div>
      <CallCta contact={props.contact} />
    </div>,
    props,
  );
}
