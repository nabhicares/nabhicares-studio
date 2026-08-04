import { readFileSync } from 'fs';
import { join } from 'path';
import type { SiteData, SitePage } from './types';
import { DEFAULT_DESIGN_TOKENS, type DesignTokens } from '@nabhicares/section-registry';

export type SiteDataWithDesign = SiteData & {
  designTokens?: DesignTokens;
  builtAt?: string;
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
