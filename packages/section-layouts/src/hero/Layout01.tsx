import type { LayoutProps } from '../types';
import {
  bodyStyle,
  buttonGhostStyle,
  buttonPrimaryStyle,
  placeholderGradient,
  sectionBaseStyle,
  titleStyle,
} from '../styles';
import { normalizeHero } from '../content';
import { resolveHref } from './bits';

/** Full-bleed image plane + hospital-forward copy */
export function Layout01({ content, siteLinks }: LayoutProps) {
  const c = normalizeHero(content);
  const primaryHref = resolveHref(c.ctaPrimaryHref, siteLinks?.contact, siteLinks);
  const secondaryHref = resolveHref(c.ctaSecondaryHref, siteLinks?.services, siteLinks);
  const onImage = Boolean(c.image);
  const titleColor = onImage ? 'var(--color-bg)' : 'var(--color-fg)';
  const bodyColor = onImage
    ? 'color-mix(in srgb, var(--color-bg) 88%, transparent)'
    : 'var(--color-muted)';

  return (
    <section
      style={{
        ...sectionBaseStyle,
        padding: 0,
        position: 'relative',
        minHeight: 'min(var(--hero-vh, 88vh), 720px)',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        background: c.image ? undefined : undefined,
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
          background: c.image
            ? 'linear-gradient(105deg, color-mix(in srgb, var(--color-fg) 78%, transparent) 0%, color-mix(in srgb, var(--color-fg) 35%, transparent) 48%, transparent 78%)'
            : 'linear-gradient(160deg, color-mix(in srgb, var(--color-bg) 70%, transparent) 0%, color-mix(in srgb, var(--color-bg) 35%, transparent) 55%)',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          padding: 'clamp(3rem, 10vw, 5.5rem) clamp(1.25rem, 4vw, 2rem)',
          animation: 'nabhi-hero-rise 700ms ease-out both',
        }}
      >
        <style>{`
          @keyframes nabhi-hero-rise {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <h1
          style={{
            ...titleStyle,
            fontSize: 'clamp(2.35rem, 6.5vw, 4rem)',
            marginBottom: '1rem',
            maxWidth: '14ch',
            color: titleColor,
            textWrap: 'balance' as never,
          }}
        >
          {c.title}
        </h1>
        <p
          style={{
            ...bodyStyle,
            color: bodyColor,
            maxWidth: '34rem',
            marginBottom: '1.75rem',
          }}
        >
          {c.body}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {c.ctaPrimary ? (
            <a
              href={primaryHref}
              className="nabhi-btn"
              style={{
                ...buttonPrimaryStyle,
                boxShadow: '0 10px 28px color-mix(in srgb, var(--color-fg) 18%, transparent)',
              }}
            >
              {c.ctaPrimary}
            </a>
          ) : null}
          {c.ctaSecondary ? (
            <a
              href={secondaryHref}
              className="nabhi-btn"
              style={{
                ...buttonGhostStyle,
                color: titleColor,
                borderColor: onImage
                  ? 'color-mix(in srgb, var(--color-bg) 45%, transparent)'
                  : undefined,
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
