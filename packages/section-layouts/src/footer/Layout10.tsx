import type { FooterProps } from './types';
import { wrapFooter } from './bits';

/** Minimal single strip: name · links · bottom credit */
export function Layout10(props: FooterProps) {
  return wrapFooter(
    10,
    <div className="nabhi-footer-inner nabhi-footer-minimal">
      <span className="nabhi-footer-name">{props.hospitalName}</span>
      <nav className="nabhi-footer-nav-row" aria-label="Footer">
        {props.pages.slice(0, 4).map((p) => (
          <a key={p.slug} href={p.href} className="nabhi-footer-link">
            {p.label}
          </a>
        ))}
        <a href={props.privacyHref} className="nabhi-footer-link">
          Privacy
        </a>
      </nav>
    </div>,
    props,
  );
}
