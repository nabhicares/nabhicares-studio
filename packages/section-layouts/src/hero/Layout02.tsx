import type { LayoutProps } from '../types';
import {
  bodyStyle,
  buttonGhostStyle,
  buttonPrimaryStyle,
  placeholderGradient,
  sectionBaseStyle,
  titleStyle,
  containerStyle,
} from '../styles';
import { normalizeHero } from '../content';

function resolveHref(
  explicit: string | undefined,
  fallback: string | undefined,
): string {
  if (explicit && explicit.trim()) return explicit.trim();
  return fallback || '#';
}

/** Full-bleed centered overlay */
export function Layout02({ content, siteLinks }: LayoutProps) {
  const c = normalizeHero(content);
  const primaryHref = resolveHref(c.ctaPrimaryHref, siteLinks?.contact);
  const secondaryHref = resolveHref(c.ctaSecondaryHref, siteLinks?.services);
  return (
    <section
      style={{
        ...sectionBaseStyle,
        padding: 0,
        minHeight: 'min(var(--hero-vh, 72vh), 680px)',
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        background: c.image ? undefined : placeholderGradient,
        backgroundImage: c.image
          ? `linear-gradient(color-mix(in srgb, var(--color-fg) 45%, transparent), color-mix(in srgb, var(--color-fg) 45%, transparent)), url(${c.image})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
      }}
    >
      <div style={{ ...containerStyle, textAlign: 'center', padding: '3rem 1.5rem', maxWidth: 720 }}>
        <h1 style={{ ...titleStyle, color: '#fff', fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>{c.title}</h1>
        <p style={{ ...bodyStyle, color: 'rgba(255,255,255,0.88)', margin: '0 auto 1.5rem', maxWidth: '36rem' }}>
          {c.body}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          {c.ctaPrimary ? (
            <a href={primaryHref} className="nabhi-btn" style={buttonPrimaryStyle}>
              {c.ctaPrimary}
            </a>
          ) : null}
          {c.ctaSecondary ? (
            <a
              href={secondaryHref}
              className="nabhi-btn"
              style={{ ...buttonGhostStyle, borderColor: 'rgba(255,255,255,0.45)', color: '#fff' }}
            >
              {c.ctaSecondary}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
