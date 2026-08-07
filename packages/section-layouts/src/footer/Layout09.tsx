import type { FooterProps } from './types';
import { BrandBlock, ExploreLinks, VisitLinks, wrapFooter } from './bits';

/** Elevated card columns on surface band */
export function Layout09(props: FooterProps) {
  return wrapFooter(
    9,
    <div className="nabhi-footer-inner nabhi-footer-cards">
      <div className="nabhi-footer-card">
        <BrandBlock hospitalName={props.hospitalName} contact={props.contact} tagline={props.tagline} />
      </div>
      <div className="nabhi-footer-card">
        <ExploreLinks pages={props.pages} privacyHref={props.privacyHref} />
      </div>
      <div className="nabhi-footer-card">
        <VisitLinks contact={props.contact} />
      </div>
    </div>,
    props,
  );
}
