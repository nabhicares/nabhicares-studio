import type { SitePage } from '@/lib/types';

export type NavPage = { slug: string; label: string };

export type SiteContactSummary = {
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  mapUrl?: string;
};

const SLUG_LABELS: Record<string, string> = {
  home: 'Home',
  doctors: 'Doctors',
  contact: 'Contact',
  services: 'Services',
  about: 'About',
  gallery: 'Gallery',
};

export function labelForSlug(slug: string): string {
  if (SLUG_LABELS[slug]) return SLUG_LABELS[slug];
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Pages shown in header/footer nav (skip privacy-only routes). */
export function navPagesFromSite(pages: { slug: string }[]): NavPage[] {
  const order = ['home', 'doctors', 'services', 'about', 'contact'];
  const ranked = [...pages]
    .filter((p) => p.slug && p.slug !== 'privacy')
    .sort((a, b) => {
      const ai = order.indexOf(a.slug);
      const bi = order.indexOf(b.slug);
      if (ai === -1 && bi === -1) return a.slug.localeCompare(b.slug);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  return ranked.map((p) => ({ slug: p.slug, label: labelForSlug(p.slug) }));
}

export function hrefForPage(currentSlug: string, targetSlug: string): string {
  const isHome = currentSlug === 'home' || currentSlug === '';
  if (targetSlug === 'home' || targetSlug === '') {
    return isHome ? './' : '../';
  }
  return isHome ? `${targetSlug}/` : `../${targetSlug}/`;
}

export function extractContactSummary(pages: SitePage[]): SiteContactSummary {
  let best: SiteContactSummary = {};
  let score = 0;
  for (const page of pages) {
    for (const section of page.sections) {
      if (section.type !== 'contact') continue;
      const c = section.content ?? {};
      const next: SiteContactSummary = {
        phone: typeof c.phone === 'string' && c.phone.trim() ? c.phone.trim() : undefined,
        email: typeof c.email === 'string' && c.email.trim() ? c.email.trim() : undefined,
        address: typeof c.address === 'string' && c.address.trim() ? c.address.trim() : undefined,
        hours: typeof c.hours === 'string' && c.hours.trim() ? c.hours.trim() : undefined,
        mapUrl:
          typeof c.mapUrl === 'string' && c.mapUrl.trim()
            ? sanitizeMapUrl(c.mapUrl.trim()) ?? c.mapUrl.trim()
            : undefined,
      };
      const nextScore =
        (next.phone ? 4 : 0) +
        (next.address ? 3 : 0) +
        (next.mapUrl ? 2 : 0) +
        (next.email ? 1 : 0) +
        (next.hours ? 1 : 0) +
        (page.slug === 'contact' ? 2 : 0);
      if (nextScore > score) {
        best = next;
        score = nextScore;
      }
    }
  }
  return best;
}

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
