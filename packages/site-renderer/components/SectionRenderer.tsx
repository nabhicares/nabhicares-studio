import { resolveLayout } from '@nabhicares/section-layouts';
import type { SiteSection } from '@/lib/types';
import { hrefForPage } from '@/lib/site-chrome';

export function SectionRenderer({
  section,
  pageSlug = 'home',
}: {
  section: SiteSection;
  pageSlug?: string;
}) {
  const Layout = resolveLayout(section.type, section.layoutVersion ?? 1);
  const isHome = pageSlug === 'home' || pageSlug === '';
  const siteLinks = {
    home: hrefForPage(pageSlug, 'home'),
    contact: hrefForPage(pageSlug, 'contact'),
    doctors: hrefForPage(pageSlug, 'doctors'),
    services: isHome ? '#services' : '../#services',
  };
  return (
    <div
      data-section-type={section.type}
      data-section-id={section.id}
      data-layout={section.layoutVersion ?? 1}
      id={section.type === 'services' ? 'services' : undefined}
    >
      <Layout content={section.content ?? {}} siteLinks={siteLinks} />
    </div>
  );
}
