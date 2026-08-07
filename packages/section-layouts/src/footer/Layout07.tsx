import type { FooterProps } from './types';
import { BrandBlock, CallCta, ExploreLinks, VisitLinks, wrapFooter } from './bits';

/** Call strip above classic columns */
export function Layout07(props: FooterProps) {
  return wrapFooter(
    7,
    <>
      <div className="nabhi-footer-callout">
        <div>
          <div className="nabhi-footer-label">Need care now?</div>
          <p className="nabhi-footer-meta" style={{ margin: 0 }}>
            Call our emergency line â€” we&apos;re here around the clock when listed in Contact.
          </p>
        </div>
        <CallCta contact={props.contact} />
      </div>
      <div className="nabhi-footer-inner">
        <BrandBlock hospitalName={props.hospitalName} contact={props.contact} tagline={props.tagline} />
        <ExploreLinks pages={props.pages} privacyHref={props.privacyHref} />
        <VisitLinks contact={props.contact} />
      </div>
    </>,
    props,
  );
}
