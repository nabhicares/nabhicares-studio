import type { LayoutProps } from '../types';
import {
  bodyStyle,
  buttonGhostStyle,
  buttonPrimaryStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeHero } from '../content';
import { TreatedMedia, elevatedCardStyle } from '../polish';
import { resolveHeroCtaHref } from './bits';

/** Asymmetric bento */
export function Layout06({ content, siteLinks }: LayoutProps) {
  const c = normalizeHero(content);
  const primaryHref = resolveHeroCtaHref(c.ctaPrimaryHref, c.ctaPrimary, 'primary', siteLinks);
  const secondaryHref = resolveHeroCtaHref(c.ctaSecondaryHref, c.ctaSecondary, 'secondary', siteLinks);

  return (
    <section style={sectionBaseStyle}>
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: '1.25rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          alignItems: 'stretch',
        }}
      >
        <div
          style={{
            ...elevatedCardStyle,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: 320,
            padding: '1.5rem',
          }}
        >
          <h1 style={{ ...titleStyle, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>{c.title}</h1>
          <p style={bodyStyle}>{c.body}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: 'auto' }}>
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
        <TreatedMedia
          src={c.image}
          aspectRatio="4 / 5"
          emptyIcon="local_hospital"
          emptyLabel="Add a hero image in Studio"
          style={{ minHeight: 320 }}
        />
        <div
          style={{
            background: 'var(--color-accent)',
            borderRadius: 'calc(var(--radius-button) + 4px)',
            minHeight: 120,
            display: 'grid',
            placeItems: 'center',
            padding: '1.5rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            color: 'var(--color-fg)',
            boxShadow: '0 4px 18px color-mix(in srgb, var(--color-fg) 6%, transparent)',
          }}
        >
          Trusted care
        </div>
      </div>
    </section>
  );
}
