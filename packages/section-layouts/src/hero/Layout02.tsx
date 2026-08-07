import type { LayoutProps } from '../types';
import {
  bodyStyle,
  buttonGhostStyle,
  buttonPrimaryStyle,
  containerStyle,
  placeholderGradient,
  sectionBaseStyle,
  titleStyle,
} from '../styles';
import { normalizeHero } from '../content';
import { resolveHeroCtaHref } from './bits';

/** Full-bleed centered overlay */
export function Layout02({ content, siteLinks }: LayoutProps) {
  const c = normalizeHero(content);
  const primaryHref = resolveHeroCtaHref(c.ctaPrimaryHref, c.ctaPrimary, 'primary', siteLinks);
  const secondaryHref = resolveHeroCtaHref(c.ctaSecondaryHref, c.ctaSecondary, 'secondary', siteLinks);
  const onImage = Boolean(c.image);

  return (
    <section
      style={{
        ...sectionBaseStyle,
        padding: 0,
        minHeight: 'min(var(--hero-vh, 72vh), 680px)',
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        backgroundImage: c.image ? `url(${c.image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {!c.image ? (
        <div
          aria-hidden
          className="nabhi-empty-media"
          style={{
            position: 'absolute',
            inset: 0,
            minHeight: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            background: placeholderGradient,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-accent)' }}>
            local_hospital
          </span>
          <span style={{ fontFamily: 'var(--font-body)' }}>Add a hero image in Studio</span>
        </div>
      ) : null}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: onImage
            ? 'linear-gradient(color-mix(in srgb, var(--color-fg) 52%, transparent), color-mix(in srgb, var(--color-fg) 42%, transparent))'
            : 'linear-gradient(160deg, color-mix(in srgb, var(--color-bg) 55%, transparent) 0%, color-mix(in srgb, var(--color-bg) 25%, transparent) 60%)',
        }}
      />
      <div
        style={{
          ...containerStyle,
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '3rem 1.5rem',
          maxWidth: 720,
          color: onImage ? '#fff' : 'var(--color-fg)',
        }}
      >
        <h1
          style={{
            ...titleStyle,
            color: onImage ? '#fff' : 'var(--color-fg)',
            fontSize: 'clamp(2rem, 4vw, 3.25rem)',
          }}
        >
          {c.title}
        </h1>
        <p
          style={{
            ...bodyStyle,
            color: onImage ? 'rgba(255,255,255,0.88)' : 'var(--color-muted)',
            margin: '0 auto 1.5rem',
            maxWidth: '36rem',
          }}
        >
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
              style={{
                ...buttonGhostStyle,
                borderColor: onImage ? 'rgba(255,255,255,0.45)' : undefined,
                color: onImage ? '#fff' : undefined,
              }}
            >
              {c.ctaSecondary}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
