import { resolveLayout } from '@nabhicares/section-layouts';
import type { SiteSection } from '@/lib/types';
import { hrefForPage } from '@/lib/site-chrome';

export function SectionRenderer({
  section,
  pageSlug = 'home',
  index = 0,
}: {
  section: SiteSection;
  pageSlug?: string;
  index?: number;
}) {
  const Layout = resolveLayout(section.type, section.layoutVersion ?? 1);
  const isHome = pageSlug === 'home' || pageSlug === '';
  const siteLinks = {
    home: hrefForPage(pageSlug, 'home'),
    contact: hrefForPage(pageSlug, 'contact'),
    doctors: hrefForPage(pageSlug, 'doctors'),
    services: isHome ? '#services' : '../#services',
  };

  const isHero = section.type === 'hero';
  const evenBg = 'var(--color-bg)';
  const oddBg = 'color-mix(in srgb, var(--color-bg) 85%, var(--color-surface) 15%)';
  const cardBorder = '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)';
  const cardShadow = '0 14px 34px color-mix(in srgb, var(--color-fg) 10%, transparent)';

  return (
    <div
      data-section-type={section.type}
      data-section-id={section.id}
      data-layout={section.layoutVersion ?? 1}
      id={section.type === 'services' ? 'services' : undefined}
      style={{
        // Alternating section rhythm + subtle card grouping.
        ['--section-bg' as string]: index % 2 === 0 ? evenBg : oddBg,
        margin: isHero ? 0 : '0.75rem clamp(1.25rem, 4vw, 2rem)',
        borderRadius: isHero ? 0 : 'calc(var(--radius-button) + 8px)',
        overflow: isHero ? 'visible' : 'hidden',
        border: isHero ? undefined : cardBorder,
        boxShadow: isHero ? undefined : cardShadow,
      }}
    >
      <Layout content={section.content ?? {}} siteLinks={siteLinks} />
    </div>
  );
}
