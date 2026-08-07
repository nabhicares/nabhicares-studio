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
import { TreatedMedia } from '../polish';
import { resolveHref } from './bits';

/** Stacked editorial — copy then wide image band */
export function Layout04({ content, siteLinks }: LayoutProps) {
  const c = normalizeHero(content);
  const primaryHref = resolveHref(c.ctaPrimaryHref, siteLinks?.contact);
  const secondaryHref = resolveHref(c.ctaSecondaryHref, siteLinks?.services);

  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, marginBottom: '1.75rem' }}>
        <h1 style={{ ...titleStyle, fontSize: 'clamp(2rem, 4vw, 3rem)', maxWidth: '18ch' }}>{c.title}</h1>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ ...bodyStyle, margin: 0 }}>{c.body}</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0, flexWrap: 'wrap' }}>
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
      <div style={wideContainerStyle}>
        <TreatedMedia
          src={c.image}
          aspectRatio="21 / 9"
          emptyIcon="local_hospital"
          emptyLabel="Add a hero image in Studio"
          style={{ minHeight: 'clamp(200px, 32vw, 360px)' }}
        />
      </div>
    </section>
  );
}
