import type { LayoutProps } from '../types';
import {
  bodyStyle,
  cardStyle,
  mutedStyle,
  placeholderGradient,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeDoctors } from '../content';

/** 3-column card grid */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeDoctors(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {(c.doctors ?? []).map((d) => (
            <article key={d.name} style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
              <div style={{ height: 160, background: placeholderGradient }}>
                {d.image ? <img src={d.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
              </div>
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.25rem', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{d.name}</h3>
                <p style={{ ...mutedStyle, margin: 0, fontSize: '0.9rem' }}>{d.specialty}</p>
                {d.bio ? <p style={{ ...mutedStyle, margin: '0.6rem 0 0', fontSize: '0.85rem' }}>{d.bio}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
