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

/** Full-bleed image plane + hospital-forward copy */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section
      style={{
        ...sectionBaseStyle,
        padding: 0,
        position: 'relative',
        minHeight: 'min(88vh, 720px)',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        background: c.image ? undefined : placeholderGradient,
        backgroundImage: c.image ? `url(${c.image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: c.image
            ? 'linear-gradient(105deg, color-mix(in srgb, var(--color-fg) 78%, transparent) 0%, color-mix(in srgb, var(--color-fg) 35%, transparent) 48%, transparent 78%)'
            : 'linear-gradient(160deg, color-mix(in srgb, var(--color-bg) 55%, transparent) 0%, transparent 55%)',
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
            color: c.image ? '#F7F9F8' : 'var(--color-fg)',
            textWrap: 'balance' as never,
          }}
        >
          {c.title}
        </h1>
        <p
          style={{
            ...bodyStyle,
            color: c.image
              ? 'color-mix(in srgb, #F7F9F8 88%, transparent)'
              : 'var(--color-muted)',
            maxWidth: '34rem',
            marginBottom: '1.75rem',
          }}
        >
          {c.body}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {c.ctaPrimary ? (
            <a
              href="#"
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
              href="#"
              style={{
                ...buttonGhostStyle,
                color: c.image ? '#F7F9F8' : 'var(--color-fg)',
                borderColor: c.image
                  ? 'color-mix(in srgb, #F7F9F8 45%, transparent)'
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
