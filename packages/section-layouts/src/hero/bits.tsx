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
