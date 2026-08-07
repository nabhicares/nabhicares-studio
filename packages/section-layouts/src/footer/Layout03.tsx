import type { FooterProps } from './types';
import { ExploreLinks, VisitLinks, wrapFooter } from './bits';

/** Compact accent band â€” name + two columns */
export function Layout03(props: FooterProps) {
  return wrapFooter(
    3,
    <div className="nabhi-footer-inner nabhi-footer-band">
      <div className="nabhi-footer-brand">
        <div className="nabhi-footer-name">{props.hospitalName}</div>
        {props.contact.address ? <p className="nabhi-footer-meta">{props.contact.address}</p> : null}
      </div>
      <ExploreLinks pages={props.pages} privacyHref={props.privacyHref} />
      <VisitLinks contact={props.contact} />
    </div>,
    props,
  );
}
