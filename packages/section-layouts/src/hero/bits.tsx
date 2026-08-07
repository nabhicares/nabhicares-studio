import type { SiteLinks } from '../types';
import { resolveHref as resolveSiteHref } from '../links';

/** Resolve CTA href: explicit content href, then site link, else # */
export function resolveHref(
  explicit: string | undefined,
  fallback: string | undefined,
  siteLinks?: SiteLinks,
): string {
  return resolveSiteHref(explicit, fallback, siteLinks);
}

/**
 * Hero CTA: explicit link wins; otherwise infer from button label, then
 * page defaults (primary → contact/, secondary → #services).
 */
export function resolveHeroCtaHref(
  explicit: string | undefined,
  ctaLabel: string | undefined,
  role: 'primary' | 'secondary',
  siteLinks?: SiteLinks,
): string {
  if (explicit?.trim()) {
    return resolveSiteHref(explicit, undefined, siteLinks);
  }

  const label = (ctaLabel ?? '').toLowerCase();
  if (/call|phone|dial|emergency/.test(label) && siteLinks?.tel) {
    return siteLinks.tel;
  }
  if (/direction|map|locate|find us|navigate|route/.test(label) && siteLinks?.directions) {
    return siteLinks.directions;
  }
  if (/service|explore|treatment|specialt/.test(label) && siteLinks?.services) {
    return siteLinks.services;
  }
  if (/doctor|physician|specialist|our team|meet/.test(label) && siteLinks?.doctors) {
    return siteLinks.doctors;
  }
  if (/book|appoint|contact|visit|enquire|inquire|talk|reach/.test(label) && siteLinks?.contact) {
    return siteLinks.contact;
  }

  if (role === 'primary') {
    return siteLinks?.contact || siteLinks?.tel || '#';
  }
  return siteLinks?.services || siteLinks?.directions || siteLinks?.contact || '#';
}

/** Studio placeholder hint from CTA label + role. */
export function heroCtaHrefPlaceholder(
  ctaLabel: string | undefined,
  role: 'primary' | 'secondary',
): string {
  const label = (ctaLabel ?? '').toLowerCase();
  if (/call|phone|dial|emergency/.test(label)) return 'tel:+91… (hospital phone if blank)';
  if (/direction|map|locate|find us|navigate|route/.test(label)) {
    return 'Maps URL (contact map/address if blank)';
  }
  if (/service|explore|treatment|specialt/.test(label)) return '#services';
  if (/doctor|physician|specialist|our team|meet/.test(label)) return 'doctors/';
  if (/book|appoint|contact|visit|enquire|inquire|talk|reach/.test(label)) return 'contact/';
  return role === 'primary' ? 'contact/' : '#services';
}
