import type { LayoutProps } from '../types';
import {
  bodyStyle,
  buttonGhostStyle,
  buttonPrimaryStyle,
  imageTreatmentStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeHero } from '../content';
import { TreatedMedia, elevatedCardStyle } from '../polish';
import { resolveHeroCtaHref } from './bits';

/** Floating card on soft surface */
export function Layout10({ content, siteLinks }: LayoutProps) {
  const c = normalizeHero(content);
  const primaryHref = resolveHeroCtaHref(c.ctaPrimaryHref, c.ctaPrimary, 'primary', siteLinks);
  const secondaryHref = resolveHeroCtaHref(c.ctaSecondaryHref, c.ctaSecondary, 'secondary', siteLinks);

  return (
    <section
      style={{
        ...sectionBaseStyle,
        background: 'color-mix(in srgb, var(--color-surface) 50%, var(--color-bg))',
        display: 'grid',
        placeItems: 'center',
        minHeight: 'min(64vh, 600px)',
      }}
    >
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: 0,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          ...elevatedCardStyle,
          padding: 0,
          overflow: 'hidden',
          maxWidth: 960,
        }}
      >
        <div style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ ...titleStyle, fontSize: 'clamp(1.6rem, 3vw, 2.35rem)' }}>{c.title}</h1>
          <p style={bodyStyle}>{c.body}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
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
        <div style={{ ...imageTreatmentStyle, minHeight: 260, borderRadius: 0 }}>
          <TreatedMedia
            src={c.image}
            aspectRatio="auto"
            emptyIcon="local_hospital"
            emptyLabel="Add a hero image in Studio"
            style={{ height: '100%', minHeight: 260, borderRadius: 0 }}
          />
        </div>
      </div>
    </section>
  );
}
