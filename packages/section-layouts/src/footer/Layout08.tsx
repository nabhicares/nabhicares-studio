import type { FooterProps } from './types';
import { BrandBlock, CallCta, wrapFooter } from './bits';

/** Split: brand+address left · large phone CTA right · link row */
export function Layout08(props: FooterProps) {
  return wrapFooter(
    8,
    <div className="nabhi-footer-inner nabhi-footer-heroish">
      <div className="nabhi-footer-heroish-top">
        <BrandBlock hospitalName={props.hospitalName} contact={props.contact} tagline={props.tagline} />
        <div className="nabhi-footer-heroish-cta">
          <CallCta contact={props.contact} />
          {props.contact.directionsHref ? (
            <a
              href={props.contact.directionsHref}
              className="nabhi-btn nabhi-footer-cta-ghost"
              target="_blank"
              rel="noreferrer"
            >
              Directions
            </a>
          ) : null}
        </div>
      </div>
      <nav className="nabhi-footer-nav-row" aria-label="Footer">
        {props.pages.map((p) => (
          <a key={p.slug} href={p.href} className="nabhi-footer-link">
            {p.label}
          </a>
        ))}
        <a href={props.privacyHref} className="nabhi-footer-link">
          Privacy
        </a>
        {props.contact.email ? (
          <a href={`mailto:${props.contact.email}`} className="nabhi-footer-link">
            {props.contact.email}
          </a>
        ) : null}
      </nav>
    </div>,
    props,
  );
}
