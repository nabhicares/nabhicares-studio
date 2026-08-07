import { PageView } from '@/components/PageView';
import { extractContactSummary } from '@/lib/site-chrome';
import { getPage, homeSlug, loadSiteData } from '@/lib/site-data';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  const site = loadSiteData();
  const home = homeSlug(site);
  // Home is rendered by app/page.tsx — skip it here to avoid duplicate routes.
  return site.pages
    .filter((p) => p.slug !== home && p.slug !== '')
    .map((p) => ({ slug: p.slug }));
}

export default function SlugPage({ params }: { params: { slug: string } }) {
  const site = loadSiteData();
  const page = getPage(site, params.slug);
  if (!page) notFound();
  return (
    <PageView
      hospitalName={site.hospitalName}
      hospitalSlug={site.hospitalSlug}
      page={page}
      pages={site.pages}
      contact={extractContactSummary(site.pages)}
    />
  );
}
