import { PageView } from '@/components/PageView';
import { getPage, homeSlug, loadSiteData } from '@/lib/site-data';

export default function HomePage() {
  const site = loadSiteData();
  const slug = homeSlug(site);
  const page = getPage(site, slug);

  if (!page) {
    return (
      <main style={{ padding: '2rem' }}>
        <p>No pages configured for {site.hospitalName}.</p>
      </main>
    );
  }

  return <PageView hospitalName={site.hospitalName} page={page} />;
}
