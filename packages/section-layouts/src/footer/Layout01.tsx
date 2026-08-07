import type { FooterProps } from './types';
import { BrandBlock, ExploreLinks, VisitLinks, wrapFooter } from './bits';

/** Classic three-column: brand Â· explore Â· visit */
export function Layout01(props: FooterProps) {
  return wrapFooter(
    1,
    <div className="nabhi-footer-inner">
      <BrandBlock hospitalName={props.hospitalName} contact={props.contact} tagline={props.tagline} />
      <ExploreLinks pages={props.pages} privacyHref={props.privacyHref} />
      <VisitLinks contact={props.contact} />
    </div>,
    props,
  );
}
