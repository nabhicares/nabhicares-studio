import type { SitePage } from '@/lib/types';
import { SectionRenderer } from './SectionRenderer';

export function PageView({
  hospitalName,
  page,
}: {
  hospitalName: string;
  page: SitePage;
}) {
  return (
    <>
      <main
        style={{
          maxWidth: 'var(--content-max, 720px)',
          margin: '0 auto',
          padding: 'var(--space-section-y, 2rem) 1.25rem',
        }}
      >
        <header style={{ marginBottom: '1.5rem' }}>
          <p
            style={{
              margin: 0,
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-muted, #666)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {hospitalName}
          </p>
          <h1
            style={{
              margin: '0.35rem 0 0',
              fontFamily: 'var(--font-display, Georgia, serif)',
              fontSize: '2rem',
              color: 'var(--color-fg)',
            }}
          >
            {page.slug === 'home' ? 'Home' : page.slug}
          </h1>
        </header>
        {page.sections.length === 0 ? (
          <p style={{ color: 'var(--color-muted)' }}>No enabled sections on this page.</p>
        ) : (
          page.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))
        )}
      </main>
      <footer
        style={{
          maxWidth: 'var(--content-max, 720px)',
          margin: '0 auto',
          padding: '2rem 1.25rem 3rem',
          fontFamily: 'var(--font-body)',
          fontSize: '0.85rem',
          color: 'var(--color-muted)',
        }}
      >
        <a
          href={page.slug === 'home' ? 'privacy/' : '../privacy/'}
          style={{ color: 'var(--color-accent)' }}
        >
          Privacy
        </a>
      </footer>
    </>
  );
}
