import { resolveLayout } from '@nabhicares/section-layouts';
import type { SiteSection } from '@/lib/types';

export function SectionRenderer({ section }: { section: SiteSection }) {
  const Layout = resolveLayout(section.type, section.layoutVersion ?? 1);
  return (
    <div data-section-type={section.type} data-section-id={section.id} data-layout={section.layoutVersion ?? 1}>
      <Layout content={section.content ?? {}} />
    </div>
  );
}
