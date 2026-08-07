import type { SiteLinks } from './types';

const PAGE_LINK_KEYS: Record<string, keyof SiteLinks> = {
  home: 'home',
  contact: 'contact',
  doctors: 'doctors',
  services: 'services',
};

/** Unwrap markdown links and decode repeated &amp; entities from pasted Maps URLs. */
export function sanitizeMapUrl(raw?: string): string | undefined {
  if (!raw?.trim()) return undefined;
  let s = raw.trim();
  for (let i = 0; i < 4 && /&amp;/i.test(s); i += 1) {
    s = s.replace(/&amp;/gi, '&');
  }

  const mdExact = s.match(/^\[([^\]]*)\]\(([^)]+)\)\s*$/);
  if (mdExact) {
    s = (mdExact[2] || mdExact[1]).trim();
    for (let i = 0; i < 4 && /&amp;/i.test(s); i += 1) {
      s = s.replace(/&amp;/gi, '&');
    }
  } else {
    const mdLoose = s.match(/\[(https?:\/\/[^\]]+)\]\((https?:\/\/[^)]+)\)/i);
    if (mdLoose) s = mdLoose[2].trim();
  }

  try {
    const u = new URL(s);
    if (u.protocol === 'http:' || u.protocol === 'https:') return u.href;
  } catch {
    const m = s.match(/https?:\/\/[^\s\]\)"']+/i);
    if (m) {
      try {
        return new URL(m[0].replace(/&amp;/gi, '&')).href;
      } catch {
        /* ignore */
      }
    }
  }
  return undefined;
}

function extractDestination(from: string): string | undefined {
  const at = from.match(/@(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
  if (at) return `${at[1]},${at[2]}`;

  const pinned = from.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (pinned) return `${pinned[1]},${pinned[2]}`;

  try {
    const u = new URL(from);
    const q =
      u.searchParams.get('destination') ||
      u.searchParams.get('daddr') ||
      u.searchParams.get('q') ||
      u.searchParams.get('query');
    if (q?.trim()) return q.trim();

    const place = u.pathname.match(/\/place\/([^/]+)/);
    if (place?.[1]) {
      return decodeURIComponent(place[1].replace(/\+/g, ' '));
    }
  } catch {
    /* ignore */
  }

  return undefined;
}

/**
 * Open Google Maps in directions mode (web or app).
 * Prefer coordinates from a place URL, then address, then a cleaned place link.
 */
export function toDirectionsUrl(mapUrl?: string, address?: string): string | undefined {
  const cleaned = sanitizeMapUrl(mapUrl);
  const addr = (address ?? '').trim();

  const destination =
    (cleaned ? extractDestination(cleaned) : undefined) ||
    (mapUrl ? extractDestination(mapUrl) : undefined) ||
    (addr || undefined);

  if (destination) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  }

  return cleaned;
}

/** Build a dialable tel: href; normalize common Indian local numbers to +91. */
export function telHref(phone: string): string {
  let digits = phone.replace(/[^\d+]/g, '');
  if (!digits) return 'tel:';
  if (digits.startsWith('+')) return `tel:${digits}`;
  if (digits.startsWith('0') && digits.length >= 10) {
    digits = `+91${digits.slice(1)}`;
  } else if (/^[6-9]\d{9}$/.test(digits)) {
    digits = `+91${digits}`;
  } else if (/^91[6-9]\d{9}$/.test(digits)) {
    digits = `+${digits}`;
  }
  return `tel:${digits}`;
}

/**
 * Resolve CTA hrefs for static export.
 * Remaps bare page paths (contact/, /services) through page-aware siteLinks
 * so nested pages do not resolve to /contact/contact/.
 */
export function resolveHref(
  explicit: string | undefined,
  fallback: string | undefined,
  siteLinks?: SiteLinks,
): string {
  const raw = (explicit?.trim() || fallback || '#').trim();
  if (!raw || raw === '#') return '#';

  if (/^tel:/i.test(raw)) return telHref(raw.slice(4));
  if (/^(mailto|sms):/i.test(raw)) return raw;

  if (raw.startsWith('#')) return raw;

  if (
    raw.startsWith('[') ||
    /^https?:\/\//i.test(raw) ||
    raw.includes('google.com/maps') ||
    raw.includes('maps.google') ||
    raw.includes('maps.app.goo.gl') ||
    raw.includes('goo.gl/maps')
  ) {
    const directions = toDirectionsUrl(raw);
    if (directions) return directions;
    if (/^https?:\/\//i.test(raw)) return raw;
  }

  const slug = raw
    .replace(/^\.\.\//, '')
    .replace(/^\.\//, '')
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .split(/[?#]/)[0];
  const key = PAGE_LINK_KEYS[slug];
  if (key && siteLinks?.[key]) return siteLinks[key]!;

  return raw;
}
