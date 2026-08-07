import type { FooterProps } from './types';
import { BrandBlock, CallCta, wrapFooter } from './bits';

/** Brand left · stacked links + visit right */
export function Layout04(props: FooterProps) {
  return wrapFooter(
    4,
    <div className="nabhi-footer-inner nabhi-footer-split">
      <div className="nabhi-footer-split-left">
        <BrandBlock hospitalName={props.hospitalName} contact={props.contact} tagline={props.tagline} />
        <CallCta contact={props.contact} />
      </div>
      <div className="nabhi-footer-split-right">
        <div className="nabhi-footer-col">
          <div className="nabhi-footer-label">Explore</div>
          {props.pages.map((p) => (
            <a key={p.slug} href={p.href} className="nabhi-footer-link">
              {p.label}
            </a>
          ))}
          <a href={props.privacyHref} className="nabhi-footer-link">
            Privacy
          </a>
        </div>
        <div className="nabhi-footer-col">
          <div className="nabhi-footer-label">Visit</div>
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
          {props.contact.directionsHref ? (
            <a
              href={props.contact.directionsHref}
              className="nabhi-footer-link"
              target="_blank"
              rel="noreferrer"
            >
              Directions
            </a>
          ) : null}
        </div>
      </div>
    </div>,
    props,
  );
}
