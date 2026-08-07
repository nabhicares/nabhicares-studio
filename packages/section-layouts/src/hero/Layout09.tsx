import type { LayoutProps } from '../types';
import {
  bodyStyle,
  buttonGhostStyle,
  buttonPrimaryStyle,
  imageTreatmentStyle,
  placeholderGradient,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeHero } from '../content';
import { resolveHref } from './bits';

/** Dense clinical — headline / body split, full-bleed image */
export function Layout09({ content, siteLinks }: LayoutProps) {
  const c = normalizeHero(content);
  const primaryHref = resolveHref(c.ctaPrimaryHref, siteLinks?.contact, siteLinks);
  const secondaryHref = resolveHref(c.ctaSecondaryHref, siteLinks?.services, siteLinks);

  return (
    <section style={{ ...sectionBaseStyle, paddingBottom: 0 }}>
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ ...titleStyle, fontSize: 'clamp(1.9rem, 3.5vw, 2.9rem)', margin: 0 }}>{c.title}</h1>
        <div>
          <p style={{ ...bodyStyle, marginBottom: '1.25rem' }}>{c.body}</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {c.ctaPrimary ? (
              <a href={primaryHref} className="nabhi-btn" style={buttonPrimaryStyle}>
                {c.ctaPrimary}
              </a>
            ) : null}
            {c.ctaSecondary ? (
              <a href={secondaryHref} className="nabhi-btn" style={buttonGhostStyle}>
                {c.ctaSecondary}
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <div
        style={{
          ...imageTreatmentStyle,
          width: '100%',
          height: 'clamp(180px, 28vw, 320px)',
          borderRadius: 0,
          position: 'relative',
          backgroundImage: c.image ? `url(${c.image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {!c.image ? (
          <div
            className="nabhi-empty-media"
            style={{
              width: '100%',
              height: '100%',
              minHeight: 180,
              background: placeholderGradient,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--color-accent)' }}>
              local_hospital
            </span>
            <span style={{ fontSize: '0.85rem' }}>Add a hero image in Studio</span>
          </div>
        ) : (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, transparent 40%, color-mix(in srgb, var(--color-fg) 18%, transparent))',
            }}
          />
        )}
      </div>
    </section>
  );
}
