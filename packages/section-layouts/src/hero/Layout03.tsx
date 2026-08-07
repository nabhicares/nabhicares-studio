import type { LayoutProps } from '../types';
import {
  bodyStyle,
  buttonGhostStyle,
  buttonPrimaryStyle,
  sectionBaseStyle,
  titleStyle,
} from '../styles';
import { normalizeHero } from '../content';
import { TreatedMedia } from '../polish';
import { resolveHref } from './bits';

/** Image left / text right */
export function Layout03({ content, siteLinks }: LayoutProps) {
  const c = normalizeHero(content);
  const primaryHref = resolveHref(c.ctaPrimaryHref, siteLinks?.contact, siteLinks);
  const secondaryHref = resolveHref(c.ctaSecondaryHref, siteLinks?.services, siteLinks);

  return (
    <section
      style={{
        ...sectionBaseStyle,
        padding: 0,
        display: 'flex',
        flexWrap: 'wrap-reverse',
        minHeight: 'min(68vh, 620px)',
      }}
    >
      <TreatedMedia
        src={c.image}
        aspectRatio="4 / 3"
        emptyIcon="local_hospital"
        emptyLabel="Add a hero image in Studio"
        style={{
          flex: '1.4 1 340px',
          minHeight: 260,
          borderRadius: 0,
          height: 'auto',
          alignSelf: 'stretch',
        }}
      />
      <div
        style={{
          flex: '1 1 320px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'var(--space-section-y) 1.75rem',
        }}
      >
        <h1 style={{ ...titleStyle, fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)' }}>{c.title}</h1>
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
    </section>
  );
}
