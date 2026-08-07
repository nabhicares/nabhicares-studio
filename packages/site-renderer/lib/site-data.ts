import { readFileSync } from 'fs';
import { join } from 'path';
import type { SiteData, SitePage } from './types';
import { DEFAULT_DESIGN_TOKENS, type DesignTokens } from '@nabhicares/section-registry';

export type SiteDataWithDesign = SiteData & {
  designTokens?: DesignTokens;
  builtAt?: string;
  /** Absolute site origin baked at publish, e.g. https://slug.nabhilabs.info */
  publicOrigin?: string;
  customDomain?: string | null;
  ogImage?: string | null;
  /** Resolved absolute share-card image (custom, hero, or generated). */
  resolvedOgImage?: string | null;
};

export function loadSiteData(): SiteDataWithDesign {
  const path = join(process.cwd(), 'data', 'site.json');
  return JSON.parse(readFileSync(path, 'utf8')) as SiteDataWithDesign;
}

export function getPage(site: SiteData, slug: string): SitePage | undefined {
  return site.pages.find((p) => p.slug === slug);
}

export function homeSlug(site: SiteData): string {
  if (site.pages.some((p) => p.slug === 'home')) return 'home';
  if (site.pages.some((p) => p.slug === '')) return '';
  return site.pages[0]?.slug ?? 'home';
}

export function tokensToCssVars(tokens: DesignTokens = DEFAULT_DESIGN_TOKENS): string {
  return [
    `--color-bg: ${tokens.colors.background}`,
    `--color-fg: ${tokens.colors.foreground}`,
    `--color-accent: ${tokens.colors.accent}`,
    `--color-muted: ${tokens.colors.muted}`,
    `--color-surface: ${tokens.colors.surface}`,
    `--font-display: ${tokens.typography.displayFamily}`,
    `--font-body: ${tokens.typography.bodyFamily}`,
    `--font-size-base: ${tokens.typography.baseSize}`,
    `--space-section-y: ${tokens.spacing.sectionY}`,
    `--content-max: ${tokens.spacing.contentMax}`,
    `--radius-button: ${tokens.radii.button}`,
  ].join('; ');
}

/** Public https origin for OG/canonical URLs (subdomain or custom domain). */
export function resolvePublicOrigin(site: SiteDataWithDesign): string {
  if (site.publicOrigin?.trim()) {
    return site.publicOrigin.trim().replace(/\/$/, '') + '/';
  }
  if (site.customDomain?.trim()) {
    const host = site.customDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `https://${host}/`;
  }
  const root = (process.env.CDN_ROOT_DOMAIN || process.env.NEXT_PUBLIC_CDN_ROOT_DOMAIN || '')
    .replace(/^\./, '')
    .toLowerCase();
  if (root && site.hospitalSlug) {
    return `https://${site.hospitalSlug}.${root}/`;
  }
  const base = (process.env.SITE_PUBLIC_ORIGIN || '').replace(/\/$/, '');
  if (base) return `${base}/`;
  return `https://${site.hospitalSlug || 'hospital'}.example.com/`;
}

function isAbsoluteHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

/** Absolute image URL for WhatsApp / Meta / Twitter cards. */
export function resolveOgImageUrl(site: SiteDataWithDesign): string | undefined {
  if (site.resolvedOgImage && isAbsoluteHttpUrl(site.resolvedOgImage)) {
    return site.resolvedOgImage.trim();
  }
  if (site.ogImage && isAbsoluteHttpUrl(site.ogImage)) {
    return site.ogImage.trim();
  }
  const origin = resolvePublicOrigin(site).replace(/\/$/, '');
  // Worker uploads branded og.png; prefer custom/hero https when set (better for WhatsApp).
  return `${origin}/og.png`;
}
