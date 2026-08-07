import type { LayoutProps } from '../types';
import {
  accentBarStyle,
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

/** Side accent bar + split */
export function Layout07({ content, siteLinks }: LayoutProps) {
  const c = normalizeHero(content);
  const primaryHref = resolveHref(c.ctaPrimaryHref, siteLinks?.contact, siteLinks);
  const secondaryHref = resolveHref(c.ctaSecondaryHref, siteLinks?.services, siteLinks);

  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'flex', gap: '1.5rem', alignItems: 'stretch' }}>
        <div style={{ ...accentBarStyle, width: 6, alignSelf: 'stretch', minHeight: 200 }} />
        <div
          style={{
            flex: 1,
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            alignItems: 'center',
          }}
        >
          <div>
            <h1 style={{ ...titleStyle, fontSize: 'clamp(1.7rem, 3vw, 2.5rem)' }}>{c.title}</h1>
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
          <TreatedMedia
            src={c.image}
            aspectRatio="5 / 4"
            emptyIcon="local_hospital"
            emptyLabel="Add a hero image in Studio"
            style={{ minHeight: 220 }}
          />
        </div>
      </div>
    </section>
  );
}
