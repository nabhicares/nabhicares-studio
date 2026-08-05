import type { SitePage } from '@/lib/types';
import { SectionRenderer } from './SectionRenderer';

export function PageView({
  hospitalName,
  page,
}: {
  hospitalName: string;
  page: SitePage;
}) {
  const isHome = page.slug === 'home' || page.slug === '';

  return (
    <>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '1.1rem clamp(1.25rem, 4vw, 2rem)',
          borderBottom: '1px solid color-mix(in srgb, var(--color-fg) 8%, transparent)',
          background: 'color-mix(in srgb, var(--color-bg) 92%, transparent)',
          position: 'sticky',
          top: 0,
          zIndex: 20,
          backdropFilter: 'blur(10px)',
        }}
      >
        <a
          href={isHome ? './' : '../'}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: 'var(--color-fg)',
            textDecoration: 'none',
            lineHeight: 1.15,
          }}
        >
          {hospitalName}
        </a>
        <nav
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--color-muted)',
          }}
        >
          {!isHome ? (
            <a href="../" style={{ color: 'inherit', textDecoration: 'none' }}>
              Home
            </a>
          ) : null}
          <a
            href={isHome ? 'privacy/' : '../privacy/'}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Privacy
          </a>
        </nav>
      </header>

      <main style={{ width: '100%' }}>
        {page.sections.length === 0 ? (
          <p
            style={{
              color: 'var(--color-muted)',
              padding: 'var(--space-section-y) clamp(1.25rem, 4vw, 2rem)',
              fontFamily: 'var(--font-body)',
            }}
          >
            No enabled sections on this page.
          </p>
        ) : (
          page.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))
        )}
      </main>

      <footer
        style={{
          padding: '2.5rem clamp(1.25rem, 4vw, 2rem) 3rem',
          fontFamily: 'var(--font-body)',
          fontSize: '0.85rem',
          color: 'var(--color-muted)',
          borderTop: '1px solid color-mix(in srgb, var(--color-fg) 8%, transparent)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--content-max, 1120px)',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontFamily: 'var(--font-display)', color: 'var(--color-fg)', fontWeight: 600 }}>
            {hospitalName}
          </span>
          <a
            href={isHome ? 'privacy/' : '../privacy/'}
            style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
          >
            Privacy
          </a>
        </div>
      </footer>
    </>
  );
}
