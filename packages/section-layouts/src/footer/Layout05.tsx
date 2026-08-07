import type { FooterProps } from './types';
import { BrandBlock, ExploreLinks, VisitLinks, wrapFooter } from './bits';

/** Four columns: brand Â· explore Â· visit Â· hours */
export function Layout05(props: FooterProps) {
  return wrapFooter(
    5,
    <div className="nabhi-footer-inner nabhi-footer-quad">
      <BrandBlock hospitalName={props.hospitalName} contact={props.contact} showHours={false} tagline={props.tagline} />
      <ExploreLinks pages={props.pages} privacyHref={props.privacyHref} />
      <VisitLinks contact={props.contact} />
      <div className="nabhi-footer-col">
        <div className="nabhi-footer-label">Hours</div>
        {props.contact.hours ? (
          <p className="nabhi-footer-meta" style={{ whiteSpace: 'pre-line' }}>
            {props.contact.hours}
          </p>
        ) : (
          <span className="nabhi-footer-meta">Add hours in Contact</span>
        )}
      </div>
    </div>,
    props,
  );
}
