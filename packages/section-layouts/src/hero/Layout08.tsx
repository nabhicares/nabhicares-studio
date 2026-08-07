import type { LayoutProps } from '../types';
import {
  bodyStyle,
  buttonGhostStyle,
  buttonPrimaryStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeHero } from '../content';
import { TreatedMedia } from '../polish';
import { resolveHeroCtaHref } from './bits';

/** Eyebrow + image with CTA strip */
export function Layout08({ content, siteLinks }: LayoutProps) {
  const c = normalizeHero(content);
  const primaryHref = resolveHeroCtaHref(c.ctaPrimaryHref, c.ctaPrimary, 'primary', siteLinks);
  const secondaryHref = resolveHeroCtaHref(c.ctaSecondaryHref, c.ctaSecondary, 'secondary', siteLinks);

  return (
    <section
      style={{
        ...sectionBaseStyle,
        background: 'color-mix(in srgb, var(--color-surface) 35%, var(--color-bg))',
      }}
    >
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        <div>
          <p
            style={{
              ...mutedStyle,
              margin: '0 0 0.75rem',
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Hospital care
          </p>
          <h1 style={{ ...titleStyle, fontSize: 'clamp(1.8rem, 3.2vw, 2.7rem)' }}>{c.title}</h1>
          <p style={bodyStyle}>{c.body}</p>
        </div>
        <div>
          <TreatedMedia
            src={c.image}
            aspectRatio="16 / 10"
            emptyIcon="local_hospital"
            emptyLabel="Add a hero image in Studio"
            style={{ marginBottom: '1rem' }}
          />
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {c.ctaPrimary ? (
              <a href={primaryHref} className="nabhi-btn" style={{ ...buttonPrimaryStyle, flex: '1 1 140px' }}>
                {c.ctaPrimary}
              </a>
            ) : null}
            {c.ctaSecondary ? (
              <a href={secondaryHref} className="nabhi-btn" style={{ ...buttonGhostStyle, flex: '1 1 140px' }}>
                {c.ctaSecondary}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
