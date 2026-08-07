import { createElement } from 'react';
import type { LayoutComponent, LayoutProps } from '../types';
import { telHref, toDirectionsUrl, sanitizeMapUrl } from '../links';
import type { FooterLayoutComponent, FooterProps } from './types';
import { Layout01 } from './Layout01';
import { Layout02 } from './Layout02';
import { Layout03 } from './Layout03';
import { Layout04 } from './Layout04';
import { Layout05 } from './Layout05';
import { Layout06 } from './Layout06';
import { Layout07 } from './Layout07';
import { Layout08 } from './Layout08';
import { Layout09 } from './Layout09';
import { Layout10 } from './Layout10';

const FOOTER_LAYOUTS: Record<number, FooterLayoutComponent> = {
  1: Layout01,
  2: Layout02,
  3: Layout03,
  4: Layout04,
  5: Layout05,
  6: Layout06,
  7: Layout07,
  8: Layout08,
  9: Layout09,
  10: Layout10,
};

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

/** Build chrome footer props from a page section's LayoutProps. */
export function footerPropsFromLayout(props: LayoutProps): FooterProps {
  const c = props.content ?? {};
  const summary = props.contactSummary;
  const phone = str(c.phone) || summary?.phone || '';
  const email = str(c.email) || summary?.email || '';
  const address = str(c.address) || summary?.address || '';
  const hours = str(c.hours) || summary?.hours || '';
  const mapUrl = str(c.mapUrl) || summary?.mapUrl || '';
  const name = str(c.hospitalName) || props.hospitalName || 'Hospital';

  return {
    hospitalName: name,
    year: new Date().getFullYear(),
    privacyHref: props.siteLinks?.privacy || 'privacy/',
    pages: props.navPages ?? [],
    tagline: str(c.tagline) || undefined,
    contact: {
      phone: phone || undefined,
      phoneHref: phone ? telHref(phone) : props.siteLinks?.tel,
      email: email || undefined,
      address: address || undefined,
      hours: hours || undefined,
      directionsHref:
        props.siteLinks?.directions ||
        toDirectionsUrl(mapUrl || undefined, address || undefined) ||
        sanitizeMapUrl(mapUrl) ||
        undefined,
    },
  };
}

function asSectionLayout(Inner: FooterLayoutComponent): LayoutComponent {
  return function FooterSectionLayout(props: LayoutProps) {
    return createElement(Inner, footerPropsFromLayout(props));
  };
}

/** Section layouts (Layout pane / resolveLayout) — same 01–10 as chrome. */
export const layouts: Record<number, LayoutComponent> = {
  1: asSectionLayout(Layout01),
  2: asSectionLayout(Layout02),
  3: asSectionLayout(Layout03),
  4: asSectionLayout(Layout04),
  5: asSectionLayout(Layout05),
  6: asSectionLayout(Layout06),
  7: asSectionLayout(Layout07),
  8: asSectionLayout(Layout08),
  9: asSectionLayout(Layout09),
  10: asSectionLayout(Layout10),
};

export function resolveFooterLayout(version?: number): FooterLayoutComponent {
  const v = Math.min(10, Math.max(1, Number(version) || 1));
  return FOOTER_LAYOUTS[v] ?? Layout01;
}

export type { FooterProps, FooterContact, FooterNavLink } from './types';
export {
  Layout01,
  Layout02,
  Layout03,
  Layout04,
  Layout05,
  Layout06,
  Layout07,
  Layout08,
  Layout09,
  Layout10,
};
