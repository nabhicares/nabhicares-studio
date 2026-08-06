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
  // Subtle emphasis: base paper vs slightly cooler/tint surface — not heavy cards.
  const evenBg = 'var(--color-bg)';
  const oddBg = 'color-mix(in srgb, var(--color-surface) 55%, var(--color-bg))';
  const emphasize =
    section.type === 'services' ||
    section.type === 'testimonials' ||
    section.type === 'contact' ||
    section.type === 'doctors';

  return (
    <div
      data-section-type={section.type}
      data-section-id={section.id}
      data-layout={section.layoutVersion ?? 1}
      id={section.type === 'services' ? 'services' : undefined}
      style={{
        ['--section-bg' as string]: emphasize
          ? 'color-mix(in srgb, var(--color-surface) 45%, var(--color-bg))'
          : index % 2 === 0
            ? evenBg
            : oddBg,
        margin: isHero ? 0 : 0,
        borderTop: isHero ? undefined : '1px solid color-mix(in srgb, var(--color-fg) 8%, transparent)',
      }}
    >
      <Layout content={section.content ?? {}} siteLinks={siteLinks} />
    </div>
  );
}
