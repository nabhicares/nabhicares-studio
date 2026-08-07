import type { FooterProps } from './types';
import { CallCta, wrapFooter } from './bits';

/** Slim horizontal bar: name · links · call */
export function Layout06(props: FooterProps) {
  return wrapFooter(
    6,
    <div className="nabhi-footer-inner nabhi-footer-slim">
      <div className="nabhi-footer-name">{props.hospitalName}</div>
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
      <CallCta contact={props.contact} />
    </div>,
    props,
  );
}
